import { string, z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import slugify from "slugify";
import readingTime from "reading-time";

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

  getMany: publicProcedure
    .input(
      z.object({
        ids: z
          .array(z.object({ id: z.string().trim() }))
          .optional()
          .default([]),
      })
    )
    .query(async ({ ctx }) => {
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

        const newArticle = await ctx.prisma.article.create({
          data: {
            ...input,
            tags: {
              connectOrCreate: tags.map((tag) => ({
                where: {
                  name: tag,
                },
                create: {
                  name: tag,
                  slug: slugify(tag, {
                    lower: true,
                    strict: true,
                    trim: true,
                    locale: "vi",
                  }),
                },
              })),
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
        throw new Error("Somethign went wrong");
      }
    }),
});
