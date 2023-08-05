import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";
import { slugSetting } from "~/utils/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { publicProcedure } from "./../trpc";

export const seriesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const series = await ctx.prisma.series.findMany();

    return series;
  }),

  new: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        cover_image: z.string().optional(),
        slug: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const series = await ctx.prisma.series.create({
        data: {
          ...input,
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          slug: input.slug || slugify(input.title, slugSetting),
        },
        select: {
          slug: true,
        },
      });

      return series;
    }),

  getSeriesOfArticle: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const series = await ctx.prisma.series.findFirst({
        where: {
          slug: input.slug,
        },
        select: {
          title: true,
          slug: true,
          description: true,
          cover_image: true,
          articles: {
            select: {
              id: true,
              title: true,
              slug: true,
              content: true,
              cover_image: true,
              read_time: true,
              createdAt: true,
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });

      if (!series) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Series not found",
        });
      }

      return series;
    }),

  getSeriesOfAuthor: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const series = await ctx.prisma.series.findMany({
        where: {
          author: {
            username: input.username,
          },
        },
        select: {
          title: true,
          id: true,
        },
      });

      if (!series) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Series not found",
        });
      }

      return series;
    }),

  searchSeries: protectedProcedure
    .input(
      z.object({
        query: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      const series = await ctx.prisma.series.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  title: {
                    contains: input.query,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: input.query,
                    mode: "insensitive",
                  },
                },
              ],
            },
            {
              authorId: ctx.session.user.id,
            },
          ],
        },
        select: {
          id: true,
          title: true,
        },
      });

      return series;
    }),

  newSeries: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        slug: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const series = await ctx.prisma.series.create({
        data: {
          ...input,
          slug: input.slug || slugify(input.title, slugSetting),
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return !!series;
    }),

  deleteSeries: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const series = await ctx.prisma.series.delete({
        where: {
          id: input.id,
        },
      });

      return !!series;
    }),
});
