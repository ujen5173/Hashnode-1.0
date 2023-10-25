import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { follow, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { publicProcedure } from "./../trpc";

export const usersRouter = createTRPCRouter({
  followUser: publicProcedure
    .input(
      z.object({
        // username: z.string().trim(),
        userId: z.string(),
        followingId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // get following user data
      const me = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.userId),
        columns: {
          id: true,
          followingCount: true,
        },
        with: {
          following: {
            where: eq(follow.userId, input.followingId),
            with: {
              user: {
                columns: {
                  id: true,
                  followingCount: true,
                },
              },
            },
          },
        },
      });
      const otherUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.followingId),
        columns: {
          id: true,
          followersCount: true,
        },
        with: {
          followers: {
            where: eq(follow.followingId, input.userId),
            with: {
              user: {
                columns: {
                  id: true,
                  followersCount: true,
                },
              },
            },
          },
        },
      });

      if (!me || !otherUser) {
        return {
          success: false,
          message: "User not found",
          status: 400,
        };
      }

      const isFollowing = me?.following.length > 0 ? true : false;

      if (
        isFollowing &&
        (me.following[0]?.user?.id || otherUser.followers[0]?.user?.id)
      ) {
        console.log("UnFollowing condition");
        // unfollow the user
        await ctx.db
          .delete(follow)
          .where(
            and(
              eq(follow.userId, input.followingId),
              eq(follow.followingId, input.userId)
            )
          );

        // update the following count
        await ctx.db
          .update(users)
          .set({
            followingCount:
              +(otherUser.followers[0]?.user?.followersCount ?? 1) - 1,
          })
          .where(eq(users.id, input.userId));

        await ctx.db
          .update(users)
          .set({
            followersCount: +(me.following[0]?.user?.followingCount ?? 1) - 1,
          })
          .where(eq(users.id, input.followingId));

        return {
          success: false,
          message: "User unfollowed successfully",
          status: 400,
        };
      } else {
        console.log("Following condition");
        // follow the user
        await ctx.db.insert(follow).values({
          userId: input.followingId,
          followingId: input.userId,
        });

        // update the following count
        await ctx.db
          .update(users)
          .set({
            followingCount:
              +(otherUser.followers[0]?.user?.followersCount ?? 0) + 1,
          })
          .where(eq(users.id, input.userId));

        await ctx.db
          .update(users)
          .set({
            followersCount: +(me.following[0]?.user?.followingCount ?? 0) + 1,
          })
          .where(eq(users.id, input.followingId));
        return {
          success: false,
          message: "User followed successfully",
          status: 400,
        };
      }
    }),

  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, "927e54ca-fbb9-48d3-ab53-0e04e63367d7"),
      with: {
        following: {
          columns: {
            userId: true,
          },
        },
        followers: {
          columns: {
            userId: true,
          },
        },
      },
    });
    return user;
  }),

  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().trim(),
        username: z.string().trim(),
        email: z.string().trim(),
        profile: z.string().trim(),
        tagline: z.string().trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.insert(users).values(input).returning();

      return user;
    }),

  getUserByUsername: publicProcedure
    .input(
      z.object({
        username: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      // const user = await ctx.db
      //   .select()
      //   .from(users)
      //   .leftJoin(follower, eq(follower.followerId, users.id))
      //   .where(
      //     eq(users.username, input.username.slice(1, input.username.length))
      //   );

      // console.log(user);
      const user = await ctx.db.query.users.findFirst({
        where: eq(
          users.username,
          input.username.slice(1, input.username.length)
        ),
        with: {
          following: {
            columns: {
              userId: false,
              followingId: false,
            },
            with: {
              user: true,
            },
          },
          followers: {
            columns: {
              userId: false,
              followingId: false,
            },
            with: {
              following: true,
            },
          },
          handle: {
            with: {
              customTabs: true,
            },
          },
        },
      });

      return user;

      // const user = await ctx.prisma.user.findUnique({
      //   where: {
      //     username: input.username.slice(1, input.username.length),
      //   },
      //   include: {
      //     followers: {
      //       select: {
      //         id: true,
      //       },
      //     },
      //   },
      // });

      // let isFollowing = false;

      // if (ctx.session !== null) {
      //   isFollowing = user?.followers.some(
      //     (follower) => follower.id === ctx?.session?.user.id
      //   )
      //     ? true
      //     : false;
      // }

      // if (!user) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "User not found",
      //   });
      // }

      // return { ...user, isFollowing };
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
      await ctx.db
        .update(users)
        .set(input)
        .where(eq(users.id, "927e54ca-fbb9-48d3-ab53-0e04e63367d7"));
      return {
        success: true,
        message: "User updated successfully",
        status: 200,
      };
    }),

  getFollowersList: publicProcedure
    .input(
      z.object({
        username: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      const f = await ctx.db.query.follow.findMany({
        where: eq(follow.followingId, "927e54ca-fbb9-48d3-ab53-0e04e63367d7"),
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              tagline: true,
              username: true,
              profile: true,
            },
          },
        },
        limit: 20,
      });

      const authorUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, "927e54ca-fbb9-48d3-ab53-0e04e63367d7"),
        with: {
          followers: {
            columns: {
              followingId: false,
              userId: false,
            },
            where: eq(follow.userId, "927e54ca-fbb9-48d3-ab53-0e04e63367d7"),
            with: {
              following: {
                columns: {
                  id: true,
                  name: true,
                  tagline: true,
                  username: true,
                  profile: true,
                },
              },
            },
          },
        },
      });

      if (!authorUser) {
        return {
          success: false,
          message: "User not found",
          status: 400,
        };
      }

      const updatedFollowers = f.map((user) => {
        return {
          ...user,
          isFollowing: authorUser?.followers.length > 0 ? true : false,
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
      const f = await ctx.db.query.follow.findMany({
        where: eq(follow.userId, "927e54ca-fbb9-48d3-ab53-0e04e63367d7"),
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              tagline: true,
              username: true,
              profile: true,
            },
          },
        },
        limit: 20,
      });

      const authorUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, "927e54ca-fbb9-48d3-ab53-0e04e63367d7"),
        with: {
          following: {
            where: eq(follow.userId, "927e54ca-fbb9-48d3-ab53-0e04e63367d7"),
            columns: {
              followingId: false,
              userId: false,
            },
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  tagline: true,
                  username: true,
                  profile: true,
                },
              },
            },
          },
        },
      });

      if (!authorUser) {
        return {
          success: false,
          message: "User not found",
          status: 400,
        };
      }

      const updatedFollowing = f.map((user) => {
        return {
          ...user,
          isFollowing: authorUser?.following.length > 0 ? true : false,
        };
      });

      return updatedFollowing;
    }),

  getUserDashboardRoadmapDetails: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user?.id),
      with: {
        handle: {
          columns: {
            appearance: true,
          },
        },
      },
    });

    const articles = await ctx.db.query.articles.findFirst({
      where: eq(users.id, ctx.session.user?.id),
      columns: {
        id: true,
      },
    });

    return {
      ...data,
      articles,
    };
  }),

  subscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user?.id) {
      throw new Error("Not authenticated");
    }

    const data = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user?.id),
      columns: {
        stripeSubscriptionStatus: true,
      },
    });

    if (!data) {
      throw new Error("Could not find user");
    }

    return data.stripeSubscriptionStatus;
  }),
});
