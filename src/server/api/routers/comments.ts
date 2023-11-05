import { TRPCError } from "@trpc/server";
import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import {
  articles,
  comments,
  likesToComment,
  notifications,
} from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const commentsRouter = createTRPCRouter({
  newComment: protectedProcedure
    .input(
      z.object({
        articleId: z.string().trim(),
        content: z.string().trim().min(5).max(255),
        type: z.enum(["COMMENT", "REPLY"]),
        commentId: z.string().trim().optional().nullable(), // comment to who we want to reply
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { articleId, commentId } = input;

      const article = await ctx.db.query.articles.findFirst({
        where: eq(articles.id, articleId),
        columns: {
          id: true,
          title: true,
          slug: true,
          commentsCount: true,
        },
        with: {
          user: {
            columns: {
              id: true,
              username: true,
            },
          },
          comments: {
            columns: {
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
        (await ctx.db.query.comments.findFirst({
          where: eq(comments.id, commentId),
          columns: {
            id: true,
          },
          with: {
            user: {
              columns: {
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

      const newComment = await ctx.db
        .insert(comments)
        .values({
          body: input.content,
          type: input.type,
          articleId,
          userId: ctx.session.user.id,
          ...(input.type === "REPLY" &&
            commentId && {
              parentId: commentId,
            }),
        })
        .returning({
          id: articles.id,
        })
        .then((res) => res[0]?.id as string);

      await ctx.db
        .update(articles)
        .set({
          commentsCount: article.commentsCount + 1,
        })
        .where(eq(articles.id, articleId));

      // Notify the author of the article
      if (input.type === "COMMENT") {
        await ctx.db.insert(notifications).values({
          type: "COMMENT",
          fromId: ctx.session.user.id,
          userId: article.user.id,
          title: article.title,
          body:
            input.content.length > 50
              ? input.content.slice(0, 50) + "..."
              : input.content,
          isRead: false,
          articleAuthor: article.user.username,
          slug: `${article.slug}?commentId=${newComment}`,
        });
      } else if (input.type === "REPLY" && parentComment) {
        await ctx.db.insert(notifications).values([
          {
            type: "COMMENT",
            fromId: ctx.session.user.id,
            userId: article.user.id,
            title: article.title,
            body:
              input.content.length > 50
                ? input.content.slice(0, 50) + "..."
                : input.content,
            isRead: false,
            articleAuthor: article.user.username,
            slug: `${article.slug}?commentId=${newComment}`,
          },
          {
            type: "COMMENT",
            fromId: ctx.session.user.id,
            userId: parentComment.user.id,
            title: article.title,
            body:
              input.content.length > 50
                ? input.content.slice(0, 50) + "..."
                : input.content,
            articleAuthor: article.user.username,
            isRead: false,
            slug: `${article.slug}?commentId=${newComment}`,
          },
        ]);
      }

      return newComment;
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

        const comment = await ctx.db.query.comments.findFirst({
          where: eq(comments.id, commentId),
          with: {
            likes: {
              where: eq(likesToComment.userId, ctx.session.user.id),
              columns: {
                userId: true,
              },
            },
          },
        });

        if (!comment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Comment not found",
          });
        }

        const newComment = await ctx.db
          .update(comments)
          .set({
            likesCount: comment.likes.length
              ? comment.likesCount - 1
              : comment.likesCount + 1,
          })
          .where(eq(comments.id, commentId))
          .returning({
            likesCount: comments.likesCount,
          })
          .then((res) => res[0]);

        return {
          success: true,
          message: comment.likes.length ? "Unliked comment" : "Liked comment",
          hasLiked: !comment.likes.length,
          likesCount: newComment?.likesCount,
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

      const comment = await ctx.db.query.comments.findMany({
        where: and(
          eq(comments.articleId, articleId),
          isNull(comments.parentId)
        ),
        limit: 10,
        with: {
          replies: {
            columns: {
              id: true,
            },
          },
          user: {
            columns: {
              id: true,
              name: true,
              username: true,
              stripeSubscriptionStatus: true,
              image: true,
            },
          },
          likes: {
            columns: {
              userId: true,
            },
          },
        },
        orderBy: [desc(comments.createdAt)],
      });

      const totalComments = await ctx.db.query.comments
        .findMany({
          where: eq(comments.articleId, articleId),
          columns: {
            id: true,
          },
        })
        .then((res) => res.length);

      return {
        totalComments,
        comments: comment.map((comment) => {
          const newComment = {
            ...comment,
            repliesCount: comment.replies.length,
            // repliesCount: comment._count.replies,
          };

          // const { _count, ...res } = newComment;
          // return res;
          return newComment;
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

      const reply = await ctx.db.query.comments.findMany({
        where: eq(comments.parentId, commentId),
        limit: 5,
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              username: true,
              image: true,
              stripeSubscriptionStatus: true,
            },
          },
          likes: {
            columns: {
              userId: true,
            },
          },
        },
        orderBy: [desc(comments.createdAt)],
      });

      const totalReplies = await ctx.db.query.comments
        .findMany({
          where: eq(comments.parentId, commentId),
          columns: {
            id: true,
          },
        })
        .then((res) => res.length);

      return {
        totalReplies,
        replies: reply.map((reply) => {
          const newReply = {
            ...reply,
            // repliesCount: reply._count.replies,
          };
          return newReply;

          // const { _count, ...res } = newReply;
          // return res;
        }),
      };
    }),
});
