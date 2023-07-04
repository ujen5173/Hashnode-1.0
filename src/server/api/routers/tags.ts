import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
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

  getSingle: publicProcedure
    .input(z.object({ slug: z.array(z.string().trim()) }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.tag.findMany({
          where: {
            slug: {
              in: input.slug,
            },
          },
          select: {
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
        return await ctx.prisma.tag.findMany({
          where: {
            name: {
              contains: input.query,
              mode: "insensitive",
            },
          },
          orderBy: {
            followersCount: "desc",
          },
          take: 5,
          select: {
            id: true,
            name: true,
            logo: true,
          },
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
        const tag = await ctx.prisma.tag.findUnique({
          where: {
            name: input.name,
          },
        });
        if (tag) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Tag already exists",
          });
        } else {
          return await ctx.prisma.tag.create({
            data: {
              name: input.name,
              logo: input.logo,
              description: input.description,
              slug: slugify(input.name, {
                lower: true,
                replacement: "-",
                strict: true,
                trim: true,
                locale: "en",
              }),
            },
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
