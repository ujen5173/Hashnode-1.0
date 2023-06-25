import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "./../trpc";

export const TagsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.tag.findMany({
        orderBy: {
          followersCount: "desc",
        },
        take: 10,
      });
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
        const tag = (await ctx.prisma.tag.findUnique({
          where: {
            name: input.name,
          },
          select: {
            followers: {
              select: {
                id: true,
              },
            },
          },
        })) as { followers: { id: string }[] };

        if (!tag) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Tag not found",
          });
        }

        const isFollowing = tag.followers.some(
          (follower) => follower.id === ctx.session.user.id
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

        await ctx.prisma.tag.update({
          where: {
            name: input.name,
          },
          data: {
            ...data,
            followersCount: {
              [isFollowing ? "decrement" : "increment"]: 1,
            },
          },
        });

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

        const tags = await ctx.prisma.tag.findMany({
          ...(input?.variant === "any"
            ? {}
            : {
                where: {
                  articles: {
                    some: {
                      createdAt: {
                        gte: startDate,
                        lte: endDate,
                      },
                    },
                  },
                },
              }),

          take: input?.limit || 6,
          orderBy: {
            followersCount: "desc",
          },
          include: {
            articles: true,
          },
        });

        const tagData = tags.map((tag) => {
          return {
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            logo: tag.logo,
            articlesCount: tag.articles.filter(
              (article) =>
                article.createdAt >= startDate && article.createdAt <= endDate
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

        const tags = await ctx.prisma.tag.findMany({
          where: {
            followers: {
              some: {
                id: ctx.session.user.id,
              },
            },
          },
          take: input?.limit || 6,
          orderBy: {
            followersCount: "desc",
          },
          include: {
            articles: true,
          },
        });

        const tagData = tags.map((tag) => {
          return {
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            logo: tag.logo,
            articlesCount: tag.articles.filter(
              (article) =>
                article.createdAt >= startDate && article.createdAt <= endDate
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
});
