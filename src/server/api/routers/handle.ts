import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { customTabs, handles, users } from "~/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const handleRouter = createTRPCRouter({
  updateHandle: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        about: z.string().optional(),
        handle: z.string().optional(),
        social: z
          .object({
            twitter: z.string().default(""),
            mastodon: z.string().default(""),
            instagram: z.string().default(""),
            github: z.string().default(""),
            website: z.string().default(""),
            linkedin: z.string().default(""),
            youtube: z.string().default(""),
            dailydev: z.string().default(""),
          })
          .optional(),
        appearance: z
          .object({
            layout: z.string().default("STACKED"),
            logo: z.string().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const handle = await ctx.db.query.handles.findFirst({
        where: eq(handles.userId, "c812cfc0-b546-4d07-9140-589345289fca"),
      });
      if (!handle) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Handle does not exists",
        });
      }
      const result = await ctx.db
        .update(handles)
        .set(input)
        .where(eq(handles.userId, "c812cfc0-b546-4d07-9140-589345289fca"));
      // const handle = await ctx.prisma.handle.findUnique({
      //   where: {
      //     userId: ctx.session.user.id,
      //   },
      // });

      // if (!handle) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "Handle does not exists",
      //   });
      // }

      // const result = await ctx.prisma.handle.update({
      //   where: {
      //     userId: ctx.session.user.id,
      //   },
      //   data: input,
      // });

      return !!result;
    }),

  createPersonalHandle: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        handle: z.object({
          domain: z.string().min(4),
          name: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // const findExistingHandle = await ctx.prisma.handle.findUnique({
      //   where: {
      //     handle: input.handle.domain,
      //   },
      // });

      const findExistingHandle = await ctx.db.query.handles.findFirst({
        where: eq(handles.handle, input.handle.domain),
      });

      if (findExistingHandle) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Handle already exists",
        });
      }

      const result = await ctx.db
        .insert(handles)
        .values({
          handle: input.handle.domain,
          name: input.handle.name || "Percy30",
          // userId: ctx.session.user.id,
          // userId: "2802f8f4-e46c-4497-9563-b3a6089a3f96",
          userId: input.userId,
        })
        .returning();

      return result;
    }),

  newNavbarData: publicProcedure
    .input(
      z.object({
        handle: z.string(),
        tab: z.object({
          label: z.string(),
          type: z.string(),
          value: z.string(),
          priority: z.number().default(0),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log({ handlename: input.handle });
      const handle = await ctx.db.query.handles.findFirst({
        where: eq(handles.handle, input.handle),
        columns: {
          id: true,
        },
      });
      console.log({ handle });
      if (!handle) {
        return {
          success: false,
          message: "Handle does not exists",
        };
      }
      const newTab = await ctx.db
        .insert(customTabs)
        .values({
          ...input.tab,
          handleId: handle.id,
        })
        .returning();

      // const result = await ctx.prisma.handle.update({
      //   where: {
      //     handle: input.handle,
      //   },
      //   data: {
      //     customTabs: {
      //       create: input.tab,
      //     },
      //   },
      // });

      return newTab;
    }),

  updateNavbarData: publicProcedure
    .input(
      z.object({
        tabId: z.string(),
        tab: z.object({
          label: z.string().optional(),
          type: z.string().optional(),
          value: z.string().optional(),
          priority: z.number().default(0).optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.name, "Ujen Basi"),
        with: {
          handle: {
            columns: {
              id: true,
            },
          },
        },
      });
      if (!user?.handle) {
        return {
          success: false,
          message: "Handle does not exists",
        };
      }
      const result = await ctx.db
        .update(customTabs)
        .set(input.tab)
        .where(
          and(
            eq(customTabs.handleId, user.handle.id),
            eq(customTabs.id, input.tabId)
          )
        );
      // const result = await ctx.prisma.customTab.update({
      //   where: {
      //     id: input.handle,
      //   },
      //   data: input.tab,
      // });

      return !!result;
    }),

  getNavbarData: publicProcedure
    .input(
      z.object({
        handle: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.customTabs.findMany({
        where: eq(customTabs.handleId, input.handle),
        orderBy: (tabs, { asc }) => asc(tabs.priority),
      });
      // const result = await ctx.prisma.customTab.findMany({
      //   where: {
      //     handle: {
      //       handle: input.handle,
      //     },
      //   },
      //   orderBy: {
      //     priority: "asc",
      //   },
      // });
      return result;
    }),

  deleteNavbarData: publicProcedure
    .input(
      z.object({
        tabId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .delete(customTabs)
        .where(eq(customTabs.id, input.tabId));
      // const result = await ctx.prisma.customTab.delete({
      //   where: {
      //     id: input.tabId,
      //   },
      // });
      return !!result;
    }),
});

export default handleRouter;
