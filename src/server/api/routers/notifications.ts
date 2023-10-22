import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { notifications } from "~/server/db/schema";

export const notificationRouter = createTRPCRouter({
  getCount: protectedProcedure.query(async ({ ctx }) => {
    // const result = await ctx.prisma.notification.count({
    //   where: {
    //     userId: ctx.session.user.id,
    //     isRead: false,
    //   },
    //   take: 5,
    // });
    const result = await ctx.db.query.notifications.findMany({
      where: and(
        eq(notifications.userId, ctx.session.user.id),
        eq(notifications.isRead, false)
      ),
      limit: 10,
    });

    return result.length;
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

      // const notifications = await ctx.prisma.notification.findMany({
      //   where: {
      //     userId: ctx.session.user.id,
      //     type: input.type === "ALL" ? undefined : input.type,
      //   },
      //   take: (limit || 6) + 1,
      //   skip: skip,
      //   cursor: cursor ? { id: cursor } : undefined,
      //   orderBy: {
      //     createdAt: "desc",
      //   },
      //   include: {
      //     from: {
      //       select: {
      //         username: true,
      //         profile: true,
      //         name: true,
      //       },
      //     },
      //     user: {
      //       select: {
      //         username: true,
      //         profile: true,
      //         name: true,
      //       },
      //     },
      //   },
      // });

      const result = await ctx.db.query.notifications.findMany({
        where: and(
          eq(notifications.userId, ctx.session.user.id),
          input.type === "ALL" ? undefined : eq(notifications.type, input.type)
        ),
        limit: (limit || 6) + 1,
        offset: skip,
        orderBy: [asc(notifications.createdAt)],
        with: {
          userId: {
            columns: {
              username: true,
              profile: true,
              name: true,
            },
          },
          fromId: {
            columns: {
              username: true,
              profile: true,
              name: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (result.length > limit) {
        const nextItem = result.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return {
        notifications: result,
        nextCursor,
      };
    }),

  markAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.userId, ctx.session.user.id),
          eq(notifications.isRead, false)
        )
      );
    // await ctx.prisma.notification.updateMany({
    //   where: {
    //     userId: ctx.session.user.id,
    //     isRead: false,
    //   },
    //   data: {
    //     isRead: true,
    //   },
    // });

    return true;
  }),
});
