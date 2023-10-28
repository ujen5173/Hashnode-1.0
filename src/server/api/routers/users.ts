import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { follow, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { publicProcedure } from "./../trpc";

export const usersRouter = createTRPCRouter({
  followUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        // username: z.string().trim(),
        // userId: z.string(),
        // followingId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // get following user data
      const me = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session?.user.id),
        columns: {
          id: true,
          followingCount: true,
        },
        with: {
          following: {
            where: eq(follow.userId, input.userId),
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
        where: eq(users.id, input.userId),
        columns: {
          id: true,
          followersCount: true,
        },
        with: {
          followers: {
            where: eq(follow.followingId, ctx.session?.user.id),
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

      const isFollowing = me?.following.length > 0;

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
              eq(follow.userId, input.userId),
              eq(follow.followingId, ctx.session?.user.id)
            )
          );

        // update the following count
        await ctx.db
          .update(users)
          .set({
            followingCount:
              +(otherUser.followers[0]?.user?.followersCount ?? 1) - 1,
          })
          .where(eq(users.id, ctx.session?.user.id));

        await ctx.db
          .update(users)
          .set({
            followersCount: +(me.following[0]?.user?.followingCount ?? 1) - 1,
          })
          .where(eq(users.id, input.userId));

        return {
          success: false,
          message: "User unfollowed successfully",
          status: 400,
        };
      } else {
        console.log("Following condition");
        // follow the user
        await ctx.db.insert(follow).values({
          userId: input.userId,
          followingId: ctx.session?.user.id,
        });

        // update the following count
        await ctx.db
          .update(users)
          .set({
            followingCount:
              +(otherUser.followers[0]?.user?.followersCount ?? 0) + 1,
          })
          .where(eq(users.id, ctx.session?.user.id));

        await ctx.db
          .update(users)
          .set({
            followersCount: +(me.following[0]?.user?.followingCount ?? 0) + 1,
          })
          .where(eq(users.id, input.userId));
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
        image: z.string().trim(),
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
    }),

  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string().trim(),
        username: z.string().trim(),
        email: z.string().trim(),
        location: z.string().trim(),
        image: z.string().trim(),
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
      const updatedUser = await ctx.db
        .update(users)
        .set(input)
        .where(eq(users.id, ctx.session.user.id))
        .returning({
          name: users.name,
          username: users.username,
          email: users.email,
          location: users.location,
          image: users.image,
          tagline: users.tagline,
          stripeSubscriptionStatus: users.stripeSubscriptionStatus,
          available: users.available,
          cover_image: users.cover_image,
          bio: users.bio,
          skills: users.skills,
          social: users.social,
        });

      return {
        success: true,
        message: "User updated successfully",
        status: 200,
        data: updatedUser,
      };
    }),

  getFollowersList: publicProcedure
    .input(
      z.object({
        userId: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      const f = await ctx.db.query.follow.findMany({
        where: eq(follow.followingId, input.userId),
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
              image: true,
            },
          },
        },
        limit: 20,
      });

      let authorUser: {
        followers: {
          user: {
            id: string;
            name: string;
            username: string;
            image: string | null;
            tagline: string | null;
          };
        }[];
      } = {
        followers: [],
      };

      if (ctx?.session?.user.id) {
        authorUser = await ctx.db.query.users
          .findFirst({
            where: eq(users.id, ctx.session?.user.id),
            columns: {
              id: true,
            },
            with: {
              followers: {
                columns: {
                  followingId: false,
                  userId: false,
                },
                where: eq(follow.userId, input.userId),
                with: {
                  following: {
                    columns: {
                      id: true,
                      name: true,
                      tagline: true,
                      username: true,
                      image: true,
                    },
                  },
                },
              },
            },
          })
          .then((res) => {
            if (res) {
              return {
                followers: res.followers.map((f) => ({ user: f.following })),
              };
            }
            return {
              followers: [],
            };
          });
      }

      if (!authorUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author not found!",
        });
      }

      const updatedFollowers = f.map((user) => {
        return {
          ...user.user,
          isFollowing: authorUser?.followers.length > 0,
        };
      });
      return updatedFollowers;
    }),

  getFollowingList: publicProcedure
    .input(
      z.object({
        userId: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      const f = await ctx.db.query.follow.findMany({
        where: eq(follow.userId, input.userId),
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
              image: true,
            },
          },
        },
        limit: 20,
      });

      let authorUser: {
        following: {
          user: {
            id: string;
            name: string;
            username: string;
            image: string | null;
            tagline: string | null;
          };
        }[];
      } = {
        following: [],
      };

      if (ctx?.session?.user.id) {
        authorUser = await ctx.db.query.users
          .findFirst({
            where: eq(users.id, ctx.session?.user.id),
            columns: {
              id: true,
            },
            with: {
              following: {
                where: eq(follow.userId, input.userId),
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
                      image: true,
                    },
                  },
                },
              },
            },
          })
          .then((res) => {
            if (res) {
              return { following: res.following };
            }
            return {
              following: [],
            };
          });
      }

      if (!authorUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author not found!",
        });
      }

      const updatedFollowing = f.map((user) => {
        return {
          ...user.user,
          isFollowing: authorUser?.following.length > 0,
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
