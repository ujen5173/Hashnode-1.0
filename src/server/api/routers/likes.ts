import { NotificationTypes } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
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

        const article = await ctx.prisma.article.findUnique({
          where: {
            id: articleId,
          },
          select: {
            slug: true,
            title: true,
            user: {
              select: {
                id: true,
                username: true,
              },
            },
            likes: {
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

        const hasLiked = article.likes.some(
          (like) => like.id === ctx.session.user.id
        );

        const newArticle = (await ctx.prisma.article.update({
          where: {
            id: articleId,
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

        if (!hasLiked) {
          await ctx.prisma.notification.create({
            data: {
              type: NotificationTypes.LIKE,
              from: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
              articleAuthor: article.user.username,
              body: null,
              title: article.title,
              user: {
                connect: {
                  id: article.user.id,
                },
              },
              isRead: false,
              slug: article.slug,
            },
          });
        }

        return {
          success: true,
          message: hasLiked ? "Unliked article" : "Liked article",
          hasLiked: !hasLiked,
          likesCount: newArticle.likesCount,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),
});
