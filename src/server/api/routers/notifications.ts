import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const notificationRouter = createTRPCRouter({
  getCount: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.notification.count({
      where: {
        userId: ctx.session.user.id,
        isRead: false,
      },
    });

    return result;
  }),

  get: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(6).optional(),
        type: z.enum([
          "ALL",
          "COMMENT",
          "LIKE",
          "NEW_ARTICLE",
          "MENTION",
          "FOLLOW",
        ]),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.notification.findMany({
        where: {
          userId: ctx.session.user.id,
          type: input.type === "ALL" ? undefined : input.type,
        },
        take: input.limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          from: {
            select: {
              username: true,
              profile: true,
              name: true,
            },
          },
          user: {
            select: {
              username: true,
              profile: true,
              name: true,
            },
          },
        },
      });

      return result;
    }),

  markAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.notification.updateMany({
      where: {
        userId: ctx.session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return true;
  }),
});
