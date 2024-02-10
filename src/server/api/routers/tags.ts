import { TRPCError } from "@trpc/server";
import { and, desc, eq, gt, ilike, inArray, or } from "drizzle-orm";
import slugify from "slugify";
import { z } from "zod";
import { FILTER_TIME_OPTIONS } from "~/hooks/useFilter";
import { tags, tagsToArticles, tagsToUsers, users } from "~/server/db/schema";
import { slugSetting } from "~/utils/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { publicProcedure } from "./../trpc";

export const tagsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.query.tags.findMany({
        orderBy: [desc(tags.followersCount)],
        limit: 10,
      });
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong, try again later",
      });
    }
  }),

  getMultiple: publicProcedure
    .input(
      z.object({
        article: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.query.tagsToArticles
          .findMany({
            where: eq(tagsToArticles.articleId, input.article),
            columns: {
              articleId: false,
              tagId: false,
            },
            with: {
              tag: {
                columns: {
                  id: true,
                  slug: true,
                  name: true,
                },
              },
            },
          })
          .then((res) => {
            return res.map((e) => e.tag);
          });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  getSingle: publicProcedure
    .input(z.object({ slug: z.array(z.string().trim()) }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.query.tags.findMany({
          where: inArray(tags.slug, input.slug),
          columns: {
            name: true,
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  searchTags: publicProcedure
    .input(
      z.object({
        query: z.string().trim(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.query.tags.findMany({
          where: or(
            ilike(tags.name, `%${input.query}%`),
            ilike(tags.slug, `%${input.query}%`),
            ilike(tags.description, `%${input.query}%`),
          ),
          columns: { name: true, slug: true, articlesCount: true, logo: true },

          orderBy: [desc(tags.followersCount)],
          limit: 5,
        });

        if (result.length > 0) return result;

        return [
          {
            name: input.query,
            logo: null,
            slug: slugify(input.query, slugSetting),
            articlesCount: 0,
          },
        ];
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  followTag: protectedProcedure
    .input(
      z.object({
        name: z.string().trim(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const tag = await ctx.db.query.tags.findFirst({
          where: eq(tags.name, input.name),
          columns: {
            id: true,
            followersCount: true,
          },
          with: {
            followers: {
              where: eq(tagsToUsers.userId, ctx.session.user.id),
              columns: {
                userId: true,
              },
            },
          },
        });

        if (!tag) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Tag not found",
          });
        }

        const isFollowing = tag.followers.length > 0;

        if (isFollowing) {
          await ctx.db
            .delete(tagsToUsers)
            .where(
              and(
                eq(tagsToUsers.tagId, tag.id),
                eq(tagsToUsers.userId, ctx.session.user.id),
              ),
            );
        } else {
          await ctx.db.insert(tagsToUsers).values({
            tagId: tag.id,
            userId: ctx.session.user.id,
          });
        }

        await ctx.db
          .update(tags)
          .set({
            followersCount: isFollowing
              ? tag.followersCount - 1
              : tag.followersCount + 1,
          })
          .where(eq(tags.name, input.name));

        return {
          success: true,
          message: isFollowing ? "Tag Unfollowed" : "Tag Followed",
          status: 200,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  getTrendingTags: publicProcedure
    .input(
      z
        .object({
          variant: z
            .enum(["ANY", "WEEK", "MONTH", "YEAR"] as const)
            .default("ANY" as const),
          limit: z.number().default(6),
        })
        .optional()
        .default({
          variant: "ANY",
          limit: 6,
        }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const startDate = new Date();
        const endDate = new Date();

        if (input?.variant === FILTER_TIME_OPTIONS.week) {
          startDate.setDate(startDate.getDate() - 7);
        } else if (input?.variant === FILTER_TIME_OPTIONS.month) {
          startDate.setMonth(startDate.getMonth() - 1);
        } else if (input?.variant === FILTER_TIME_OPTIONS.year) {
          startDate.setFullYear(startDate.getFullYear() - 1);
        }

        const res = await ctx.db.query.tags
          .findMany({
            limit: input.limit,
            where: and(gt(tags.articlesCount, 0)),
            orderBy: [desc(tags.articlesCount), desc(tags.followersCount)],
            with: {
              articles: {
                columns: {
                  articleId: false,
                  tagId: false,
                },
                with: {
                  article: {
                    columns: {
                      createdAt: true,
                    },
                  },
                },
              },
            },
          })
          .then((res) => {
            const result = res.map((tag) => {
              return {
                ...tag,
                articles:
                  input?.variant === FILTER_TIME_OPTIONS.any
                    ? tag.articles
                    : tag.articles.filter(
                        (article) =>
                          article.article.createdAt >= startDate &&
                          article.article.createdAt <= endDate,
                      ),
              };
            });
            return result
              .filter((e) => e.articles.length > 0)
              .sort((a, b) => b.articles.length - a.articles.length);
          });

        const tagData = res.map((tag) => {
          return {
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            logo: tag.logo,
            articlesCount: tag.articles.length,
          };
        });

        return tagData;
      } catch (err) {
        if (err instanceof TRPCError) throw err;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  getFollowingTags: protectedProcedure
    .input(
      z.object({
        variant: z
          .enum(["ANY", "WEEK", "MONTH", "YEAR"] as const)
          .default("ANY" as const),
        limit: z.number().default(6),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const startDate = new Date();
        const endDate = new Date();

        if (input?.variant === FILTER_TIME_OPTIONS.week) {
          startDate.setDate(startDate.getDate() - 7);
        } else if (input?.variant === FILTER_TIME_OPTIONS.month) {
          startDate.setMonth(startDate.getMonth() - 1);
        } else if (input?.variant === FILTER_TIME_OPTIONS.year) {
          startDate.setFullYear(startDate.getFullYear() - 1);
        }

        const result = await ctx.db.query.users
          .findFirst({
            where: eq(users.id, ctx.session.user.id),
            columns: {
              id: true,
            },
            with: {
              followingTags: {
                with: {
                  tag: {
                    columns: {
                      description: false,
                    },
                    with: {
                      articles: {
                        columns: {
                          articleId: false,
                          tagId: false,
                        },
                        with: {
                          article: {
                            columns: {
                              createdAt: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
                columns: {
                  tagId: false,
                  userId: false,
                },
              },
            },
          })
          .then((res) => {
            if (res) {
              return res.followingTags.map((e) => e.tag);
            } else {
              return undefined;
            }
          });

        if (!result) {
          return [];
        }

        const tagData = result.map((tag) => {
          return {
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            logo: tag.logo,
            articlesCount:
              input?.variant === FILTER_TIME_OPTIONS.any
                ? tag.articlesCount
                : tag.articles.filter(
                    (article) =>
                      article.article.createdAt >= startDate &&
                      article.article.createdAt <= endDate,
                  ).length,
          };
        });

        tagData.sort((a, b) => b.articlesCount - a.articlesCount);

        return tagData;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  new: protectedProcedure
    .input(
      z.object({
        name: z.string().trim(),
        logo: z.string().trim().optional().nullable(),
        description: z.string().trim().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const tag = await ctx.db.query.tags.findFirst({
          where: eq(tags.name, input.name),
          columns: {
            id: true,
          },
        });

        if (tag) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Tag already exists",
          });
        } else {
          return await ctx.db.insert(tags).values({
            name: input.name,
            logo: input.logo,
            description: input.description,
            slug: slugify(input.name, slugSetting),
          });
        }
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wr123ong, try again later",
        });
      }
    }),
});
