import { TRPCError } from "@trpc/server";
import { desc, eq, gt, ilike, inArray } from "drizzle-orm";
import slugify from "slugify";
import { z } from "zod";
import { tags, users } from "~/server/db/schema";
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
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.query.tags.findMany({
          where: ilike(tags.name, input.query),
          orderBy: [desc(tags.followersCount)],
          limit: 5,
          columns: {
            name: true,
            slug: true,
            articlesCount: true,
            logo: true,
          },
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

  followTagToggle: protectedProcedure
    .input(
      z.object({
        name: z.string().trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const tag = await ctx.db.query.tags.findFirst({
          where: eq(tags.name, input.name),
          with: {
            followers: {
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

        const isFollowing = tag.followers.some(
          (follower) => follower.userId === ctx.session.user.id
        );

        const data = {
          followers: {
            connect: isFollowing
              ? undefined
              : {
                  id: ctx.session.user.id,
                },
            disconnect: isFollowing
              ? {
                  id: ctx.session.user.id,
                }
              : undefined,
          },
        };

        await ctx.db
          .update(tags)
          .set({
            ...data,
            followersCount: isFollowing
              ? tags.followersCount._.data - 1
              : tags.followersCount._.data + 1,
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

  getTredingTags: publicProcedure
    .input(
      z
        .object({
          variant: z.enum(["week", "month", "year", "any"]).default("any"),
          limit: z.number().default(6),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const startDate = new Date();
        const endDate = new Date();

        if (input?.variant === "week") {
          startDate.setDate(startDate.getDate() - 7);
        } else if (input?.variant === "month") {
          startDate.setMonth(startDate.getMonth() - 1);
        } else if (input?.variant === "year") {
          startDate.setFullYear(startDate.getFullYear() - 1);
        }

        const res = await ctx.db.query.tags
          .findMany({
            where:
              input?.variant === "any"
                ? gt(tags.articlesCount, 0)
                : eq(tags.articlesCount, 0),
            limit: input?.limit || 6,
            orderBy: [desc(tags.articlesCount), desc(tags.followersCount)],
            with: {
              articles: {
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
          .then((tags) => {
            return tags.filter((tag) => {
              return tag.articles.some((article) => {
                return (
                  article.article.createdAt >= startDate &&
                  article.article.createdAt <= endDate
                );
              });
            });
          });

        const tagData = res.map((tag) => {
          return {
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            logo: tag.logo,
            articlesCount:
              input?.variant === "any"
                ? tag.articles.length
                : tag.articles.filter(
                    (article) =>
                      article.article.createdAt >= startDate &&
                      article.article.createdAt <= endDate
                  ).length,
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
        variant: z.enum(["week", "month", "year", "any"]).default("any"),
        limit: z.number().default(6),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const startDate = new Date();
        const endDate = new Date();

        if (input?.variant === "week") {
          startDate.setDate(startDate.getDate() - 7);
        } else if (input?.variant === "month") {
          startDate.setMonth(startDate.getMonth() - 1);
        } else if (input?.variant === "year") {
          startDate.setFullYear(startDate.getFullYear() - 1);
        }

        const res = await ctx.db.query.users
          .findFirst({
            where: eq(users.id, ctx.session.user.id),
            with: {
              followingTags: {
                columns: {
                  userId: true,
                },
              },
            },
          })
          .then((user) => {
            if (!user) {
              return [];
            }
            return ctx.db.query.tags.findMany({
              where: inArray(
                tags.id,
                user.followingTags.map((tag) => tag.userId)
              ),
              limit: input?.limit || 6,
              orderBy: [desc(tags.followersCount)],
              with: {
                articles: {
                  with: {
                    article: {
                      columns: {
                        createdAt: true,
                      },
                    },
                  },
                },
              },
            });
          });

        const tagData = res.map((tag) => {
          return {
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            logo: tag.logo,
            articlesCount: tag.articles.filter(
              (article) =>
                article.article.createdAt >= startDate &&
                article.article.createdAt <= endDate
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
      })
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
