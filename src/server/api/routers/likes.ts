import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { articles, likesToArticles, notifications } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const likesRouter = createTRPCRouter({
  likeArticle: protectedProcedure
    .input(
      z.object({
        articleId: z.string().trim(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { articleId } = input;

        const article = await ctx.db.query.articles.findFirst({
          where: eq(articles.id, articleId),
          columns: {
            slug: true,
            title: true,
            likesCount: true,
          },
          with: {
            user: {
              columns: {
                id: true,
                username: true,
              },
            },
            likes: {
              where: eq(likesToArticles.userId, ctx.session.user.id),
              with: {
                likes: {
                  columns: {
                    id: true,
                  },
                },
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

        const updatedLikesCount = await ctx.db
          .update(articles)
          .set({
            likesCount:
              article.likes.length > 0
                ? article.likesCount - 1
                : article.likesCount + 1,
          })
          .where(eq(articles.id, articleId))
          .returning({
            likesCount: articles.likesCount,
          })
          .then((res) => res[0]?.likesCount ?? 0);

        if (article.likes.length > 0) {
          // like
          await ctx.db
            .delete(likesToArticles)
            .where(eq(likesToArticles.articleId, articleId));
        } else {
          // unlike
          await ctx.db.insert(likesToArticles).values({
            articleId,
            userId: ctx.session.user.id,
          });
          // .where(eq(likesToArticles.articleId, articleId));
        }

        if (!article.likes.length) {
          await ctx.db.insert(notifications).values({
            type: "LIKE",
            fromId: ctx.session.user.id,
            articleAuthor: article.user.username,
            title: article.title,
            userId: article.user.id,
            isRead: false,
            slug: article.slug,
          });
        }

        return {
          success: true,
          message:
            article.likes.length > 0 ? "Unliked article" : "Liked article",
          hasLiked: !article.likes.length,
          likesCount: updatedLikesCount,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  likeState: protectedProcedure
    .input(
      z.object({
        articleId: z.string().trim(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { articleId } = input;

      const like = await ctx.db.query.likesToArticles.findFirst({
        where: and(
          eq(likesToArticles.articleId, articleId),
          eq(likesToArticles.userId, ctx.session.user.id),
        ),
      });

      return {
        liked: !!like,
      };
    }),
});
