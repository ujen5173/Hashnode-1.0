import {
  NotificationTypes,
  type Prisma,
  type PrismaClient,
} from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import readingTime from "reading-time";
import slugify from "slugify";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type ArticleCardWithComments } from "~/types";
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
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  },
  articles: ArticleCardWithComments[]
) => {
  // If user is logged in, get the user's following profiles else return empty array for commenUsers
  // Retrieve user following outside the loop
  const userFollowing = ctx.session?.user
    ? await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          following: {
            select: {
              id: true,
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
      profile: string;
    }[] = [];

    if (userFollowing) {
      followingComments = displayUniqueObjects(
        comments
          .map((c) => c.user)
          .filter((user) =>
            userFollowing.following.some((f) => f.id === user.id)
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
        const articles = await ctx.prisma.article.findMany({
          where: {
            isDeleted: false,
            ...((input?.filter?.tags || input?.filter?.read_time) && {
              ...(input?.filter?.read_time && {
                read_time:
                  input?.filter?.read_time === "over_5"
                    ? { gt: 5 }
                    : input?.filter?.read_time === "under_5"
                    ? { lt: 5 }
                    : input?.filter?.read_time === "5"
                    ? { equals: 5 }
                    : undefined,
              }),
              ...(input?.filter?.tags &&
                input.filter.tags.length > 0 && {
                  tags: {
                    some: {
                      name: {
                        in: input?.filter?.tags
                          ? input?.filter?.tags.length > 0
                            ? input?.filter?.tags.map((tag) => tag.name)
                            : undefined
                          : undefined,
                        mode: "insensitive",
                      },
                    },
                  },
                }),
            }),
            ...(input?.type === "following" &&
              ctx.session && {
                user: {
                  followers: {
                    some: {
                      id: ctx.session.user.id,
                    },
                  },
                },
              }),
          },
          select: selectArticleCard,
          take: (limit || 6) + 1,
          skip: skip,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy:
            input?.type === "latest"
              ? { createdAt: "desc" }
              : [
                  { likesCount: "desc" },
                  { commentsCount: "desc" },
                  { createdAt: "desc" },
                ],
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (articles.length > limit) {
          const nextItem = articles.pop(); // return the last item from the array
          nextCursor = nextItem?.id;
        }

        const formattedPosts = await getArticlesWithUserFollowingProfiles(
          {
            session: ctx.session,
            prisma: ctx.prisma,
          },
          articles
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

      const articles = await ctx.prisma.article.findMany({
        where: {
          isDeleted: false,
          ...((input?.filter?.tags || input?.filter?.read_time) && {
            ...(input?.filter?.read_time && {
              read_time:
                input?.filter?.read_time === "over_5"
                  ? { gt: 5 }
                  : input?.filter?.read_time === "under_5"
                  ? { lt: 5 }
                  : input?.filter?.read_time === "5"
                  ? { equals: 5 }
                  : undefined,
            }),
            ...(input?.filter?.tags &&
              input.filter.tags.length > 0 && {
                tags: {
                  some: {
                    name: {
                      in: input?.filter?.tags
                        ? input?.filter?.tags.length > 0
                          ? input?.filter?.tags.map((tag) => tag.name)
                          : undefined
                        : undefined,
                      mode: "insensitive",
                    },
                  },
                },
              }),
          }),
          tags: {
            some: {
              name: input.name,
            },
          },
        },
        select: selectArticleCard,
        take: (limit || 6) + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy:
          input.type === "hot"
            ? [
                {
                  likesCount: "desc",
                },
                {
                  commentsCount: "desc",
                },
              ]
            : input.type === "new"
            ? {
                createdAt: "desc",
              }
            : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (articles.length > limit) {
        const nextItem = articles.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }

      const formattedPosts = await getArticlesWithUserFollowingProfiles(
        {
          session: ctx.session,
          prisma: ctx.prisma,
        },
        articles
      );
      return {
        posts: formattedPosts,
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
      return await getArticlesWithUserFollowingProfiles(
        {
          session: ctx.session,
          prisma: ctx.prisma,
        },
        await ctx.prisma.article.findMany({
          where: {
            isDeleted: false,
            id: {
              in: input.ids.map((id) => id.id),
            },
          },
          select: selectArticleCard,
          take: 15,
        })
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
        const res = await ctx.prisma.article.findMany({
          where: {
            isDeleted: false,
            id: {
              in: input.ids.map((id) => id.id),
            },
          },
          select: {
            id: true,
            read_time: true,
            title: true,
            slug: true,
            user: {
              select: {
                name: true,
                stripeSubscriptionStatus: true,
                username: true,
              },
            },
          },
          take: 4,
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
        const article = await ctx.prisma.article.findFirst({
          where: {
            isDeleted: false,
            slug: input.slug,
          },
          include: {
            series: {
              select: {
                title: true,
                slug: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                bio: true,
                profile: true,
                stripeSubscriptionStatus: true,
                handle: {
                  select: {
                    handle: true,
                    name: true,
                    about: true,
                    id: true,
                  },
                },

                followers: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            tags: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            likes: {
              select: {
                id: true,
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

        const { followers, ...rest } = article.user;
        if (ctx.session?.user) {
          const isFollowing = article.user.followers.some(
            (follower) => follower.id === ctx.session?.user.id
          );
          return {
            ...article,
            isFollowing,
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
        const article = await ctx.prisma.article.findFirst({
          where: {
            slug: input.slug,
            isDeleted: false,
          },
          select: {
            title: true,
            subtitle: true,
            content: true,
            cover_image: true,
            cover_imageKey: true,
            slug: true,
            seoTitle: true,
            disabledComments: true,
            seoDescription: true,
            seoOgImage: true,
            userId: true,
            seoOgImageKey: true,
            series: {
              select: {
                id: true,
                title: true,
              },
            },
            tags: {
              select: {
                name: true,
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
          tags: article.tags.map((e) => e.name),
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

  new: protectedProcedure
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
        cover_image: z.string().nullable(),
        cover_imageKey: z.string().nullable(),
        tags: z.array(z.string().trim()).default([]),
        slug: z.string().trim(),
        series: z.string().nullable(),
        seoTitle: z.string().trim(),
        seoDescription: z.string().trim(),
        seoOgImage: z.string().trim().nullable(),
        disabledComments: z.boolean().default(false),

        edit: z.boolean(), //? article is being edited or created
      }),
    })
    .mutation(async ({ ctx, input }) => {
      try {
        const { slug, tags } = input;

        const existingArticle = await ctx.prisma.article.findFirst({
          where: {
            slug: slug,
          },
        });

        if (existingArticle && !input.edit) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Article with this title already exists",
          });
        }

        // Check if tags exist or create them if necessary
        const tagPromises = tags.map(async (tag) => {
          const existingTag = await ctx.prisma.tag.findFirst({
            where: {
              slug: slugify(tag, slugSetting),
            },
          });

          if (!existingTag) {
            const createdTag = await ctx.prisma.tag.create({
              data: {
                name: tag,
                slug: slugify(tag, slugSetting),
                articlesCount: 1,
              },
            });

            return createdTag;
          }

          await ctx.prisma.tag.update({
            where: {
              name: tag,
            },
            data: {
              articlesCount: {
                increment: 1,
              },
            },
          });

          return existingTag;
        });

        // Wait for all tag operations to complete
        const createdTags = await Promise.all(tagPromises);

        // Create the article with the created tags
        const { series, edit, ...rest } = input;

        const data = {
          data: {
            ...rest,
            tags: {
              connect: createdTags.map((tag) => ({ id: tag.id })),
            },
            // somthing is wront in this section
            ...(series && {
              series: {
                connect: {
                  title: series,
                },
              },
            }),
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            read_time: Math.ceil(readingTime(input.content).minutes) || 1,
            slug: slug,
            seoTitle: input.seoTitle || input.title,
            seoDescription:
              input.seoDescription ||
              input.subtitle ||
              input.content.slice(0, 40),
            seoOgImage: input.seoOgImage || input.cover_image,
          },
          include: {
            user: {
              select: {
                username: true,
                stripeSubscriptionStatus: true,
                followers: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        };

        if (edit) {
          const res = await ctx.prisma.article.update({
            where: {
              slug: slug,
            },
            ...data,
          });
          return {
            success: true,
            redirectLink: `/u/@${ctx.session.user.username}/${res.slug}`,
          };
        } else {
          const newArticle = await ctx.prisma.article.create(data);
          // Notify followers of the user
          await ctx.prisma.notification.createMany({
            data: newArticle.user.followers.map((follower) => ({
              userId: follower.id,
              type: NotificationTypes.NEW_ARTICLE,
              body: `@${ctx.session.user.username} published a new article`,
              title: newArticle.title,
              slug: newArticle.slug,
              articleAuthor: newArticle.user.username,
              isRead: false,
              fromId: ctx.session.user.id,
            })),
          });

          return {
            success: true,
            redirectLink: `/u/@${ctx.session.user.username}/${newArticle.slug}`,
          };
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
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
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username.slice(1, input.username.length),
        },
        select: {
          createdAt: true,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      const activities = await ctx.prisma.article.findMany({
        where: {
          isDeleted: false,
          user: {
            username: input.username.slice(1, input.username.length),
          },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
        },
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
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
    .query(async ({ ctx, input }) => {
      const { query, type } = input;
      let result = null;
      switch (type) {
        case "TAGS":
          const tags = await ctx.prisma.tag.findMany({
            where: {
              OR: [
                { name: { contains: query } },
                { slug: { contains: query } },
                { description: { contains: query } },
              ],
            },
            take: 6,
            select: {
              id: true,
              name: true,
              slug: true,
              followers: {
                select: {
                  id: true,
                },
              },
            },
          });

          const response = tags.map((e) => {
            return searchResponseFormater(
              e,
              null,
              ctx.session?.user?.id as string
            );
          });

          result = {
            users: null,
            tags: response,
            articles: null,
          };
          break;

        case "USERS":
          const users = await ctx.prisma.user.findMany({
            where: {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { username: { contains: query, mode: "insensitive" } },
              ],
            },
            take: 6,
            select: {
              id: true,
              name: true,
              username: true,
              profile: true,
              stripeSubscriptionStatus: true,
              followers: {
                select: {
                  id: true,
                },
              },
            },
          });

          const res = users.map((e) => {
            return searchResponseFormater(
              null,
              e,
              ctx.session?.user?.id as string
            );
          });

          result = {
            users: res,
            tags: null,
            articles: null,
          };
          break;

        default:
          const articles = ctx.prisma.article.findMany({
            where: {
              isDeleted: false,

              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { slug: { contains: query, mode: "insensitive" } },
                {
                  tags: {
                    some: { name: { contains: query, mode: "insensitive" } },
                  },
                },
                {
                  user: {
                    OR: [
                      { username: { contains: query, mode: "insensitive" } },
                      { name: { contains: query, mode: "insensitive" } },
                    ],
                  },
                },
              ],
            },
            take: 6,
            select: {
              id: true,
              title: true,
              user: {
                select: {
                  name: true,
                  username: true,
                  profile: true,
                  id: true,
                  stripeSubscriptionStatus: true,
                },
              },
              cover_image: true,
              slug: true,
              createdAt: true,
              read_time: true,
              updatedAt: true,
              likesCount: true,
              commentsCount: true,
            },
            orderBy: [
              type === "LATEST"
                ? { createdAt: "desc" }
                : { likesCount: "desc" },
            ],
          });

          const tagsSearch = ctx.prisma.tag.findMany({
            where: {
              OR: [
                { name: { contains: query } },
                { slug: { contains: query } },
                { description: { contains: query } },
              ],
            },
            take: 6,
            select: {
              id: true,
              name: true,
              slug: true,
              followers: {
                select: {
                  id: true,
                },
              },
            },
          });

          const usersSearch = ctx.prisma.user.findMany({
            where: {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { username: { contains: query, mode: "insensitive" } },
              ],
            },
            take: 6,
            select: {
              id: true,
              name: true,
              username: true,
              stripeSubscriptionStatus: true,
              profile: true,
              followers: {
                select: {
                  id: true,
                },
              },
            },
          });

          const [articlesRes, tagsRes, usersRes] =
            await ctx.prisma.$transaction([articles, tagsSearch, usersSearch]);

          result = {
            users: usersRes.map((e) => {
              return searchResponseFormater(
                null,
                e,
                ctx.session?.user?.id as string
              );
            }),
            tags: tagsRes.map((e) => {
              return searchResponseFormater(
                e,
                null,
                ctx.session?.user?.id as string
              );
            }),
            articles: articlesRes,
          };
      }

      return result;
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
        const articles = await ctx.prisma.article.findMany({
          where: {
            isDeleted: false,
            ...(input?.variant === "any"
              ? {}
              : {
                  createdAt: {
                    gte: startDate,
                    lte: endDate,
                  },
                }),
          },
          take: (limit || 6) + 1,
          skip: skip,
          cursor: cursor ? { id: cursor } : undefined,
          select: selectArticleCard,
          orderBy: [
            { likesCount: "desc" },
            { commentsCount: "desc" },
            { createdAt: "desc" },
          ],
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (articles.length > limit) {
          const nextItem = articles.pop(); // return the last item from the array
          nextCursor = nextItem?.id;
        }

        const formattedPosts = await getArticlesWithUserFollowingProfiles(
          {
            session: ctx.session,
            prisma: ctx.prisma,
          },
          articles
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

        const articles = await ctx.prisma.article.findMany({
          where: {
            isDeleted: false,

            user: {
              followers: {
                some: {
                  id: ctx.session.user.id,
                },
              },
            },
            ...(input?.variant === "any"
              ? {}
              : {
                  createdAt: {
                    gte: startDate,
                    lte: endDate,
                  },
                }),
          },

          take: (limit || 6) + 1,
          skip: skip,
          cursor: cursor ? { id: cursor } : undefined,
          select: selectArticleCard,
          orderBy: [
            { likesCount: "desc" },
            { commentsCount: "desc" },
            { createdAt: "desc" },
          ],
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (articles.length > limit) {
          const nextItem = articles.pop(); // return the last item from the array
          nextCursor = nextItem?.id;
        }

        const formattedPosts = await getArticlesWithUserFollowingProfiles(
          {
            session: ctx.session,
            prisma: ctx.prisma,
          },
          articles
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

        const articles = await ctx.prisma.article.findMany({
          where: {
            isDeleted: false,
            user: {
              username: input.username,
            },
            ...(input.type === "DELETED" && {
              isDeleted: true,
            }),
            ...(input.type === "PUBLISHED" && {
              isDeleted: false,
            }),
          },
          take: (limit || 6) + 1,
          skip: skip,
          cursor: cursor ? { id: cursor } : undefined,
          select: {
            id: true,
            title: true,
            slug: true,
            createdAt: true,
            read_time: true,
            user: {
              select: {
                profile: true,
                username: true,
              },
            },
            subtitle: true,
            cover_image: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (articles.length > limit) {
          const nextItem = articles.pop(); // return the last item from the array
          nextCursor = nextItem?.id;
        }

        return {
          posts: articles,
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
        const article = await ctx.prisma.article.delete({
          where: {
            slug: input.slug,
            userId: ctx.session.user.id,
          },
          select: {
            id: true,
            user: {
              select: {
                id: true,
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

        const articles = await ctx.prisma.article.findMany({
          where: {
            isDeleted: false,

            user: {
              handle: {
                handle: input.handle,
              },
            },
          },
          select: {
            id: true,
            title: true,
            slug: true,
            createdAt: true,
            content: true,
            read_time: true,
            user: {
              select: {
                profile: true,
                username: true,
              },
            },
            subtitle: true,
            cover_image: true,
          },

          take: (limit || 6) + 1,
          skip: skip,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            createdAt: "desc",
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (articles.length > limit) {
          const nextItem = articles.pop(); // return the last item from the array
          nextCursor = nextItem?.id;
        }

        return {
          posts: articles,
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
        const article = await ctx.prisma.article.findFirst({
          where: {
            slug: input.slug,
          },
          select: {
            id: true,
            user: {
              select: {
                id: true,
              },
            },
            readers: {
              select: {
                id: true,
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

        if (ctx.session?.user?.id === article.user.id) {
          return;
        }

        const hasRead = article.readers.some(
          (reader) => reader.id === ctx.session?.user?.id
        );

        if (!hasRead) {
          await ctx.prisma.article.update({
            where: {
              id: article.id,
            },
            data: {
              readers: {
                ...(hasRead
                  ? undefined
                  : {
                      connect: {
                        id: ctx.session?.user?.id,
                      },
                    }),
              },
              readCount: {
                ...(hasRead
                  ? undefined
                  : {
                      increment: 1,
                    }),
              },
            },
          });
        }

        return {
          success: true,
        };
      } catch (err) {}
    }),

  deleteTemporarily: protectedProcedure
    .input(
      z.object({
        slug: z.string().trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const article = await ctx.prisma.article.findFirst({
          where: {
            slug: input.slug,
          },
          select: {
            id: true,
            isDeleted: true,
            user: {
              select: {
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

        if (ctx.session?.user?.id === article.user.id) {
          await ctx.prisma.article.update({
            where: {
              id: article.id,
            },
            data: {
              isDeleted: true,
            },
          });
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
        const article = await ctx.prisma.article.findFirst({
          where: {
            slug: input.slug,
          },
          select: {
            id: true,
            isDeleted: true,
            user: {
              select: {
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

        if (ctx.session?.user?.id === article.user.id) {
          await ctx.prisma.article.update({
            where: {
              id: article.id,
            },
            data: {
              isDeleted: false,
            },
          });
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
