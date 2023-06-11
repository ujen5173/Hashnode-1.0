import { string, z } from "zod";

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

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.article.findMany({
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
      return await ctx.prisma.article.findUnique({
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
            read_time: readingTime(input.content).text,
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
          message: "Create new post successfully",
          status: 201,
          newArticleLink: `/u/@${ctx.session.user.username}/${newArticle.slug}`,
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
