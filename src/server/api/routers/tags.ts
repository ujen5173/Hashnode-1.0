import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const TagsRouter = createTRPCRouter({
  followTagToggle: protectedProcedure
    .input(
      z.object({
        name: z.string().trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const tag = await ctx.prisma.tag.findUnique({
          where: {
            name: input.name,
          },
          select: {
            followers: true,
          },
        });

        if (!tag) {
          return {
            success: false,
            message: "Tag not found",
            status: 404,
          };
        }

        const isFollowing = tag.followers.some(
          (follower) => follower.id === ctx.session.user.id
        );

        if (isFollowing) {
          await ctx.prisma.tag.update({
            where: {
              name: input.name,
            },
            data: {
              followers: {
                disconnect: {
                  id: ctx.session.user.id,
                },
              },
              followersCount: {
                decrement: 1,
              },
            },
          });
          return {
            success: true,
            message: "Tag Followed",
            status: 200,
          };
        } else {
          await ctx.prisma.tag.update({
            where: {
              name: input.name,
            },
            data: {
              followers: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
              followersCount: {
                increment: 1,
              },
            },
          });
          return {
            success: true,
            message: "Tag Unfollowed",
            status: 200,
          };
        }
      } catch (err) {
        console.log(err);
        throw new Error("Something went wrong");
      }
    }),
});
