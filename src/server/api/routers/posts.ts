import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import slugify from "slugify";
import readingTime from "reading-time";
import { TRPCError } from "@trpc/server";

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
        console.log({ filter: input?.filter });
        const data = await ctx.prisma.article.findMany({
          where: {
            read_time:
              input?.filter?.read_time === "over_5"
                ? { gt: 5 }
                : input?.filter?.read_time === "under_5"
                ? { lt: 5 }
                : input?.filter?.read_time === "5"
                ? { equals: 5 }
                : undefined,

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
        console.log(err);
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
        title: z.string().min(5).trim(),
        subtitle: z.string().trim().optional(),
        content: z.string().min(25).trim(),
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
              name: tag,
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

        const newArticle = await ctx.prisma.article.update({
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
        });

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
});
