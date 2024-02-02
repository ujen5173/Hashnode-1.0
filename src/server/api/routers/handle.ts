import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { customTabs, handles } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const handleRouter = createTRPCRouter({
  updateHandle: protectedProcedure
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const handle = await ctx.db.query.handles.findFirst({
        where: eq(handles.userId, ctx.session.user.id),
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
        .where(eq(handles.userId, ctx.session.user.id));

      return !!result;
    }),

  createPersonalHandle: protectedProcedure
    .input(
      z.object({
        handle: z.object({
          domain: z.string().min(4),
          name: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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
          name: input.handle.name ?? "HASHNODE CLONE HANDLE",
          userId: ctx.session.user.id,
        })
        .returning();

      return result;
    }),

  newNavbarData: protectedProcedure
    .input(
      z.object({
        handle: z.string(),
        tab: z.object({
          label: z.string(),
          type: z.string(),
          value: z.string(),
          priority: z.number().default(0),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const handle = await ctx.db.query.handles.findFirst({
        where: eq(handles.handle, input.handle),
        columns: {
          id: true,
        },
      });

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

      return newTab;
    }),

  updateNavbarData: protectedProcedure
    .input(
      z.object({
        tabId: z.string(),
        tab: z.object({
          label: z.string().optional(),
          type: z.string().optional(),
          value: z.string().optional(),
          priority: z.number().default(0).optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(customTabs)
        .set(input.tab)
        .where(and(eq(customTabs.id, input.tabId)));

      return !!result;
    }),

  getNavbarData: publicProcedure
    .input(
      z.object({
        handleId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.customTabs.findMany({
        where: eq(customTabs.handleId, input.handleId),

        orderBy: (tabs, { asc }) => asc(tabs.priority),
      });
      return result;
    }),

  deleteNavbarData: protectedProcedure
    .input(
      z.object({
        tabId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .delete(customTabs)
        .where(eq(customTabs.id, input.tabId));

      return !!result;
    }),
});

export default handleRouter;
