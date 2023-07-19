import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { publicProcedure } from "./../trpc";

export const handleRouter = createTRPCRouter({
  updateHandle: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        about: z.string().optional(),
        social: z.object({
          twitter: z.string().default(""),
          mastodon: z.string().default(""),
          instagram: z.string().default(""),
          github: z.string().default(""),
          website: z.string().default(""),
          linkedin: z.string().default(""),
          youtube: z.string().default(""),
          dailydev: z.string().default(""),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const handle = await ctx.prisma.handle.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (!handle) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Handle does not exists",
        });
      }

      const result = await ctx.prisma.handle.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          name: input.name,
          about: input.about,
          social: input.social,
        },
      });
      return result ? true : false;
    }),

  createPersonalHandle: protectedProcedure
    .input(
      z.object({
        handle: z.object({
          domain: z.string().min(4),
          name: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const findExistingHandle = await ctx.prisma.handle.findUnique({
        where: {
          handle: input.handle.domain,
        },
      });

      if (findExistingHandle) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Handle already exists",
        });
      }

      const result = await ctx.prisma.handle.create({
        data: {
          handle: input.handle.domain,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          social: {
            twitter: "",
            mastodon: "",
            instagram: "",
            github: "",
            website: "",
            linkedin: "",
            youtube: "",
            dailydev: "",
          },
          name: input.handle.name || ctx.session.user.username,
        },
      });
      return result ? true : false;
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.handle.update({
        where: {
          handle: input.handle,
        },
        data: {
          customTabs: {
            create: input.tab,
          },
        },
      });

      return result ? true : false;
    }),

  updateNavbarData: protectedProcedure
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
      const result = await ctx.prisma.customTab.update({
        where: {
          id: input.handle,
        },
        data: input.tab,
      });

      return result ? true : false;
    }),

  getNavbarData: publicProcedure
    .input(
      z.object({
        handle: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.customTab.findMany({
        where: {
          handle: {
            handle: input.handle,
          },
        },
        orderBy: {
          priority: "asc",
        },
      });
      return result;
    }),

  deleteNavbarData: protectedProcedure
    .input(
      z.object({
        tabId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.customTab.delete({
        where: {
          id: input.tabId,
        },
      });
      return result ? true : false;
    }),
});

export default handleRouter;
