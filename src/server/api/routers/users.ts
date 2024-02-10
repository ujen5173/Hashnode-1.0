import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { articles, follow, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { publicProcedure } from "./../trpc";

export const usersRouter = createTRPCRouter({
  followUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
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

      if (isFollowing) {
        // unfollow the user
        await ctx.db
          .delete(follow)
          .where(
            and(
              eq(follow.userId, input.userId),
              eq(follow.followingId, ctx.session?.user.id),
            ),
          );

        // update the following count
        await ctx.db
          .update(users)
          .set({
            followingCount: me.followingCount > 1 ? me.followingCount - 1 : 0,
          })
          .where(eq(users.id, ctx.session?.user.id));

        // update the followers count for the other user
        await ctx.db
          .update(users)
          .set({
            followersCount:
              otherUser.followersCount > 1 ? otherUser.followersCount - 1 : 0,
          })
          .where(eq(users.id, input.userId));

        return {
          success: true,
          message: "User unfollowed successfully",
          status: 200,
        };
      } else {
        // follow the user
        await ctx.db.insert(follow).values({
          userId: input.userId,
          followingId: ctx.session?.user.id,
        });

        // update the following count
        await ctx.db
          .update(users)
          .set({
            followingCount: me.followingCount + 1,
          })
          .where(eq(users.id, ctx.session?.user.id));

        // update the followers count for the other user
        await ctx.db
          .update(users)
          .set({
            followersCount: otherUser.followersCount + 1,
          })
          .where(eq(users.id, input.userId));

        return {
          success: true,
          message: "User followed successfully",
          status: 200,
        };
      }
    }),

    followState: protectedProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.username, input.username),
        columns: {
          id: true,
        },
        with: {
          followers: {
            where: eq(follow.followingId, ctx.session?.user.id),
          },
        },
      });

      if (!user) {
        return {
          following: false,
        };
      }

      return {
        following: user?.followers.length > 0,
      };
    }),

  sessionUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user?.id;
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        handle: {
          with: {
            customTabs: true,
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.insert(users).values(input).returning();

      return user;
    }),

  getUserByUsername: publicProcedure
    .input(
      z.object({
        username: z.string().trim(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(
          users.username,
          input.username.slice(1, input.username.length),
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
        location: z.string().trim().optional().nullable(),
        image: z.string().trim().optional().nullable(),
        tagline: z.string().trim().optional().nullable(),
        available: z.string().trim().optional().nullable(),
        cover_image: z.string().trim().optional().nullable(),
        bio: z.string().trim().optional().nullable(),
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
      }),
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
        message: "Updated successfully",
        status: 200,
        data: updatedUser,
      };
    }),

  getFollowersList: publicProcedure
    .input(
      z.object({
        userId: z.string().trim(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.users
        .findFirst({
          where: eq(users.id, input.userId),
          columns: {
            id: true,
          },
          with: {
            followers: {
              limit: 20,
              columns: {
                followingId: false,
                userId: false,
              },
              with: {
                following: {
                  columns: {
                    id: true,
                    username: true,
                    tagline: true,
                    name: true,
                    image: true,
                  },
                  ...(ctx?.session?.user?.id
                    ? {
                        with: {
                          following: {
                            where: eq(follow.userId, ctx?.session?.user?.id),
                            columns: {
                              userId: true,
                            },
                          },
                        },
                      }
                    : {}),
                },
              },
            },
          },
        })
        .then(
          (
            e:
              | {
                  id: string;
                  followers: {
                    following: {
                      followers?: {
                        userId: string;
                      }[];
                      id: string;
                      tagline: string | null;
                      name: string;
                      username: string;
                      image: string | null;
                    };
                  }[];
                }
              | undefined,
          ) =>
            e?.followers.map((f) => {
              const { followers, ...rest } = f.following;
              return { ...rest, isFollowing: (followers ?? []).length > 0 };
            }),
        );

      return result;
    }),

  getFollowingList: publicProcedure
    .input(
      z.object({
        userId: z.string().trim(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.users
        .findFirst({
          where: eq(users.id, input.userId),
          columns: {
            id: true,
          },
          with: {
            following: {
              limit: 20,
              columns: {
                followingId: false,
                userId: false,
              },
              with: {
                user: {
                  columns: {
                    id: true,
                    username: true,
                    name: true,
                    tagline: true,
                    image: true,
                  },
                  ...(ctx?.session?.user?.id
                    ? {
                        with: {
                          followers: {
                            where: eq(
                              follow.followingId,
                              ctx?.session?.user?.id,
                            ),
                            columns: {
                              userId: true,
                            },
                          },
                        },
                      }
                    : {}),
                },
              },
            },
          },
        })
        .then(
          (
            e:
              | {
                  id: string;
                  following: {
                    user: {
                      followers?: {
                        userId: string;
                      }[];
                      id: string;
                      name: string;
                      username: string;
                      tagline: string | null;
                      image: string | null;
                    };
                  }[];
                }
              | undefined,
          ) =>
            e?.following.map((f) => {
              const { followers, ...rest } = f.user;
              return { ...rest, isFollowing: (followers ?? []).length > 0 };
            }),
        );

      return result;
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

    const articlesData = await ctx.db.query.articles.findFirst({
      where: eq(articles.userId, ctx.session.user?.id),
      columns: {
        id: true,
      },
    });

    return {
      ...data,
      articles: articlesData,
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
