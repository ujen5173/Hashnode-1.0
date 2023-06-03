import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { posts } from "../types.api";
import slugify from "slugify";
import readingTime from "reading-time";

export const postsRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return `Greetings Developer`;
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.article.findMany({
      select: {
        id: true,
        title: true,
        subtitle: true,
        slug: true,
      },
    });
  }),

  new: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        subtitle: z.string(),
        content: z.string(),
        tags: z.array(z.string()).optional().default([]),
        seoTitle: z.string().optional().nullable(),
        seoDescription: z.string().optional().nullable(),
        seoOgImage: z.string().optional().nullable(),
        cover_image: z.string().optional().nullable(),
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

        // const existingTags = await ctx.prisma.tag.findMany({
        //   select: {
        //     name: true,
        //   },
        // });

        // const nonExistingTags = tags.filter((tag) => {
        //   return !existingTags.find((existingTag) => existingTag.name === tag);
        // });

        // await ctx.prisma.tag.createMany({
        //   data: nonExistingTags.map((tag) => ({
        //     name: tag,
        //     slug: slugify(tag, {
        //       lower: true,
        //       strict: true,
        //       trim: true,
        //       locale: "vi",
        //     }),
        //   })),
        //   skipDuplicates: true,
        // });

        // console.log({
        //   ...input,
        //   userId: ctx.session.user.id,
        //   read_time: readingTime(input.content).text,
        //   slug,
        // });

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
