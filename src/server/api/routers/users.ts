import { NotificationTypes } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { type SocialHandles } from "~/types";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { publicProcedure } from "./../trpc";
import { TRPCClientError } from "@trpc/client";

export const usersRouter = createTRPCRouter({
  followUserToggle: protectedProcedure
    .input(
      z.object({
        username: z.string().trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { username } = input;

        // Find the target user
        const targetUser = await ctx.prisma.user.findUnique({
          where: { username },
          select: {
            username: true,
            followers: true,
            followersCount: true,
          },
        });

        if (!targetUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const currentUser = ctx.session.user;

        if (targetUser.username === currentUser.username) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You cannot follow yourself",
          });
        }

        // Check if the current user is already following the target user
        const isFollowing = targetUser.followers.some(
          (follower) => follower.id === currentUser.id
        );

        if (isFollowing) {
          // Unfollow the target user
          await Promise.all([
            ctx.prisma.user.update({
              where: { username: currentUser.username },
              data: {
                following: {
                  disconnect: {
                    username,
                  },
                },
                followingCount: {
                  decrement: 1,
                },
              },
            }),
            ctx.prisma.user.update({
              where: { username },
              data: {
                followers: {
                  disconnect: {
                    username: currentUser.username,
                  },
                },
                followersCount: {
                  decrement: 1,
                },
              },
            }),
          ]);

          return {
            success: true,
            message: "User Unfollowed",
            status: 200,
          };
        } else {
          // Follow the target user
          await Promise.all([
            ctx.prisma.user.update({
              where: { username },
              data: {
                followers: {
                  connect: {
                    id: currentUser.id,
                  },
                },
                followersCount: {
                  increment: 1,
                },
              },
            }),
            ctx.prisma.user.update({
              where: { username: currentUser.username },
              data: {
                following: {
                  connect: {
                    username,
                  },
                },
                followingCount: {
                  increment: 1,
                },
              },
            }),
            ctx.prisma.notification.create({
              data: {
                type: NotificationTypes.FOLLOW,
                from: {
                  connect: {
                    id: currentUser.id,
                  },
                },
                user: {
                  connect: {
                    username,
                  },
                },
              },
            }),
          ]);

          return {
            success: true,
            message: "User Followed",
            status: 200,
          };
        }
      } catch (err) {
        console.log({ err });
        if (err instanceof TRPCClientError) {
          throw err;
        }
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

  getUserByUsername: publicProcedure
    .input(
      z.object({
        username: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username.slice(1, input.username.length),
        },
        include: {
          followers: {
            select: {
              id: true,
            },
          },
        },
      });

      let isFollowing = false;

      if (ctx.session !== null) {
        isFollowing = user?.followers.some(
          (follower) => follower.id === ctx?.session?.user.id
        )
          ? true
          : false;
      }

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }

      return { ...user, isFollowing };
    }),

  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string().trim(),
        username: z.string().trim(),
        email: z.string().trim(),
        location: z.string().trim(),
        profile: z.string().trim(),
        tagline: z.string().trim(),
        available: z.string().trim(),
        cover_image: z.string().trim(),
        bio: z.string().trim(),
        skills: z.array(z.string().trim()),
        social: z.object({
          twitter: z.string().trim().optional(),
          instagram: z.string().trim().optional(),
          github: z.string().trim().optional(),
          stackoverflow: z.string().trim().optional(),
          facebook: z.string().trim().optional(),
          website: z.string().trim().optional(),
          linkedin: z.string().trim().optional(),
          youtube: z.string().trim().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newUser = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          username: input.username,
          email: input.email,
          location: input.location,
          profile: input.profile,
          tagline: input.tagline,
          available: input.available,
          cover_image: input.cover_image,
          bio: input.bio,
          skills: input.skills,
          social: input.social,
        },
        select: {
          name: true,
          username: true,
          email: true,
          location: true,
          profile: true,
          tagline: true,
          available: true,
          cover_image: true,
          bio: true,
          skills: true,
          social: true,
        },
      });

      return {
        success: true,
        message: "User Updated",
        status: 200,
        data: {
          ...newUser,
          social: JSON.parse(JSON.stringify(newUser.social)) as SocialHandles,
          skills: newUser.skills.join(", "),
        },
      };
    }),

  getFollowersList: publicProcedure
    .input(
      z.object({
        username: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      const followers = await ctx.prisma.user.findMany({
        where: {
          following: {
            some: {
              username: input.username.slice(1, input.username.length),
            },
          },
        },
        select: {
          id: true,
          name: true,
          tagline: true,
          username: true,
          profile: true,
        },
        take: 20,
      });

      const authorUser = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session?.user?.id,
        },
        select: {
          following: {
            select: {
              id: true,
            },
          },
        },
      });

      const updatedFollowers = followers.map((user) => {
        return {
          ...user,
          isFollowing: authorUser?.following.some(
            (following) => following.id === user.id
          )
            ? true
            : false,
        };
      });

      return updatedFollowers;
    }),

  getFollowingList: publicProcedure
    .input(
      z.object({
        username: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      const following = await ctx.prisma.user.findMany({
        where: {
          followers: {
            some: {
              username: input.username.slice(1, input.username.length),
            },
          },
        },
        select: {
          id: true,
          name: true,
          tagline: true,
          username: true,
          profile: true,
        },
        take: 20,
      });
      const authorUser = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session?.user?.id,
        },
        select: {
          following: {
            select: {
              id: true,
            },
          },
        },
      });

      const updatedFollowing = following.map((user) => {
        return {
          ...user,
          isFollowing: authorUser?.following.some(
            (following) => following.id === user.id
          )
            ? true
            : false,
        };
      });

      return updatedFollowing;
    }),

  getUserDashboardRoadmapDetails: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        articles: {
          select: {
            id: true,
          },
          take: 1,
        },
        handle: {
          select: {
            appearance: true,
          },
        },
      },
    });

    return data;
  }),
  subscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    const { session, prisma } = ctx;

    if (!session.user?.id) {
      throw new Error("Not authenticated");
    }

    const data = await prisma.user.findUnique({
      where: {
        id: session.user?.id,
      },
      select: {
        stripeSubscriptionStatus: true,
      },
    });

    if (!data) {
      throw new Error("Could not find user");
    }

    return data.stripeSubscriptionStatus;
  }),
});
