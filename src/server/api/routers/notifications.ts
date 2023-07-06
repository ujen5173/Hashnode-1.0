import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { type NotificationResponse } from "~/server/notification";
import { type Notification } from "~/utils/context";

// just following DRY principle. 🙄
const defaultSelect = {
  id: true,
  title: true,
  slug: true,
  user: {
    select: {
      username: true,
      profile: true,
      name: true,
    },
  },
  createdAt: true,
};

const commentSelect = {
  id: true,
  body: true,
  article: {
    select: {
      title: true,
      slug: true,
    },
  },
  user: {
    select: {
      username: true,
      profile: true,
      name: true,
    },
  },
  createdAt: true,
};

export const notificationRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(6).optional(),
        type: z.enum(["ALL", "COMMENT", "LIKE", "NEW_ARTICLE"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = (await ctx.prisma.notification.findMany({
        where: {
          userId: ctx.session.user.id,
          type: input.type === "ALL" ? undefined : input.type,
        },
        take: input.limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          createdAt: true,
          id: true,
          type: true,
          isRead: true,
          updatedAt: true,
          from: {
            select: {
              username: true,
              name: true,
              profile: true,
            },
          },
          ...(input.type === "COMMENT"
            ? {
                commentArticle: {
                  select: commentSelect,
                },
              }
            : input.type === "LIKE"
            ? {
                likeArticle: {
                  select: defaultSelect,
                },
              }
            : input.type === "NEW_ARTICLE"
            ? {
                newArticle: {
                  select: defaultSelect,
                },
              }
            : input.type === "ALL" && {
                commentArticle: {
                  select: commentSelect,
                },
                likeArticle: {
                  select: defaultSelect,
                },
                newArticle: {
                  select: defaultSelect,
                },
              }),
        },
      })) as NotificationResponse[];

      const response = result.map((e) => {
        // These are the responses for the different types of notifications.
        const commentResponse = {
          id: e.id,
          body: e.commentArticle?.body,
          slug: e.commentArticle?.article.slug,
          title: e.commentArticle?.article.title,
          createdAt: e.createdAt,
          from: e.from,
          type: e.type,
        };
        const likeResponse = {
          id: e.id,
          body: null,
          slug: e.likeArticle?.slug,
          title: e.likeArticle?.title,
          createdAt: e.createdAt,
          from: e.from,
          type: e.type,
        };
        const newArticleResponse = {
          id: e.id,
          body: null,
          slug: e.newArticle?.slug,
          title: e.newArticle?.title,
          createdAt: e.createdAt,
          from: e.from,
          type: e.type,
        };
        if (input.type === "COMMENT") return commentResponse;
        else if (input.type === "LIKE") return likeResponse;
        else if (input.type === "NEW_ARTICLE") return newArticleResponse;
        else {
          if (e.type === "COMMENT") return commentResponse;
          else if (e.type === "LIKE") return likeResponse;
          else return newArticleResponse;
        }
      }) as Notification[];
      return response;
    }),
});
