import { TRPCError } from "@trpc/server";
import { and, desc, eq, gt, gte, ilike, inArray, lt, lte } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { Session } from "next-auth";
import readingTime from "reading-time";
import slugify from "slugify";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type * as schemaFile from "~/server/db/schema";
import {
  articles,
  comments,
  customTabs,
  follow,
  handles,
  likesToArticles,
  likesToComment,
  notifications,
  readersToArticles,
  series,
  tags,
  tagsToArticles,
  tagsToUsers,
  users,
} from "~/server/db/schema";
import type { ArticleCardWithComments } from "~/types";
import {
  displayUniqueObjects,
  selectArticleCard,
  slugSetting,
} from "~/utils/constants";
import {
  refactorActivityHelper,
  type Activity,
} from "./../../../utils/microFunctions";

const getArticlesWithUserFollowingProfiles = async (
  ctx: {
    session: Session | null;
    db: NeonHttpDatabase<typeof schemaFile>;
  },
  articles: ArticleCardWithComments[]
) => {
  // If user is logged in, get the user's following profiles else return empty array for commenUsers
  // Retrieve user following outside the loop
  const userFollowing = ctx.session?.user
    ? await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
        with: {
          following: {
            columns: {
              userId: true,
            },
          },
        },
      })
    : null;

  // Combine the mapping logic into a single loop
  const updatedArticles = articles.map((article) => {
    const { comments, ...rest } = article;
    let followingComments: {
      id: string;
      profile: string | null;
    }[] = [];

    if (userFollowing) {
      followingComments = displayUniqueObjects(
        comments
          .map((c) => c.user)
          .filter((user) =>
            userFollowing.following.some((f) => f.userId === user.id)
          )
      );
    }

    return { ...rest, commonUsers: followingComments };
  });

  // Handle the case when ctx.session.user is not present
  if (!ctx.session?.user) {
    updatedArticles.forEach((article) => {
      article.commonUsers = [];
    });
  }

  return updatedArticles;
};

const searchResponseFormater = (
  tags: {
    id: string;
    name: string;
    slug: string;
    followers: {
      id: string;
    }[];
  } | null,
  users: {
    id: string;
    name: string;
    username: string;
    profile: string;
    stripeSubscriptionStatus: string | null;
    followers: {
      id: string;
    }[];
  } | null,
  userId: string
) => {
  const res = tags || users;
  if (!res) return;
  const { followers, ...rest } = res;
  let isFollowing = false;
  if (userId) {
    isFollowing = followers.some((follower) => follower.id === userId);
  }
  return {
    ...rest,
    isFollowing,
  };
};

