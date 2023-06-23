import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import slugify from "slugify";
import readingTime from "reading-time";
import { TRPCError } from "@trpc/server";
import {
  type Activity,
  refactorActivityHelper,
} from "./../../../utils/microFunctions";
import { v4 as uuid } from "uuid";
import { Article, Prisma } from "@prisma/client";

interface CommentWithChildren extends Comment {
  level: number;
  user: {
    id: string;
    name: string;
    profile: string;
    username: string;
  };
  likes: { id: string }[];
  children: CommentWithChildren[];
}
export const postsRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return `Greetings Developer`;
  }),

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
            .enum(["personalized", "following", "featured"])
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
                      },
                    },
                  },
                }),
            }),
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
          take: 15,
        });

        return data;
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
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.article.findMany({
        where: {
          tags: {
            some: {
              name: input.name,
            },
          },
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
        take: 15,
      });
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
      return await ctx.prisma.article.findMany({
        where: {
          id: {
            in: input.ids.map((id) => id.id),
          },
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
        take: 15,
      });
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
        });

        return {
          success: true,
          redirectLink: `/u/@${ctx.session.user.username}/${newArticle.slug}`,
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  likeArticle: protectedProcedure
    .input(
      z.object({
        articleId: z.string().trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { articleId } = input;

        const article = await ctx.prisma.article.findUnique({
          where: {
            id: articleId,
          },
          select: {
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

        const hasLiked = article.likes.some(
          (like) => like.id === ctx.session.user.id
        );

        const newArticle = (await ctx.prisma.article.update({
          where: {
            id: articleId,
          },
          data: {
            likes: {
              [hasLiked ? "disconnect" : "connect"]: {
                id: ctx.session.user.id,
              },
            },
            likesCount: {
              [hasLiked ? "decrement" : "increment"]: 1,
            },
          },
          select: {
            likes: {
              select: { id: true },
            },
            likesCount: true,
          },
        })) as {
          likes: { id: string }[];
          likesCount: number;
        };

        return {
          success: true,
          message: hasLiked ? "Unliked article" : "Liked article",
          hasLiked: !hasLiked,
          likesCount: newArticle.likesCount,
        };
      } catch (error) {
        console.log(error);
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

  newComment: protectedProcedure
    .input(
      z.object({
        articleId: z.string().trim(),
        content: z.string().trim(),
        type: z.enum(["COMMENT", "REPLY"]),
        commentId: z.string().trim().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { articleId, commentId } = input;

      const article = await ctx.prisma.article.findUnique({
        where: {
          id: articleId,
        },
        select: {
          id: true,
          comments: {
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

      const parentComment =
        commentId &&
        (await ctx.prisma.comment.findUnique({
          where: {
            id: commentId,
          },
          select: {
            id: true,
          },
        }));

      if (commentId && !parentComment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      await ctx.prisma.comment.create({
        data: {
          body: input.content,
          type: input.type,
          article: {
            connect: {
              id: articleId,
            },
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          ...(input.type === "REPLY" &&
            commentId && {
              parent: {
                connect: {
                  id: commentId,
                },
              },
            }),
        },
      });
      return {
        success: true,
        message: "Commented successfully",
      };
    }),

  likeComment: protectedProcedure
    .input(
      z.object({
        commentId: z.string().trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { commentId } = input;

        const comment = (await ctx.prisma.comment.findUnique({
          where: {
            id: commentId,
          },
          select: {
            likes: {
              select: {
                id: true,
              },
            },
          },
        })) as { likes: { id: string }[] };

        if (!comment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Comment not found",
          });
        }

        const hasLiked = comment.likes.some(
          (like) => like.id === ctx.session.user.id
        );

        const newComment = (await ctx.prisma.comment.update({
          where: {
            id: commentId,
          },
          data: {
            likes: {
              [hasLiked ? "disconnect" : "connect"]: {
                id: ctx.session.user.id,
              },
            },
            likesCount: {
              [hasLiked ? "decrement" : "increment"]: 1,
            },
          },
          select: {
            likes: {
              select: { id: true },
            },
            likesCount: true,
          },
        })) as {
          likes: { id: string }[];
          likesCount: number;
        };

        return {
          success: true,
          message: hasLiked ? "Unliked comment" : "Liked comment",
          hasLiked: !hasLiked,
          likesCount: newComment.likesCount,
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  getComments: publicProcedure
    .input(
      z.object({
        articleId: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      const articleId = input.articleId; // Assuming you have the articleId value

      const comments = await ctx.prisma.comment.findMany({
        where: {
          articleId,
          parent: null,
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
          likes: {
            select: {
              id: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  profile: true,
                },
              },
              likes: {
                select: {
                  id: true,
                },
              },
              replies: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      username: true,
                      profile: true,
                    },
                  },
                  likes: {
                    select: {
                      id: true,
                    },
                  },
                  replies: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          name: true,
                          username: true,
                          profile: true,
                        },
                      },
                      likes: {
                        select: {
                          id: true,
                        },
                      },
                      replies: {
                        include: {
                          user: {
                            select: {
                              id: true,
                              name: true,
                              username: true,
                              profile: true,
                            },
                          },
                          likes: {
                            select: {
                              id: true,
                            },
                          },
                          replies: {
                            include: {
                              user: {
                                select: {
                                  id: true,
                                  name: true,
                                  username: true,
                                  profile: true,
                                },
                              },
                              likes: {
                                select: {
                                  id: true,
                                },
                              },
                              replies: {
                                include: {
                                  user: {
                                    select: {
                                      id: true,
                                      name: true,
                                      username: true,
                                      profile: true,
                                    },
                                  },
                                  likes: {
                                    select: {
                                      id: true,
                                    },
                                  },
                                  replies: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return comments;
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
      console.log({ query, type });
      let result = null;
      switch (type) {
        case "TAGS":
          console.log("Tags code is running...");
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
              followersCount: true,
              articlesCount: true,
            },
          });

          result = {
            users: null,
            tags,
            articles: null,
          };
          break;
        case "USERS":
          console.log("Users code is running...");
          const users = await ctx.prisma.user.findMany({
            where: {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { username: { contains: query, mode: "insensitive" } },
                // { bio: { contains: query, mode: "insensitive" } },
              ],
            },
            take: 6,
            select: {
              id: true,
              name: true,
              username: true,
              profile: true,
              followersCount: true,
            },
          });

          result = {
            users,
            tags: null,
            articles: null,
          };
          break;

        default:
          console.log("Default code is running...");
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
});
