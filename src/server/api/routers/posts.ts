import {
  NotificationTypes,
  type Prisma,
  type PrismaClient,
} from "@prisma/client";
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
  refactorActivityHelper,
  type Activity,
} from "./../../../utils/microFunctions";

const selectArticleCard = {
  id: true,
  title: true,
  slug: true,
  cover_image: true,
  disabledComments: true,
  user: {
    select: {
      id: true,
      name: true,
      username: true,
      profile: true,
    },
  },
  comments: {
    select: {
      user: {
        select: {
          id: true,
          profile: true,
        },
      },
    },
  },
  content: true,
  read_time: true,
  tags: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  likes: { select: { id: true } },
  likesCount: true,
  commentsCount: true,
  createdAt: true,
} as const;

function displayUniqueObjects(objects: Array<{ id: string; profile: string }>) {
  // Create a set to store the unique IDs.
  const uniqueIds = new Set();
  // Create an array to store the unique objects.
  const uniqueObjects = [];

  // Iterate over the objects and add them to the set if they are not already present.
  for (const object of objects) {
    const id = object.id;
    if (!uniqueIds.has(id)) {
      uniqueIds.add(id);
      uniqueObjects.push(object);
    }
  }

  // Return the list of unique objects.
  return uniqueObjects;
}

const getArticlesWithUserFollowingProfiles = async (
  ctx: {
    session: Session | null;
    prisma: PrismaClient<
      Prisma.PrismaClientOptions,
      never,
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >;
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

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          filter: z
            .object({
              read_time: z
                .enum(["over_5", "5", "under_5"])
                .nullable()
                .optional(),
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
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.prisma.article.findMany({
          where: {
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
          take: 15,
          ...(input?.type === "latest"
            ? { orderBy: { createdAt: "desc" } }
            : {}),
        });

        return await getArticlesWithUserFollowingProfiles(
          {
            session: ctx.session,
            prisma: ctx.prisma,
          },
          data
        );
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
        type: z.enum(["hot", "new"]).optional().default("new"),
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
          take: 15,
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
        })
      );
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
      return await ctx.prisma.article.findMany({
        where: {
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
            },
          },
        },
        take: 4,
      });
    }),

  getSingleArticle: publicProcedure
    .input(
      z.object({
        slug: z.string().trim(),
        username: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const article = await ctx.prisma.article.findUnique({
          where: {
            slug: input.slug,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                profile: true,
              },
            },
            tags: {
              select: {
                id: true,
                name: true,
                slug: true,
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

        return article;
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
        title: z
          .string()
          .min(5, "Title should be atleset of 5 characters")
          .trim(),
        subtitle: z.string().trim().optional(),
        content: z
          .string()
          .min(25, "Content should be atleast of 25 characters")
          .trim(),
        tags: z.array(z.string().trim()).optional().default([]),
        seoTitle: z.string().trim().optional().nullable(),
        seoDescription: z.string().trim().optional().nullable(),
        seoOgImage: z.string().trim().optional().nullable(),
        cover_image: z.string().trim().optional().nullable(),
        disabledComments: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { title, tags } = input;
        const slug = slugify(title, {
          lower: true,
          strict: true,
          trim: true,
          locale: "vi",
        });

        // Check if tags exist or create them if necessary
        const tagPromises = tags.map(async (tag) => {
          const existingTag = await ctx.prisma.tag.findFirst({
            where: {
              slug: slugify(tag, {
                lower: true,
                strict: true,
                trim: true,
                locale: "vi",
                replacement: "-",
              }),
            },
          });

          if (!existingTag) {
            const createdTag = await ctx.prisma.tag.create({
              data: {
                name: tag,
                slug: slugify(tag, {
                  lower: true,
                  strict: true,
                  trim: true,
                  locale: "vi",
                  replacement: "-",
                }),
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
        const newArticle = await ctx.prisma.article.create({
          data: {
            ...input,
            tags: {
              connect: createdTags.map((tag) => ({ id: tag.id })),
            },
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            read_time: readingTime(input.content).minutes,
            slug,
            seoTitle: input.seoTitle || title,
            seoDescription:
              input.seoDescription ||
              input.subtitle ||
              input.content.slice(0, 40),
            seoOgImage: input.seoOgImage || input.cover_image,
          },
          include: {
            user: {
              select: {
                followers: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        });

        // Notify followers of the user
        await ctx.prisma.notification.createMany({
          data: newArticle.user.followers.map((follower) => ({
            userId: follower.id,
            type: NotificationTypes.NEW_ARTICLE,
            body: `@${ctx.session.user.username} published a new article`,
            slug: newArticle.slug,
            isRead: false,
            fromId: ctx.session.user.id,
          })),
        });

        return {
          success: true,
          redirectLink: `/u/@${ctx.session.user.username}/${newArticle.slug}`,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
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
            const { followers, ...rest } = e;
            let isFollowing = false;
            if (ctx.session?.user) {
              isFollowing = followers.some(
                (follower) => follower.id === ctx.session?.user?.id
              );
            }
            return {
              ...rest,
              isFollowing,
            };
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
              followers: {
                select: {
                  id: true,
                },
              },
            },
          });

          const res = users.map((e) => {
            const { followers, ...rest } = e;
            let isFollowing = false;
            if (ctx.session?.user) {
              isFollowing = followers.some(
                (follower) => follower.id === ctx.session?.user?.id
              );
            }
            return {
              ...rest,
              isFollowing,
            };
          });

          result = {
            users: res,
            tags: null,
            articles: null,
          };
          break;

        default:
          const articles = await ctx.prisma.article.findMany({
            where: {
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
                select: { name: true, username: true, profile: true, id: true },
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

          result = {
            users: null,
            tags: null,
            articles,
          };
      }

      return result;
    }),

  trendingArticles: publicProcedure
    .input(
      z.object({
        limit: z.number().default(6),
        variant: z.enum(["week", "month", "year", "any"]).default("any"),
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
        const articles = await ctx.prisma.article.findMany({
          ...(input?.variant === "any"
            ? {}
            : {
                where: {
                  createdAt: {
                    gte: startDate,
                    lte: endDate,
                  },
                },
              }),
          take: input?.limit || 6,
          select: selectArticleCard,
          orderBy: [
            { likesCount: "desc" },
            { commentsCount: "desc" },
            { createdAt: "desc" },
          ],
        });

        return await getArticlesWithUserFollowingProfiles(
          {
            session: ctx.session,
            prisma: ctx.prisma,
          },
          articles
        );
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

        const articles = await ctx.prisma.article.findMany({
          where: {
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
          take: input?.limit || 6,
          select: selectArticleCard,
          orderBy: [
            { likesCount: "desc" },
            { commentsCount: "desc" },
            { createdAt: "desc" },
          ],
        });

        return await getArticlesWithUserFollowingProfiles(
          {
            session: ctx.session,
            prisma: ctx.prisma,
          },
          articles
        );
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
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.article.findMany({
          where: {
            user: {
              username: input.username,
            },
          },
          select: {
            id: true,
            title: true,
            slug: true,
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
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),
});
