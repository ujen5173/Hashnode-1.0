import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const commentsRouter = createTRPCRouter({
  newComment: protectedProcedure
    .input(
      z.object({
        articleId: z.string().trim(),
        content: z.string().trim(),
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
          },
        }));

      if (commentId && !parentComment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      await ctx.prisma.comment.create({
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
      });
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
      })
    )
    .query(async ({ ctx, input }) => {
      const articleId = input.articleId; // Assuming you have the articleId value

      const comments = await ctx.prisma.comment.findMany({
        where: {
          articleId,
          parent: null,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              profile: true,
            },
          },
          likes: {
            select: {
              id: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  profile: true,
                },
              },
              likes: {
                select: {
                  id: true,
                },
              },
              replies: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      username: true,
                      profile: true,
                    },
                  },
                  likes: {
                    select: {
                      id: true,
                    },
                  },
                  replies: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          name: true,
                          username: true,
                          profile: true,
                        },
                      },
                      likes: {
                        select: {
                          id: true,
                        },
                      },
                      replies: {
                        include: {
                          user: {
                            select: {
                              id: true,
                              name: true,
                              username: true,
                              profile: true,
                            },
                          },
                          likes: {
                            select: {
                              id: true,
                            },
                          },
                          replies: {
                            include: {
                              user: {
                                select: {
                                  id: true,
                                  name: true,
                                  username: true,
                                  profile: true,
                                },
                              },
                              likes: {
                                select: {
                                  id: true,
                                },
                              },
                              replies: {
                                include: {
                                  user: {
                                    select: {
                                      id: true,
                                      name: true,
                                      username: true,
                                      profile: true,
                                    },
                                  },
                                  likes: {
                                    select: {
                                      id: true,
                                    },
                                  },
                                  replies: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return comments;
    }),
});
