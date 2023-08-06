import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const notificationRouter = createTRPCRouter({
  getCount: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.notification.count({
      where: {
        userId: ctx.session.user.id,
        isRead: false,
      },
      take: 5,
    });

    return result;
  }),

  get: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(6),
        skip: z.number().optional(),
        cursor: z.string().nullable().optional(),
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
      const { cursor, skip, limit } = input;

      const notifications = await ctx.prisma.notification.findMany({
        where: {
          userId: ctx.session.user.id,
          type: input.type === "ALL" ? undefined : input.type,
        },
        take: (limit || 6) + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
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

      let nextCursor: typeof cursor | undefined = undefined;
      if (notifications.length > limit) {
        const nextItem = notifications.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return {
        notifications,
        nextCursor,
      };
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
