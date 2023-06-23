import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "./../trpc";

export const TagsRouter = createTRPCRouter({
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

  getTredingTags: publicProcedure.query(async ({ ctx }) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      const endDate = new Date();

      const tags = await ctx.prisma.tag.findMany({
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
      const limitedTagData = tagData.slice(0, 6);

      return {
        success: true,
        data: limitedTagData,
        status: 200,
      };
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong, try again later",
      });
    }
  }),
});
