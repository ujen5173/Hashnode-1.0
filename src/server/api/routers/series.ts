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
    // const series = await ctx.prisma.series.findMany();
    const result = await ctx.db.query.series.findMany();

    return result;
  }),

  new: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        cover_image: z.string().optional(),
        slug: z.string().optional(),
        edit: z.boolean().default(false),

        userId: z.string(),
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
                id: input.userId,
              },
            },
            slug: restInput.slug || slugify(restInput.title, slugSetting),
          },
          select: {
            slug: true,
          },
        };

        let result = null;

        if (edit) {
          // result = await ctx.prisma.series.update({
          //   where: {
          //     slug: restInput.slug,
          //   },
          //   ...dbQuery,
          // });
          result = await ctx.db
            .update(series)
            .set(dbQuery.data)
            .where(
              eq(
                series.slug,
                restInput.slug || slugify(restInput.title, slugSetting)
              )
            )
            .returning();
        } else {
          // result = await ctx.prisma.series.create(dbQuery);
          result = await ctx.db
            .insert(series)
            .values({
              ...restInput,
              slug: restInput.slug || slugify(restInput.title, slugSetting),
              authorId: input.userId,
            })
            .returning();
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

  getSeriesOfArticle: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // const series = await ctx.prisma.series.findFirst({
        //   where: {
        //     slug: input.slug,
        //   },
        //   select: {
        //     title: true,
        //     slug: true,
        //     description: true,
        //     cover_image: true,
        //     articles: {
        //       select: {
        //         id: true,
        //         title: true,
        //         slug: true,
        //         content: true,
        //         cover_image: true,
        //         read_time: true,
        //         createdAt: true,
        //         user: {
        //           select: {
        //             username: true,
        //           },
        //         },
        //       },
        //     },
        //   },
        // });

        const result = await ctx.db.query.series.findFirst({
          where: eq(series.slug, input.slug),
          columns: {
            title: true,
            slug: true,
            description: true,
            cover_image: true,
          },
          with: {
            articles: {
              columns: {
                id: true,
                title: true,
                slug: true,
                content: true,
                cover_image: true,
                read_time: true,
                createdAt: true,
              },
              with: {
                user: {
                  columns: {
                    username: true,
                  },
                },
              },
            },
          },
        });

        if (!result) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Series not found!",
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

  getSeriesOfAuthor: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // const series = await ctx.prisma.series.findMany({
        //   where: {
        //     author: {
        //       username: input.username,
        //     },
        //   },
        //   select: {
        //     id: true,
        //     title: true,
        //     slug: true,
        //   },
        // });

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
        // .series.findMany({
        //   where: eq(series.authorId, input.username),
        //   columns: {
        //     id: true,
        //     title: true,
        //     slug: true,
        //   },
        // });

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
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // const series = await ctx.prisma.series.findMany({
        //   where: {
        //     AND: [
        //       {
        //         OR: [
        //           {
        //             title: {
        //               contains: input.query,
        //               mode: "insensitive",
        //             },
        //           },
        //           {
        //             description: {
        //               contains: input.query,
        //               mode: "insensitive",
        //             },
        //           },
        //         ],
        //       },
        //       {
        //         authorId: ctx.session.user.id,
        //       },
        //     ],
        //   },
        //   select: {
        //     id: true,
        //     title: true,
        //   },
        // });

        const result = await ctx.db.query.series.findMany({
          where: and(
            or(
              ilike(series.title, input.query),
              ilike(series.description, input.query)
            ),
            eq(series.authorId, ctx.session.user.id)
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // const series = await ctx.prisma.series.delete({
        //   where: {
        //     id: input.id,
        //   },
        // });
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
