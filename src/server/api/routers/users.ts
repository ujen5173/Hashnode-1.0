import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const UsersRouter = createTRPCRouter({
  followUserToggle: protectedProcedure
    .input(
      z.object({
        username: z.string().trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            username: input.username,
          },
          select: {
            username: true,
            followers: true,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User not found",
          });
        }

        if (user.username === ctx.session.user.username) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You cannot follow yourself",
          });
        }

        const isFollowing = user.followers.some(
          (follower) => follower.id === ctx.session.user.id
        );

        if (isFollowing) {
          await ctx.prisma.user.update({
            where: {
              username: input.username,
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
            message: "User Unfollowed",
            status: 200,
          };
        } else {
          await ctx.prisma.user.update({
            where: {
              username: input.username,
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
            message: "User Followed",
            status: 200,
          };
        }
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  getUser: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        followers: {
          select: {
            username: true,
          },
        },
        following: {
          select: {
            username: true,
          },
        },
      },
    });
  }),
});
