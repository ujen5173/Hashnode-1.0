import { TRPCError } from "@trpc/server";
import { and, eq, ilike, or } from "drizzle-orm";
import slugify from "slugify";
import { z } from "zod";
import { series, users } from "~/server/db/schema";
import { slugSetting } from "~/utils/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { publicProcedure } from "./../trpc";

export const seriesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.series.findMany();

    return result;
  }),

  new: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        cover_image: z.string().optional(),
        slug: z.string().optional(),
        edit: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { edit, ...restInput } = input;
      try {
        let result = null;

        if (edit) {
          result = await ctx.db
            .update(series)
            .set({
              ...restInput,
              slug: restInput.slug ?? slugify(restInput.title, slugSetting),
              authorId: ctx.session.user.id,
            })
            .where(
              eq(
                series.slug,
                restInput.slug ?? slugify(restInput.title, slugSetting),
              ),
            );
        } else {
          result = await ctx.db.insert(series).values({
            ...restInput,
            slug: restInput.slug ?? slugify(restInput.title, slugSetting),
            authorId: ctx.session.user.id,
          });
        }

        return !!result;
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

  getSeriesArticles: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const seriesResult = await ctx.db.query.series.findFirst({
          where: eq(series.slug, input.slug),
          with: {
            articles: {
              with: {
                user: {
                  columns: {
                    username: true,
                  },
                },
              },
              columns: {
                id: true,
                createdAt: true,
                read_time: true,
                title: true,
                slug: true,
                subContent: true,
                cover_image: true,
              },
            },
          },
        });

        if (!seriesResult) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Series not found!",
          });
        }

        return seriesResult;
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
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const seriesResult = await ctx.db.query.articles.findFirst({
          where: eq(series.slug, input.slug),
          columns: {
            seriesId: true,
          },
          with: {
            series: {
              columns: {
                id: true,
                title: true,
                description: true,
                cover_image: true,
                slug: true,
              },
              with: {
                articles: {
                  columns: {
                    id: true,
                    title: true,
                    slug: true,
                    subContent: true,
                    cover_image: true,
                  },
                },
              },
            },
          },
        });

        if (!seriesResult) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Series not found!",
          });
        }

        return seriesResult.series;
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
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.query.users
          .findFirst({
            where: eq(users.username, input.username),
            columns: {
              id: true,
            },
          })
          .execute()
          .then(async (user) => {
            if (!user) return false;

            return await ctx.db.query.series.findMany({
              where: eq(series.authorId, user?.id),
              columns: {
                id: true,
                title: true,
                slug: true,
              },
            });
          });

        if (!result) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Series not found",
          });
        }

        return result;
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
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.query.series.findMany({
          where: and(
            or(
              ilike(series.title, input.query),
              ilike(series.description, input.query),
            ),
            eq(series.authorId, ctx.session.user.id),
          ),
          columns: {
            id: true,
            title: true,
          },
        });

        return result;
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db
          .delete(series)
          .where(eq(series.id, input.id));

        return !!result;
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