export const postsRouter = createTRPCRouter({
  deleteAll: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.db.delete(customTabs);
    await ctx.db.delete(series);
    await ctx.db.delete(tagsToUsers);
    await ctx.db.delete(handles);
    await ctx.db.delete(tagsToArticles);
    await ctx.db.delete(tags);
    await ctx.db.delete(articles);
    await ctx.db.delete(follow);
    await ctx.db.delete(users);
    await ctx.db.delete(comments);
    await ctx.db.delete(notifications);
    await ctx.db.delete(likesToArticles);
    await ctx.db.delete(likesToComment);
    return {
      success: true,
    };
  }),

  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(6),
        skip: z.number().optional(),
        cursor: z.string().nullable().optional(),
        filter: z
          .object({
            read_time: z.enum(["over_5", "5", "under_5"]).nullable().optional(),
            tags: z.array(
              z.object({
                id: z.string().trim(),
                name: z.string().trim(),
              })
            ),
          })
          .optional()
          .nullable(),
        type: z
          .enum(["personalized", "following", "latest"])
          .optional()
          .default("personalized"),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { cursor, skip, limit } = input;

        const result = await ctx.db.query.articles
          .findMany({
            where: and(
              and(
                eq(articles.isDeleted, false),
                ...(input?.filter?.read_time
                  ? (() => {
                      return input?.filter?.read_time === "over_5"
                        ? [gt(articles.read_time, 5)]
                        : input?.filter?.read_time === "under_5"
                        ? [lt(articles.read_time, 5)]
                        : input?.filter?.read_time === "5"
                        ? [eq(articles.read_time, 5)]
                        : [];
                    })()
                  : []),
                ...(input?.filter?.tags
                  ? (() => {
                      return input?.filter?.tags.length > 0
                        ? [
                            inArray(
                              tags.name,
                              input?.filter?.tags.map((tag) => tag.name)
                            ),
                          ]
                        : [];
                    })()
                  : [])
              )
            ),
            limit: (limit || 6) + 1,
            offset: skip,
            orderBy:
              input?.type === "latest"
                ? [desc(articles.createdAt)]
                : [
                    desc(articles.likesCount),
                    desc(articles.commentsCount),
                    desc(articles.createdAt),
                  ],
            ...selectArticleCard,
          })
          .then((article) =>
            article.map((ele) => ({ ...ele, tags: ele.tags.map((e) => e.tag) }))
          );

        let nextCursor: typeof cursor | undefined = undefined;
        if (result.length > limit) {
          const nextItem = result.pop(); // return the last item from the array
          nextCursor = nextItem?.id;
        }

        const formattedPosts = await getArticlesWithUserFollowingProfiles(
          {
            session: ctx.session,
            db: ctx.db,
          },
          result
        );

        return {
          posts: formattedPosts,
          // posts: result,
          nextCursor,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  getArticlesUsingTag: publicProcedure
    .input(
      z.object({
        name: z.string().trim(),
        filter: z
          .object({
            read_time: z.enum(["over_5", "5", "under_5"]).nullable().optional(),
            tags: z.array(
              z.object({
                id: z.string().trim(),
                name: z.string().trim(),
              })
            ),
          })
          .optional()
          .nullable(),
        limit: z.number().optional().default(6),
        skip: z.number().optional(),
        cursor: z.string().nullable().optional(),
        type: z.enum(["hot", "new"]).optional().default("new"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, skip, limit } = input;

      const result = await ctx.db.query.articles
        .findMany({
          limit: (limit || 6) + 1,
          offset: skip,
          orderBy:
            input.type === "hot"
              ? [desc(articles.likesCount), desc(articles.commentsCount)]
              : [desc(articles.createdAt)],
          ...selectArticleCard,
          where: and(
            eq(articles.isDeleted, false),
            ...(input?.filter?.read_time
              ? (() => {
                  return input?.filter?.read_time === "over_5"
                    ? [gt(articles.read_time, 5)]
                    : input?.filter?.read_time === "under_5"
                    ? [lt(articles.read_time, 5)]
                    : input?.filter?.read_time === "5"
                    ? [eq(articles.read_time, 5)]
                    : [];
                })()
              : []),
            ...(input?.filter?.tags
              ? (() => {
                  return input?.filter?.tags.length > 0
                    ? [
                        ilike(
                          tags.name,
                          inArray(
                            tags.name,
                            input?.filter?.tags.map((tag) => tag.name)
                          )
                        ),
                      ]
                    : [];
                })()
              : [])
          ),
        })
        .then((res) =>
          res.map((ele) => ({ ...ele, tags: ele.tags.map((e) => e.tag) }))
        );

      let nextCursor: typeof cursor | undefined = undefined;
      if (result.length > limit) {
        const nextItem = result.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }

      const formattedPosts = await getArticlesWithUserFollowingProfiles(
        {
          session: ctx.session,
          db: ctx.db,
        },
        result
      );

      return {
        posts: formattedPosts,
        // posts: result,
        nextCursor,
      };
    }),

  getMany: publicProcedure
    .input(
      z.object({
        ids: z
          .array(z.object({ id: z.string().trim() }))
          .optional()
          .default([]),
      })
    )
    .query(async ({ ctx, input }) => {
      const articlesData = await ctx.db.query.articles
        .findMany({
          ...selectArticleCard,
          limit: 15,
          where: and(
            eq(articles.isDeleted, false),
            inArray(
              articles.id,
              input.ids.map((id) => id.id)
            )
          ),
        })
        .then((res) =>
          res.map((ele) => ({ ...ele, tags: ele.tags.map((e) => e.tag) }))
        );

      return await getArticlesWithUserFollowingProfiles(
        {
          session: ctx.session,
          db: ctx.db,
        },
        articlesData
      );
    }),

  getBookmarks: publicProcedure
    .input(
      z.object({
        ids: z
          .array(z.object({ id: z.string().trim() }))
          .optional()
          .default([]),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const res = await ctx.db.query.articles.findMany({
          where: and(
            eq(articles.isDeleted, false),
            inArray(
              articles.id,
              input.ids.map((id) => id.id)
            )
          ),
          columns: {
            id: true,
            read_time: true,
            title: true,
            slug: true,
            userId: true,
          },
          limit: 4,
        });

        return res;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  getSingleArticle: publicProcedure
    .input(
      z.object({
        slug: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const article = await ctx.db.query.articles.findFirst({
          with: {
            user: {
              with: {
                followers: {
                  where: eq(follow.userId, "ctx.session?.user?.id"),
                  columns: {
                    userId: true,
                  },
                },
              },
            },
            series: {
              columns: {
                title: true,
                slug: true,
              },
            },
            tags: {
              with: {
                tag: {
                  columns: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
            likes: {
              columns: {
                userId: true,
              },
            },
          },
          where: and(
            eq(articles.isDeleted, false),
            eq(articles.slug, input.slug)
          ),
        });

        if (!article) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article not found",
          });
        }
        const { followers: _, ...rest } = article.user;

        if (ctx.session?.user) {
          return {
            ...article,
            isFollowing: article.user.followers.length > 0,
            user: rest,
          };
        } else {
          return {
            ...article,
            isFollowing: false,
            user: rest,
          };
        }
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong, try again later",
          });
        }
      }
    }),

  getArticleToEdit: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const article = await ctx.db.query.articles.findFirst({
          where: and(
            eq(articles.slug, input.slug),
            eq(articles.isDeleted, false)
          ),
          columns: {
            title: true,
            subtitle: true,
            content: true,
            cover_image: true,
            cover_image_key: true,
            slug: true,
            seoTitle: true,
            disabledComments: true,
            seoDescription: true,
            seoOgImage: true,
            userId: true,
            seoOgImageKey: true,
            seriesId: true,
          },
          with: {
            series: {
              columns: {
                id: true,
                title: true,
              },
            },
            tags: {
              with: {
                tag: {
                  columns: {
                    name: true,
                  },
                },
              },
            },
          },
        });

        if (!article) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article not found",
          });
        }

        if (article.userId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to edit this article",
          });
        }

        return {
          ...article,
          tags: article.tags.map((e) => e.tag.name),
          series: article.series?.title || null,
          seoTitle: article.seoTitle || "",
          seoDescription: article.seoDescription || "",
        };
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong, try again later",
          });
        }
      }
    }),

  new: publicProcedure
    .input({
      ...z.object({
        title: z
          .string()
          .min(5, "Title should be atleset of 5 characters")
          .trim(),
        subtitle: z.string().trim(),
        content: z
          .string()
          .min(25, "Content should be atleast of 25 characters")
          .trim(),
        cover_image: z.string().optional(),
        cover_image_Key: z.string().optional(),
        tags: z.array(z.string().trim()).default([]),
        slug: z.string().trim(),
        seriesId: z.string().optional(),
        seoTitle: z.string().trim(),
        seoDescription: z.string().trim(),
        seoOgImage: z.string().trim().optional(),
        disabledComments: z.boolean().default(false).optional(),

        edit: z.boolean(), //? article is being edited or created
        userId: z.string(),
      }),
    })
    .mutation(async ({ ctx, input }) => {
      try {
        const existingArticle = await ctx.db.query.articles.findFirst({
          where: eq(articles.slug, input.slug),
          columns: {
            id: true,
          },
          with: {
            tags: {
              with: {
                tag: {
                  columns: {
                    name: true,
                  },
                },
              },
            },
          },
        });

        // check for not registered tags
        const allTags = await ctx.db
          .insert(tags)
          .values([
            ...input.tags.map((tag) => ({
              name: tag,
              slug: slugify(tag, slugSetting),
            })),
          ])
          .onConflictDoNothing()
          .returning({
            id: tags.id,
          });

        const { edit, tags: _, ...rest } = input;

        if (edit && !!existingArticle) {
          // editing an article

          const [updatedArticle] = await ctx.db
            .update(articles)
            .set({
              ...rest,
              read_time: Math.ceil(readingTime(input.content).minutes) || 1,
              seoTitle: input.seoTitle || input.title,
              seoDescription:
                input.seoDescription ||
                input.subtitle ||
                input.content.slice(0, 40),
              seoOgImage: input.seoOgImage || input.cover_image,
            })
            .where(eq(articles.id, existingArticle.id))
            .returning({
              id: articles.id,
            });

          await ctx.db
            .insert(tagsToArticles)
            .values(
              allTags.map((tag) => ({
                articleId: updatedArticle?.id as string,
                tagId: tag.id,
              }))
            )
            .onConflictDoNothing();

          const result = await ctx.db.query.articles.findFirst({
            where: eq(articles.id, updatedArticle?.id as string),
            columns: {
              id: true,
              title: true,
              subtitle: true,
              content: true,
              cover_image: true,
              cover_image_key: true,
              slug: true,
              seoTitle: true,
              disabledComments: true,
              seoDescription: true,
              seoOgImage: true,
              userId: true,
              seoOgImageKey: true,
              seriesId: true,
            },
            with: {
              series: {
                columns: {
                  id: true,
                  title: true,
                },
              },
              tags: {
                with: {
                  tag: {
                    columns: {
                      name: true,
                    },
                  },
                },
              },
            },
          });

          return result;
        } else {
          // creating article
          const [newArticle] = await ctx.db
            .insert(articles)
            .values({
              ...rest,
              userId: input.userId,
              read_time: Math.ceil(readingTime(input.content).minutes) || 1,
              slug: input.slug,
              seoTitle: input.seoTitle || input.title,
              seoDescription:
                input.seoDescription ||
                input.subtitle ||
                input.content.slice(0, 40),
              seoOgImage: input.seoOgImage || input.cover_image,
            })
            .returning({
              id: articles.id,
            });

          if (!newArticle) return;

          await ctx.db.insert(tagsToArticles).values(
            allTags.map((tag) => ({
              articleId: newArticle.id,
              tagId: tag.id,
            }))
          );

          const result = await ctx.db.query.articles.findFirst({
            where: eq(articles.id, newArticle.id),
            columns: {
              id: true,
              title: true,
              subtitle: true,
              content: true,
              cover_image: true,
              cover_image_key: true,
              slug: true,
              seoTitle: true,
              disabledComments: true,
              seoDescription: true,
              seoOgImage: true,
              userId: true,
              seoOgImageKey: true,
              seriesId: true,
            },
            with: {
              series: {
                columns: {
                  id: true,
                  title: true,
                },
              },
              tags: {
                columns: {
                  articleId: false,
                  tagId: false,
                },
                with: {
                  tag: {
                    columns: {
                      name: true,
                    },
                  },
                },
              },
            },
          });

          return result;
        }
      } catch (err) {
        console.log({ err });
        if (err instanceof TRPCError) {
          throw err;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong, try again later",
          });
        }
      }
    }),

  getRecentActivity: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(
          users.username,
          input.username.slice(1, input.username.length)
        ),
        columns: {
          createdAt: true,
          id: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const activities = await ctx.db.query.articles.findMany({
        with: {
          user: {
            columns: {
              username: true,
            },
          },
        },
        where: and(eq(articles.isDeleted, false), eq(articles.userId, user.id)),
        columns: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          userId: true,
        },
        limit: 10,
        orderBy: [desc(articles.createdAt)],
      });

      // refactor using refactorActivityHelper
      const newActivities = activities.map((e) => ({
        ...e,
        activity_type: "ARTICLE",
      })) as Activity[];

      const refactoredActivities = refactorActivityHelper([
        ...newActivities,
        {
          id: uuid(),
          title: "Joined Hashnode Clone",
          slug: "",
          createdAt: user?.createdAt,
          activity_type: "JOINED",
        },
      ]);
      return Array.from(refactoredActivities);
    }),

  search: publicProcedure
    .input(
      z.object({
        type: z.enum(["TOP", "ARTICLES", "TAGS", "USERS", "LATEST"]),
        query: z.string().trim(),
      })
    )
    .query(({ ctx, input }) => {
      // const { query, type } = input;
      // let result = null;
      // switch (type) {
      //   case "TAGS":
      //     const tags = await ctx.prisma.tag.findMany({
      //       where: {
      //         OR: [
      //           { name: { contains: query } },
      //           { slug: { contains: query } },
      //           { description: { contains: query } },
      //         ],
      //       },
      //       take: 6,
      //       select: {
      //         id: true,
      //         name: true,
      //         slug: true,
      //         followers: {
      //           select: {
      //             id: true,
      //           },
      //         },
      //       },
      //     });

      //     const response = tags.map((e) => {
      //       return searchResponseFormater(
      //         e,
      //         null,
      //         ctx.session?.user?.id as string
      //       );
      //     });

      //     result = {
      //       users: null,
      //       tags: response,
      //       articles: null,
      //     };
      //     break;

      //   case "USERS":
      //     const users = await ctx.prisma.user.findMany({
      //       where: {
      //         OR: [
      //           { name: { contains: query, mode: "insensitive" } },
      //           { username: { contains: query, mode: "insensitive" } },
      //         ],
      //       },
      //       take: 6,
      //       select: {
      //         id: true,
      //         name: true,
      //         username: true,
      //         profile: true,
      //         stripeSubscriptionStatus: true,
      //         followers: {
      //           select: {
      //             id: true,
      //           },
      //         },
      //       },
      //     });

      //     const res = users.map((e) => {
      //       return searchResponseFormater(
      //         null,
      //         e,
      //         ctx.session?.user?.id as string
      //       );
      //     });

      //     result = {
      //       users: res,
      //       tags: null,
      //       articles: null,
      //     };
      //     break;

      //   default:
      //     const articles = ctx.prisma.article.findMany({
      //       where: {
      //         isDeleted: false,

      //         OR: [
      //           { title: { contains: query, mode: "insensitive" } },
      //           { slug: { contains: query, mode: "insensitive" } },
      //           {
      //             tags: {
      //               some: { name: { contains: query, mode: "insensitive" } },
      //             },
      //           },
      //           {
      //             user: {
      //               OR: [
      //                 { username: { contains: query, mode: "insensitive" } },
      //                 { name: { contains: query, mode: "insensitive" } },
      //               ],
      //             },
      //           },
      //         ],
      //       },
      //       take: 6,
      //       select: {
      //         id: true,
      //         title: true,
      //         user: {
      //           select: {
      //             name: true,
      //             username: true,
      //             profile: true,
      //             id: true,
      //             stripeSubscriptionStatus: true,
      //           },
      //         },
      //         cover_image: true,
      //         slug: true,
      //         createdAt: true,
      //         read_time: true,
      //         updatedAt: true,
      //         likesCount: true,
      //         commentsCount: true,
      //       },
      //       orderBy: [
      //         type === "LATEST"
      //           ? { createdAt: "desc" }
      //           : { likesCount: "desc" },
      //       ],
      //     });

      //     const tagsSearch = ctx.prisma.tag.findMany({
      //       where: {
      //         OR: [
      //           { name: { contains: query } },
      //           { slug: { contains: query } },
      //           { description: { contains: query } },
      //         ],
      //       },
      //       take: 6,
      //       select: {
      //         id: true,
      //         name: true,
      //         slug: true,
      //         followers: {
      //           select: {
      //             id: true,
      //           },
      //         },
      //       },
      //     });

      //     const usersSearch = ctx.prisma.user.findMany({
      //       where: {
      //         OR: [
      //           { name: { contains: query, mode: "insensitive" } },
      //           { username: { contains: query, mode: "insensitive" } },
      //         ],
      //       },
      //       take: 6,
      //       select: {
      //         id: true,
      //         name: true,
      //         username: true,
      //         stripeSubscriptionStatus: true,
      //         profile: true,
      //         followers: {
      //           select: {
      //             id: true,
      //           },
      //         },
      //       },
      //     });

      //     const [articlesRes, tagsRes, usersRes] =
      //       await ctx.prisma.$transaction([articles, tagsSearch, usersSearch]);

      //     result = {
      //       users: usersRes.map((e) => {
      //         return searchResponseFormater(
      //           null,
      //           e,
      //           ctx.session?.user?.id as string
      //         );
      //       }),
      //       tags: tagsRes.map((e) => {
      //         return searchResponseFormater(
      //           e,
      //           null,
      //           ctx.session?.user?.id as string
      //         );
      //       }),
      //       articles: articlesRes,
      //     };
      // }

      return [];
    }),

  trendingArticles: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(6),
        skip: z.number().optional(),
        cursor: z.string().nullable().optional(),
        variant: z.enum(["week", "month", "year", "any"]).default("any"),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { cursor, skip, limit } = input;
        const startDate = new Date();
        const endDate = new Date();

        if (input?.variant === "week") {
          startDate.setDate(startDate.getDate() - 7);
        } else if (input?.variant === "month") {
          startDate.setMonth(startDate.getMonth() - 1);
        } else if (input?.variant === "year") {
          startDate.setFullYear(startDate.getFullYear() - 1);
        }

        const articlesData = await ctx.db.query.articles
          .findMany({
            where: and(
              eq(articles.isDeleted, false),
              input?.variant === "any"
                ? undefined
                : and(
                    gte(articles.createdAt, startDate),
                    lte(articles.createdAt, endDate)
                  )
            ),
            limit: (limit || 6) + 1,
            offset: skip,
            ...selectArticleCard,
            orderBy: [
              desc(articles.createdAt),
              desc(articles.likesCount),
              desc(articles.commentsCount),
            ],
          })
          .then((res) =>
            res.map((article) => ({
              ...article,
              tags: article.tags.map((e) => e.tag),
            }))
          );

        let nextCursor: typeof cursor | undefined = undefined;
        if (articlesData.length > limit) {
          const nextItem = articlesData.pop(); // return the last item from the array
          nextCursor = nextItem?.id;
        }

        const formattedPosts = await getArticlesWithUserFollowingProfiles(
          {
            session: ctx.session,
            db: ctx.db,
          },
          articlesData
        );

        return {
          posts: formattedPosts,
          nextCursor,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  getFollowingArticles: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(6),
        skip: z.number().optional(),
        cursor: z.string().nullable().optional(),
        variant: z.enum(["week", "month", "year", "any"]).default("any"),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { cursor, skip, limit } = input;

        const startDate = new Date();
        const endDate = new Date();

        if (input?.variant === "week") {
          startDate.setDate(startDate.getDate() - 7);
        } else if (input?.variant === "month") {
          startDate.setMonth(startDate.getMonth() - 1);
        } else if (input?.variant === "year") {
          startDate.setFullYear(startDate.getFullYear() - 1);
        }

        const articlesdata = await ctx.db.query.articles
          .findMany({
            where: and(
              eq(articles.isDeleted, false),
              eq(articles.userId, ctx.session.user.id),
              input?.variant === "any"
                ? undefined
                : and(
                    gte(articles.createdAt, startDate),
                    lte(articles.createdAt, endDate)
                  )
            ),
            limit: (limit || 6) + 1,
            offset: skip,
            ...selectArticleCard,
            orderBy: [
              desc(articles.createdAt),
              desc(articles.likesCount),
              desc(articles.commentsCount),
            ],
          })
          .then((res) =>
            res.map((article) => ({
              ...article,
              tags: article.tags.map((e) => e.tag),
            }))
          );

        let nextCursor: typeof cursor | undefined = undefined;
        if (articlesdata.length > limit) {
          const nextItem = articlesdata.pop(); // return the last item from the array
          nextCursor = nextItem?.id;
        }

        const formattedPosts = await getArticlesWithUserFollowingProfiles(
          {
            session: ctx.session,
            db: ctx.db,
          },
          articlesdata
        );

        return {
          posts: formattedPosts,
          nextCursor,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  getAuthorArticles: publicProcedure
    .input(
      z.object({
        username: z.string().trim(),
        limit: z.number().optional().default(6),
        skip: z.number().optional(),
        cursor: z.string().nullable().optional(),
        type: z
          .enum(["PUBLISHED", "SCHEDULED", "DELETED"])
          .optional()
          .default("PUBLISHED"),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        if (input.type === "SCHEDULED") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Scheduled articles are not available for public",
          });
        }

        const { cursor, skip, limit } = input;

        const articlesData = await ctx.db.query.articles.findMany({
          where: and(
            eq(articles.isDeleted, false),
            eq(users.username, input.username),
            input.type === "DELETED"
              ? eq(articles.isDeleted, true)
              : eq(articles.isDeleted, false)
          ),
          limit: (limit || 6) + 1,
          offset: skip,
          columns: {
            id: true,
            title: true,
            subtitle: true,
            slug: true,
            createdAt: true,
            read_time: true,
            userId: true,
            cover_image: true,
            cover_image_key: true,
          },
          orderBy: [desc(articles.createdAt)],
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (articlesData.length > limit) {
          const nextItem = articlesData.pop(); // return the last item from the array
          nextCursor = nextItem?.id;
        }

        return {
          posts: articlesData,
          nextCursor,
        };
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  deleteArticlePermantly: protectedProcedure
    .input(
      z.object({
        slug: z.string().trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const article = await ctx.db
          .delete(articles)
          .where(eq(articles.slug, input.slug));

        if (!article) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article not found",
          });
        }

        return {
          success: true,
        };
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  getAuthorArticlesByHandle: publicProcedure
    .input(
      z.object({
        handle: z.string().trim(),
        limit: z.number().optional().default(6),
        skip: z.number().optional(),
        cursor: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { cursor, skip, limit } = input;

        const article = await ctx.db.query.articles.findMany({
          with: {
            user: {
              with: {
                handle: {
                  columns: {
                    handle: true,
                  },
                },
              },
              columns: {
                profile: true,
              },
            },
          },
          where: and(
            eq(articles.isDeleted, false),
            eq(handles.handle, input.handle)
          ),
          columns: {
            id: true,
            title: true,
            slug: true,
            createdAt: true,
            content: true,
            read_time: true,
            subtitle: true,
            cover_image: true,
            userId: true,
          },
          limit: (limit || 6) + 1,
          offset: skip,
          orderBy: [desc(articles.createdAt)],
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (article.length > limit) {
          const nextItem = article.pop(); // return the last item from the array
          nextCursor = nextItem?.id;
        }

        return {
          posts: article,
          nextCursor,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  read: protectedProcedure
    .input(
      z.object({
        slug: z.string().trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const article = await ctx.db.query.articles.findFirst({
          where: eq(articles.slug, input.slug),
          columns: {
            id: true,
            userId: true,
            readCount: true,
          },
          with: {
            user: {
              columns: {
                id: true,
              },
            },
            readers: {
              columns: {
                userId: true,
              },
            },
          },
        });

        if (!article) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article not found",
          });
        }

        if (!article.user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article not found",
          });
        }

        if (ctx.session?.user?.id === article.user.id) {
          return;
        }

        const hasRead = article.readers.some(
          (reader) => reader.userId === ctx.session?.user?.id
        );

        if (!hasRead) {
          const updatedCount = hasRead
            ? article.readCount
            : article.readCount + 1;
          await ctx.db
            .update(articles)
            .set({
              readCount: updatedCount,
            })
            .where(eq(articles.id, article.id));
          await ctx.db.insert(readersToArticles).values({
            articleId: article.id,
            userId: ctx.session?.user?.id,
          });
        }

        return {
          success: true,
        };
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  deleteTemporarily: protectedProcedure
    .input(
      z.object({
        slug: z.string().trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const article = await ctx.db.query.articles.findFirst({
          where: eq(articles.slug, input.slug),
          columns: {
            id: true,
            isDeleted: true,
            userId: true,
          },
          with: {
            user: {
              columns: {
                id: true,
              },
            },
          },
        });

        if (article?.isDeleted) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Article already deleted",
          });
        }

        if (!article) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article not found",
          });
        }

        if (!article.user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article not found",
          });
        }

        if (ctx.session?.user?.id === article.user.id) {
          await ctx.db
            .update(articles)
            .set({
              isDeleted: true,
            })
            .where(eq(articles.id, article.id));

          return {
            success: true,
          };
        }

        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to perform this action",
        });
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong, try again later",
          });
        }
      }
    }),

  restoreArticle: protectedProcedure
    .input(
      z.object({
        slug: z.string().trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const article = await ctx.db.query.articles.findFirst({
          where: eq(articles.slug, input.slug),
          columns: {
            id: true,
            isDeleted: true,
            userId: true,
          },
          with: {
            user: {
              columns: {
                id: true,
              },
            },
          },
        });

        if (!article?.isDeleted) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Article already restored",
          });
        }

        if (!article.user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article not found",
          });
        }

        if (ctx.session?.user?.id === article.user.id) {
          await ctx.db
            .update(articles)
            .set({
              isDeleted: false,
            })
            .where(eq(articles.id, article.id));

          return {
            success: true,
          };
        }

        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to perform this action",
        });
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong, try again later",
          });
        }
      }
    }),
});
