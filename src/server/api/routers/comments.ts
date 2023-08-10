import { NotificationTypes } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const commentsRouter = createTRPCRouter({
  newComment: protectedProcedure
    .input(
      z.object({
        articleId: z.string().trim(),
        content: z.string().trim().min(5).max(255),
        type: z.enum(["COMMENT", "REPLY"]),
        commentId: z.string().trim().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { articleId, commentId } = input;

      const article = await ctx.prisma.article.findUnique({
        where: {
          id: articleId,
        },
        select: {
          id: true,
          title: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          slug: true,
          comments: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!article) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      const parentComment =
        commentId &&
        (await ctx.prisma.comment.findUnique({
          where: {
            id: commentId,
          },
          select: {
            id: true,
            user: {
              select: {
                id: true,
              },
            },
          },
        }));

      if (commentId && !parentComment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      const newComment = await ctx.prisma.comment.create({
        data: {
          body: input.content,
          type: input.type,
          article: {
            connect: {
              id: articleId,
            },
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          ...(input.type === "REPLY" &&
            commentId && {
              parent: {
                connect: {
                  id: commentId,
                },
              },
            }),
        },
        select: {
          id: true,
        },
      });

      await ctx.prisma.article.update({
        where: {
          id: articleId,
        },
        data: {
          commentsCount: {
            increment: 1,
          },
        },
      });

      // Notify the author of the article
      if (input.type === "COMMENT") {
        await ctx.prisma.notification.create({
          data: {
            type: NotificationTypes.COMMENT,
            fromId: ctx.session.user.id,
            userId: article.user.id,
            title: article.title,
            body:
              input.content.length > 50
                ? input.content.slice(0, 50) + "..."
                : input.content,
            isRead: false,
            articleAuthor: article.user.username,
            slug: `${article.slug}?commentId=${newComment.id}`,
          },
        });
      } else if (input.type === "REPLY" && parentComment) {
        await ctx.prisma.notification.createMany({
          data: [
            {
              type: NotificationTypes.COMMENT,
              fromId: ctx.session.user.id,
              userId: article.user.id,
              title: article.title,
              body:
                input.content.length > 50
                  ? input.content.slice(0, 50) + "..."
                  : input.content,
              isRead: false,
              articleAuthor: article.user.username,
              slug: `${article.slug}?commentId=${newComment.id}`,
            },
            {
              type: NotificationTypes.COMMENT,
              fromId: ctx.session.user.id,
              userId: parentComment.user.id,
              title: article.title,
              body:
                input.content.length > 50
                  ? input.content.slice(0, 50) + "..."
                  : input.content,
              articleAuthor: article.user.username,
              isRead: false,
              slug: `${article.slug}?commentId=${newComment.id}`,
            },
          ],
        });
      }

      return {
        success: true,
        message: "Commented successfully",
      };
    }),

  likeComment: protectedProcedure
    .input(
      z.object({
        commentId: z.string().trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { commentId } = input;

        const comment = (await ctx.prisma.comment.findUnique({
          where: {
            id: commentId,
          },
          select: {
            likes: {
              select: {
                id: true,
              },
            },
          },
        })) as { likes: { id: string }[] };

        if (!comment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Comment not found",
          });
        }

        const hasLiked = comment.likes.some(
          (like) => like.id === ctx.session.user.id
        );

        const newComment = (await ctx.prisma.comment.update({
          where: {
            id: commentId,
          },
          data: {
            likes: {
              [hasLiked ? "disconnect" : "connect"]: {
                id: ctx.session.user.id,
              },
            },
            likesCount: {
              [hasLiked ? "decrement" : "increment"]: 1,
            },
          },
          select: {
            likes: {
              select: { id: true },
            },
            likesCount: true,
          },
        })) as {
          likes: { id: string }[];
          likesCount: number;
        };

        return {
          success: true,
          message: hasLiked ? "Unliked comment" : "Liked comment",
          hasLiked: !hasLiked,
          likesCount: newComment.likesCount,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  getComments: publicProcedure
    .input(
      z.object({
        articleId: z.string().trim(),
        type: z.enum(["COMMENT", "REPLY"]).default("COMMENT").optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const articleId = input.articleId; // Assuming you have the articleId value

      const comments = await ctx.prisma.comment.findMany({
        where: {
          articleId,
          parent: null,
        },
        take: 10,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              stripeSubscriptionStatus: true,
              profile: true,
            },
          },
          likes: {
            select: {
              id: true,
            },
          },

          _count: {
            select: { replies: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const totalComments = await ctx.prisma.comment.count({
        where: {
          articleId,
        },
      });

      return {
        totalComments,
        comments: comments.map((comment) => {
          const newComment = {
            ...comment,
            repliesCount: comment._count.replies,
          };

          const { _count, ...res } = newComment;
          return res;
        }),
      };
    }),

  getReplies: publicProcedure
    .input(
      z.object({
        commentId: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      const commentId = input.commentId; // Assuming you have the articleId value

      const replies = await ctx.prisma.comment.findMany({
        where: {
          parent: {
            id: commentId,
          },
        },
        take: 5,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              profile: true,
              stripeSubscriptionStatus: true,
            },
          },
          likes: {
            select: {
              id: true,
            },
          },

          _count: {
            select: { replies: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const totalReplies = await ctx.prisma.comment.count({
        where: {
          parent: {
            id: commentId,
          },
        },
      });

      return {
        totalReplies,
        replies: replies.map((reply) => {
          const newReply = {
            ...reply,
            repliesCount: reply._count.replies,
          };

          const { _count, ...res } = newReply;
          return res;
        }),
      };
    }),
});
