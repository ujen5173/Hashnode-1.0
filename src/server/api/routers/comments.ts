import { TRPCError } from "@trpc/server";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { z } from "zod";
import {
  articles,
  comments,
  likesToComment,
  notifications,
  users,
} from "~/server/db/schema";
import { type Comment } from "~/types";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const commentsRouter = createTRPCRouter({
  newComment: protectedProcedure
    .input(
      z.object({
        articleId: z.string().trim(),
        content: z.string().trim().min(5).max(255),
        type: z.enum(["COMMENT", "REPLY"]),
        commentId: z.string().trim().optional().nullable(), // comment to who we want to reply
      }),
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

      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
        columns: {
          id: true,
          name: true,
          username: true,
          image: true,
          stripeSubscriptionStatus: true,
        },
      });

      const newComment = (await ctx.db
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
          id: comments.id,
          body: comments.body,
          likesCount: comments.likesCount,
          type: comments.type,
          parentId: comments.parentId,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt,
        })
        .then((res) => ({
          ...res[0],
          replies: [],
          user: user,
        }))) as Comment;

      if (!newComment) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }

      await ctx.db
        .update(articles)
        .set({
          commentsCount: article.commentsCount + 1,
        })
        .where(eq(articles.id, articleId));

      // Notify the author of the article
      if (input.type === "COMMENT") {
        if (ctx.session.user.id !== article.user.id) {
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
            slug: `${article.slug}?commentId=${newComment.id}`,
          });
        }
      } else if (input.type === "REPLY" && parentComment) {
        if (ctx.session.user.id !== parentComment.user.id) {
          await ctx.db.insert(notifications).values({
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
            slug: `${article.slug}?commentId=${newComment.id}`,
          });
        }
      }

      return newComment;
    }),

  likeComment: protectedProcedure
    .input(
      z.object({
        commentId: z.string().trim(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { commentId } = input;

        const comment = await ctx.db.query.comments.findFirst({
          where: eq(comments.id, commentId),
          columns: {
            likesCount: true,
          },
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

        if (comment.likes.length > 0) {
          await ctx.db
            .delete(likesToComment)
            .where(
              and(
                eq(likesToComment.userId, ctx.session.user.id),
                eq(likesToComment.commentId, commentId),
              ),
            );
        } else {
          await ctx.db.insert(likesToComment).values({
            userId: ctx.session.user.id,
            commentId,
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
        parentId: z.string().trim().optional().nullable(),
        type: z.enum(["INITIAL", "ALL"]).optional().default("INITIAL"),
        // here initial means get the first 5 comments with their first one reply.
        // `INITIAL` is used for getting comments of an article in the initial load
      }),
    )
    .query(async ({ ctx, input }) => {
      const articleId = input.articleId;

      if (input.type === "INITIAL") {
        const c = await ctx.db.query.articles
          .findFirst({
            where: eq(articles.id, articleId),
            columns: {
              commentsCount: true,
            },
            with: {
              comments: {
                columns: {
                  userId: false,
                  articleId: false,
                },
                where: and(
                  eq(comments.type, "COMMENT"),
                  isNull(comments.parentId),
                  eq(comments.articleId, articleId),
                ),
                limit: 5,
                extras: {
                  repliesCount:
                    sql<number>`(
                    SELECT COUNT(*) FROM ${comments} AS c2 WHERE c2.parent_id = ${comments.id}
                  )`.as("replies_count") ?? 0,
                },
                with: {
                  replies: {
                    columns: {
                      userId: false,
                      articleId: false,
                    },
                    limit: 1,
                    extras: {
                      repliesCount:
                        sql<number>`(
                        SELECT COUNT(*) FROM ${comments} AS c2 WHERE c2.parent_id = ${comments.id}
                      )`.as("replies_count") ?? 0,
                    },
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
                        where: eq(
                          likesToComment.userId,
                          ctx?.session?.user.id ?? "",
                        ),
                        columns: {
                          userId: true,
                        },
                      },
                    },
                  },
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
                    where: eq(
                      likesToComment.userId,
                      ctx?.session?.user.id ?? "",
                    ),
                    columns: {
                      userId: true,
                    },
                  },
                },
                orderBy: [desc(comments.createdAt)],
              },
            },
          })
          .then((res) => {
            return {
              comments: (res?.comments.map((e) => {
                const { likes, ...rest } = e;
                return {
                  ...rest,
                  hasLiked: !!likes.length,
                  replies: e.replies.map((e) => {
                    const { likes, ...rest } = e;
                    return {
                      ...rest,
                      hasLiked: !!likes.length,
                    };
                  }),
                };
              }) ?? []) as Comment[],
              count: res?.commentsCount ?? 0,
            };
          });

        return c;
      } else {
        // load all comments and replies
        if (!input.parentId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ParentId is required",
          });
        }

        const commentsofarticle = await ctx.db.query.comments
          .findMany({
            where: eq(comments.articleId, input.articleId),
            columns: {
              userId: false,
              articleId: false,
            },
            extras: {
              repliesCount:
                sql<number>`(
                        SELECT COUNT(*) FROM ${comments} AS c2 WHERE c2.parent_id = ${comments.id}
                      )`.as("replies_count") ?? 0,
            },
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
                where: eq(likesToComment.userId, ctx?.session?.user.id ?? ""),
                columns: {
                  userId: true,
                },
              },
            },
          })
          .then((res) => {
            return res.map((e) => {
              const { likes, ...rest } = e;
              return {
                ...rest,
                hasLiked: !!likes.length,
                replies: [],
              };
            });
          });

        function organizeComments(
          comments: Comment[],
          parentId: string | null = null,
        ) {
          const result = [];

          for (const comment of comments) {
            if (comment.parentId === parentId) {
              const replies = organizeComments(comments, comment.id);
              if (replies.length > 0) {
                comment.replies = replies;
              }
              result.push(comment);
            }
          }

          return result;
        }

        const count = await ctx.db.execute(sql`
          SELECT COUNT(*) FROM ${comments} WHERE ${comments.articleId} = ${input.articleId}
        `);

        // Organize the comments
        const nestedComments = organizeComments(commentsofarticle);
        const result = {
          comments: nestedComments,
          count: (count.rows[0] as { count: number })?.count ?? 0,
        };
        return result;
      }
    }),

  getReplies: publicProcedure
    .input(
      z.object({
        commentId: z.string().trim(),
      }),
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
