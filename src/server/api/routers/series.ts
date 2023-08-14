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
        edit: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { edit, ...restInput } = input;
      try {
        const dbQuery = {
          data: {
            ...restInput,
            author: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            slug: restInput.slug || slugify(restInput.title, slugSetting),
          },
          select: {
            slug: true,
          },
        };

        let series = null;

        if (edit) {
          series = await ctx.prisma.series.update({
            where: {
              slug: restInput.slug,
            },
            ...dbQuery,
          });
        } else {
          series = await ctx.prisma.series.create(dbQuery);
        }

        return !!series;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  getSeriesOfArticle: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
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
            message: "Series not found!",
          });
        }

        return series;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  getSeriesOfAuthor: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const series = await ctx.prisma.series.findMany({
          where: {
            author: {
              username: input.username,
            },
          },
          select: {
            id: true,
            title: true,
            slug: true,
          },
        });

        if (!series) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Series not found",
          });
        }

        return series;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  searchSeries: protectedProcedure
    .input(
      z.object({
        query: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
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
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  deleteSeries: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const series = await ctx.prisma.series.delete({
          where: {
            id: input.id,
          },
        });
        return !!series;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
