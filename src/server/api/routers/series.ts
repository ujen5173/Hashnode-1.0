import slugify from "slugify";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { publicProcedure } from "./../trpc";

const SeriesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const series = await ctx.prisma.series.findMany();

    return series;
  }),

  searchSeries: publicProcedure
    .input(
      z.object({
        query: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      const series = await ctx.prisma.series.findMany({
        where: {
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
          slug:
            input.slug ||
            slugify(input.title, {
              lower: true,
              replacement: "-",
              locale: "vi",
              trim: true,
              strict: true,
            }),
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

export default SeriesRouter;
