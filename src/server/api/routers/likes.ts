import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { articles, likesToArticles, notifications } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const likesRouter = createTRPCRouter({
  likeArticle: protectedProcedure
    .input(
      z.object({
        articleId: z.string().trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { articleId } = input;

        // const article = await ctx.prisma.article.findUnique({
        //   where: {
        //     id: articleId,
        //   },
        //   select: {
        //     slug: true,
        //     title: true,
        //     user: {
        //       select: {
        //         id: true,
        //         username: true,
        //       },
        //     },
        //     likes: {
        //       select: {
        //         id: true,
        //       },
        //     },
        //   },
        // });
        const article = await ctx.db.query.articles.findFirst({
          where: eq(articles.id, articleId),
          columns: {
            slug: true,
            title: true,
          },
          with: {
            user: {
              columns: {
                id: true,
                username: true,
              },
            },
            likes: {
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

        const hasLiked = article.likes.some(
          (like) => like.likes.id === ctx.session.user.id
        );

        // const newArticle = (await ctx.prisma.article.update({
        //   where: {
        //     id: articleId,
        //   },
        //   data: {
        //     likes: {
        //       [hasLiked ? "disconnect" : "connect"]: {
        //         id: ctx.session.user.id,
        //       },
        //     },
        //     likesCount: {
        //       [hasLiked ? "decrement" : "increment"]: 1,
        //     },
        //   },
        //   select: {
        //     likes: {
        //       select: { id: true },
        //     },
        //     likesCount: true,
        //   },
        // })) as {
        //   likes: { id: string }[];
        //   likesCount: number;
        // };

        const newArticle = await ctx.db
          .update(articles)
          .set({
            likesCount: hasLiked
              ? articles.likesCount._.data - 1
              : articles.likesCount._.data + 1,
          })
          .where(eq(articles.id, articleId))
          .returning({
            likesCount: articles.likesCount,
          })
          .then((res) => res[0]?.likesCount as number);

        await ctx.db
          .delete(likesToArticles)
          .where(eq(likesToArticles.articleId, articleId));

        if (!hasLiked) {
          // await ctx.prisma.notification.create({
          //   data: {
          //     type: NotificationTypes.LIKE,
          //     from: {
          //       connect: {
          //         id: ctx.session.user.id,
          //       },
          //     },
          //     articleAuthor: article.user.username,
          //     body: null,
          //     title: article.title,
          //     user: {
          //       connect: {
          //         id: article.user.id,
          //       },
          //     },
          //     isRead: false,
          //     slug: article.slug,
          //   },
          // });
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
          message: hasLiked ? "Unliked article" : "Liked article",
          hasLiked: !hasLiked,
          likesCount: newArticle,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),
});
