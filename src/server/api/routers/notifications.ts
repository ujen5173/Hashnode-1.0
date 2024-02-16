import { and, asc, desc, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { notifications } from "~/server/db/schema";

export const notificationRouter = createTRPCRouter({
  getCount: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.execute(
      sql`
      SELECT COUNT(*) FROM notifications
      WHERE notifications.user_id = ${ctx.session.user.id}
      AND notifications.is_read = false
      `,
    );

    return (result.rows[0] as { count: string }) ?? { count: "0" };
  }),

  get: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(6),
        skip: z.number().optional(),
        cursor: z.string().nullable().optional().default(null),
        type: z.enum(["ALL", "COMMENT", "LIKE", "ARTICLE", "FOLLOW"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, skip, limit } = input;

      const result = await ctx.db.query.notifications.findMany({
        where: and(
          eq(notifications.userId, ctx.session.user.id),
          input.type === "ALL" ? undefined : eq(notifications.type, input.type),
          ...(cursor !== null ? [gte(notifications.id, cursor)] : []),
        ),
        limit: limit + 1,
        offset: skip,
        orderBy: [asc(notifications.id), desc(notifications.createdAt)],
        columns: {
          id: true,
          body: true,
          type: true,
          slug: true,
          title: true,
          articleAuthor: true,
          createdAt: true,
        },
        with: {
          from: {
            columns: {
              username: true,
              image: true,
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
          eq(notifications.isRead, false),
        ),
      );

    return true;
  }),
});
