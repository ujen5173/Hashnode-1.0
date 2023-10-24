import { TRPCError } from "@trpc/server";
import { and, desc, eq, gt, ilike, inArray, lt } from "drizzle-orm";
import readingTime from "reading-time";
import slugify from "slugify";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  articles,
  customTabs,
  handles,
  readersToArticles,
  series,
  tags,
  tagsToArticles,
  tagsToUsers,
  users,
} from "~/server/db/schema";
import { slugSetting } from "~/utils/constants";
import {
  refactorActivityHelper,
  type Activity,
} from "./../../../utils/microFunctions";
// import type { ArticleCardWithComments } from "~/types";

// const getArticlesWithUserFollowingProfiles = async (
//   ctx: {
//     session: Session | null;
//     db: NeonHttpDatabase<typeof schemaFile>;
//   },
//   articles: ArticleCardWithComments[]
// ) => {
//   // If user is logged in, get the user's following profiles else return empty array for commenUsers
//   // Retrieve user following outside the loop
//   // const userFollowing = ctx.session?.user
//   //   ? await ctx.prisma.user.findUnique({
//   //       where: {
//   //         id: ctx.session.user.id,
//   //       },
//   //       select: {
//   //         following: {
//   //           select: {
//   //             id: true,
//   //           },
//   //         },
//   //       },
//   //     })
//   //   : null;
//   const userFollowing = ctx.session?.user
//     ? await ctx.db.query.users.findFirst({
//         where: eq(users.id, ctx.session.user.id),
//       })
//     : null;

//   // Combine the mapping logic into a single loop
//   const updatedArticles = articles.map((article) => {
//     const { comments, ...rest } = article;
//     let followingComments: {
//       id: string;
//       profile: string;
//     }[] = [];

//     if (userFollowing) {
//       followingComments = displayUniqueObjects(
//         comments
//           .map((c) => c.user)
//           .filter((user) =>
//             userFollowing.following.some((f) => f.id === user.id)
//           )
//       );
//     }

//     return { ...rest, commonUsers: followingComments };
//   });

//   // Handle the case when ctx.session.user is not present
//   if (!ctx.session?.user) {
//     updatedArticles.forEach((article) => {
//       article.commonUsers = [];
//     });
//   }

//   return updatedArticles;
// };

// const searchResponseFormater = (
//   tags: {
//     id: string;
//     name: string;
//     slug: string;
//     followers: {
//       id: string;
//     }[];
//   } | null,
//   users: {
//     id: string;
//     name: string;
//     username: string;
//     profile: string;
//     stripeSubscriptionStatus: string | null;
//     followers: {
//       id: string;
//     }[];
//   } | null,
//   userId: string
// ) => {
//   const res = tags || users;
//   if (!res) return;
//   const { followers, ...rest } = res;
//   let isFollowing = false;
//   if (userId) {
//     isFollowing = followers.some((follower) => follower.id === userId);
//   }
//   return {
//     ...rest,
//     isFollowing,
//   };
// };

export const postsRouter = createTRPCRouter({
  deleteAll: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.db.delete(customTabs);
    await ctx.db.delete(series);
    await ctx.db.delete(tagsToUsers);
    await ctx.db.delete(handles);
    await ctx.db.delete(tagsToArticles);
    await ctx.db.delete(tags);
    await ctx.db.delete(articles);
    await ctx.db.delete(users);
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
            columns: {
              id: true,
              title: true,
              slug: true,
              cover_image: true,
              disabledComments: true,
              readCount: true,
              content: true,
              read_time: true,
              likesCount: true,
              commentsCount: true,
              createdAt: true,
            },
            with: {
              likes: {
                columns: {
                  userId: true,
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
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
              user: {
                with: {
                  handle: {
                    columns: {
                      id: true,
                      name: true,
                      handle: true,
                      about: true,
                    },
                  },
                },
                columns: {
                  id: true,
                  name: true,
                  username: true,
                  profile: true,
                  bio: true,
                  stripeSubscriptionStatus: true,
                },
              },
              series: {
                columns: {
                  title: true,
                  slug: true,
                },
              },
              comments: {
                with: {
                  user: {
                    columns: {
                      id: true,
                      profile: true,
                    },
                  },
                },
              },
            },
          })
          .then((article) =>
            article.map((ele) => ({ ...ele, tags: ele.tags.map((e) => e.tag) }))
          );

        console.log(result);

        let nextCursor: typeof cursor | undefined = undefined;
        if (result.length > limit) {
          const nextItem = result.pop(); // return the last item from the array
          nextCursor = nextItem?.id;
        }

        // const formattedPosts = await getArticlesWithUserFollowingProfiles(
        //   {
        //     session: ctx.session,
        //     db: ctx.db,
        //   },
        //   result
        // );
        // console.log({ formattedPosts });
        return {
          // posts: formattedPosts,
          posts: result,
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

      // const articles = await ctx.prisma.article.findMany({
      //   where: {
      //     isDeleted: false,
      //     ...((input?.filter?.tags || input?.filter?.read_time) && {
      //       ...(input?.filter?.read_time && {
      //         read_time:
      //           input?.filter?.read_time === "over_5"
      //             ? { gt: 5 }
      //             : input?.filter?.read_time === "under_5"
      //             ? { lt: 5 }
      //             : input?.filter?.read_time === "5"
      //             ? { equals: 5 }
      //             : undefined,
      //       }),
      //       ...(input?.filter?.tags &&
      //         input.filter.tags.length > 0 && {
      //           tags: {
      //             some: {
      //               name: {
      //                 in: input?.filter?.tags
      //                   ? input?.filter?.tags.length > 0
      //                     ? input?.filter?.tags.map((tag) => tag.name)
      //                     : undefined
      //                   : undefined,
      //                 mode: "insensitive",
      //               },
      //             },
      //           },
      //         }),
      //     }),
      //     tags: {
      //       some: {
      //         name: input.name,
      //       },
      //     },
      //   },
      //   select: selectArticleCard,
      //   take: (limit || 6) + 1,
      //   skip: skip,
      //   cursor: cursor ? { id: cursor } : undefined,
      //   orderBy:
      //     input.type === "hot"
      //       ? [
      //           {
      //             likesCount: "desc",
      //           },
      //           {
      //             commentsCount: "desc",
      //           },
      //         ]
      //       : input.type === "new"
      //       ? {
      //           createdAt: "desc",
      //         }
      //       : undefined,
      // });
      const result = await ctx.db.query.articles.findMany({
        limit: (limit || 6) + 1,
        offset: skip,
        orderBy:
          input.type === "hot"
            ? [desc(articles.likesCount), desc(articles.commentsCount)]
            : [desc(articles.createdAt)],
        columns: {
          id: true,
          title: true,
          slug: true,
          cover_image: true,
          disabledComments: true,
          readCount: true,
          content: true,
          read_time: true,
          likesCount: true,
          commentsCount: true,
          createdAt: true,
        },
        with: {
          likes: {
            columns: {
              userId: true,
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
          user: true,
          series: {
            columns: {
              title: true,
              slug: true,
            },
          },
          comments: {
            with: {
              user: {
                columns: {
                  id: true,
                  profile: true,
                },
              },
            },
          },
        },
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
          // ...(input?.filter?.read_time && {
          //   read_time:
          //     input?.filter?.read_time === "over_5"
          //       ? { gt: 5 }
          //       : input?.filter?.read_time === "under_5"
          //       ? { lt: 5 }
          //       : input?.filter?.read_time === "5"
          //       ? { equals: 5 }
          //       : undefined,
          // }),
        ),
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (result.length > limit) {
        const nextItem = result.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }

      // const formattedPosts = await getArticlesWithUserFollowingProfiles(
      //   {
      //     session: ctx.session,
      //     prisma: ctx.prisma,
      //   },
      //   articles
      // );

      return {
        // posts: formattedPosts,
        posts: result,
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
    .query(({ ctx, input }) => {
      return [];
      // return await getArticlesWithUserFollowingProfiles(
      //   {
      //     session: ctx.session,
      //     prisma: ctx.prisma,
      //   },
      //   await ctx.prisma.article.findMany({
      //     where: {
      //       isDeleted: false,
      //       id: {
      //         in: input.ids.map((id) => id.id),
      //       },
      //     },
      //     select: selectArticleCard,
      //     take: 15,
      //   })
      // );
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
        // const res = await ctx.prisma.article.findMany({
        //   where: {
        //     isDeleted: false,
        //     id: {
        //       in: input.ids.map((id) => id.id),
        //     },
        //   },
        //   select: {
        //     id: true,
        //     read_time: true,
        //     title: true,
        //     slug: true,
        //     user: {
        //       select: {
        //         name: true,
        //         stripeSubscriptionStatus: true,
        //         username: true,
        //       },
        //     },
        //   },
        //   take: 4,
        // });
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
        // const article = await ctx.prisma.article.findFirst({
        //   where: {
        //     isDeleted: false,
        //     slug: input.slug,
        //   },
        //   include: {
        //     series: {
        //       select: {
        //         title: true,
        //         slug: true,
        //       },
        //     },
        //     user: {
        //       select: {
        //         id: true,
        //         name: true,
        //         username: true,
        //         bio: true,
        //         profile: true,
        //         stripeSubscriptionStatus: true,
        //         handle: {
        //           select: {
        //             handle: true,
        //             name: true,
        //             about: true,
        //             id: true,
        //           },
        //         },

        //         followers: {
        //           select: {
        //             id: true,
        //           },
        //         },
        //       },
        //     },
        //     tags: {
        //       select: {
        //         id: true,
        //         name: true,
        //         slug: true,
        //       },
        //     },
        //     likes: {
        //       select: {
        //         id: true,
        //       },
        //     },
        //   },
        // });

        const article = await ctx.db.query.articles.findFirst({
          with: {
            user: true,
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

        // const { followers, ...rest } = article.user;
        // if (ctx.session?.user) {
        //   const isFollowing = article.user.followers.some(
        //     (follower) => follower.id === ctx.session?.user.id
        //   );

        //   return {
        //     ...article,
        //     // isFollowing,
        //     user: rest,
        //   };
        // } else {
        //   return {
        //     ...article,
        //     // isFollowing: false,
        //     user: rest,
        //   };
        // }
        return {
          ...article,
          // isFollowing: false,
          user: article.user,
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

  getArticleToEdit: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // const article = await ctx.prisma.article.findFirst({
        //   where: {
        //     slug: input.slug,
        //     isDeleted: false,
        //   },
        //   select: {
        //     title: true,
        //     subtitle: true,
        //     content: true,
        //     cover_image: true,
        //     cover_image_Key: true,
        //     slug: true,
        //     seoTitle: true,
        //     disabledComments: true,
        //     seoDescription: true,
        //     seoOgImage: true,
        //     userId: true,
        //     seoOgImageKey: true,
        //     series: {
        //       select: {
        //         id: true,
        //         title: true,
        //       },
        //     },
        //     tags: {
        //       select: {
        //         name: true,
        //       },
        //     },
        //   },
        // });

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

        console.log({ existingArticle });
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

        console.log({ allTags, edit });
        if (edit && !!existingArticle) {
          // editing an article
          console.log("Inside editing condition");
          console.log({
            result: {
              ...rest,
              read_time: Math.ceil(readingTime(input.content).minutes) || 1,
              seoTitle: input.seoTitle || input.title,
              seoDescription:
                input.seoDescription ||
                input.subtitle ||
                input.content.slice(0, 40),
              seoOgImage: input.seoOgImage || input.cover_image,
            },
          });
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

          console.log({ updatedArticle });
          console.log({
            res: allTags.map((tag) => ({
              articleId: updatedArticle?.id as string,
              tagId: tag.id,
            })),
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

          console.log("TagsTOArticles completed!!!");

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
      // const user = await ctx.prisma.user.findUnique({
      //   where: {
      //     username: input.username.slice(1, input.username.length),
      //   },
      //   select: {
      //     createdAt: true,
      //   },
      // });

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
      // const activities = await ctx.prisma.article.findMany({
      //   where: {
      //     isDeleted: false,
      //     user: {
      //       username: input.username.slice(1, input.username.length),
      //     },
      //   },
      //   select: {
      //     id: true,
      //     title: true,
      //     slug: true,
      //     createdAt: true,
      //   },
      //   take: 10,
      //   orderBy: {
      //     createdAt: "desc",
      //   },
      // });
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
    .query(({ ctx, input }) => {
      return [];
      // try {
      //   const { cursor, skip, limit } = input;
      //   const startDate = new Date();
      //   const endDate = new Date();

      //   if (input?.variant === "week") {
      //     startDate.setDate(startDate.getDate() - 7);
      //   } else if (input?.variant === "month") {
      //     startDate.setMonth(startDate.getMonth() - 1);
      //   } else if (input?.variant === "year") {
      //     startDate.setFullYear(startDate.getFullYear() - 1);
      //   }
      //   const articles = await ctx.prisma.article.findMany({
      //     where: {
      //       isDeleted: false,
      //       ...(input?.variant === "any"
      //         ? {}
      //         : {
      //             createdAt: {
      //               gte: startDate,
      //               lte: endDate,
      //             },
      //           }),
      //     },
      //     take: (limit || 6) + 1,
      //     skip: skip,
      //     cursor: cursor ? { id: cursor } : undefined,
      //     select: selectArticleCard,
      //     orderBy: [
      //       { likesCount: "desc" },
      //       { commentsCount: "desc" },
      //       { createdAt: "desc" },
      //     ],
      //   });

      //   let nextCursor: typeof cursor | undefined = undefined;
      //   if (articles.length > limit) {
      //     const nextItem = articles.pop(); // return the last item from the array
      //     nextCursor = nextItem?.id;
      //   }

      //   const formattedPosts = await getArticlesWithUserFollowingProfiles(
      //     {
      //       session: ctx.session,
      //       prisma: ctx.prisma,
      //     },
      //     articles
      //   );

      //   return {
      //     posts: formattedPosts,
      //     nextCursor,
      //   };
      // } catch (err) {
      //   throw new TRPCError({
      //     code: "INTERNAL_SERVER_ERROR",
      //     message: "Something went wrong, try again later",
      //   });
      // }
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
    .query(({ ctx, input }) => {
      return [];
      // try {
      //   const { cursor, skip, limit } = input;

      //   const startDate = new Date();
      //   const endDate = new Date();

      //   if (input?.variant === "week") {
      //     startDate.setDate(startDate.getDate() - 7);
      //   } else if (input?.variant === "month") {
      //     startDate.setMonth(startDate.getMonth() - 1);
      //   } else if (input?.variant === "year") {
      //     startDate.setFullYear(startDate.getFullYear() - 1);
      //   }

      //   const articles = await ctx.prisma.article.findMany({
      //     where: {
      //       isDeleted: false,

      //       user: {
      //         followers: {
      //           some: {
      //             id: ctx.session.user.id,
      //           },
      //         },
      //       },
      //       ...(input?.variant === "any"
      //         ? {}
      //         : {
      //             createdAt: {
      //               gte: startDate,
      //               lte: endDate,
      //             },
      //           }),
      //     },

      //     take: (limit || 6) + 1,
      //     skip: skip,
      //     cursor: cursor ? { id: cursor } : undefined,
      //     select: selectArticleCard,
      //     orderBy: [
      //       { likesCount: "desc" },
      //       { commentsCount: "desc" },
      //       { createdAt: "desc" },
      //     ],
      //   });

      //   let nextCursor: typeof cursor | undefined = undefined;
      //   if (articles.length > limit) {
      //     const nextItem = articles.pop(); // return the last item from the array
      //     nextCursor = nextItem?.id;
      //   }

      //   const formattedPosts = await getArticlesWithUserFollowingProfiles(
      //     {
      //       session: ctx.session,
      //       prisma: ctx.prisma,
      //     },
      //     articles
      //   );

      //   return {
      //     posts: formattedPosts,
      //     nextCursor,
      //   };
      // } catch (err) {
      //   throw new TRPCError({
      //     code: "INTERNAL_SERVER_ERROR",
      //     message: "Something went wrong, try again later",
      //   });
      // }
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
    .query(({ ctx, input }) => {
      return [];
      // try {
      //   if (input.type === "SCHEDULED") {
      //     throw new TRPCError({
      //       code: "BAD_REQUEST",
      //       message: "Scheduled articles are not available for public",
      //     });
      //   }

      //   const { cursor, skip, limit } = input;

      //   const articles = await ctx.prisma.article.findMany({
      //     where: {
      //       isDeleted: false,
      //       user: {
      //         username: input.username,
      //       },
      //       ...(input.type === "DELETED" && {
      //         isDeleted: true,
      //       }),
      //       ...(input.type === "PUBLISHED" && {
      //         isDeleted: false,
      //       }),
      //     },
      //     take: (limit || 6) + 1,
      //     skip: skip,
      //     cursor: cursor ? { id: cursor } : undefined,
      //     select: {
      //       id: true,
      //       title: true,
      //       slug: true,
      //       createdAt: true,
      //       read_time: true,
      //       user: {
      //         select: {
      //           profile: true,
      //           username: true,
      //         },
      //       },
      //       subtitle: true,
      //       cover_image: true,
      //     },
      //     orderBy: {
      //       createdAt: "desc",
      //     },
      //   });

      //   let nextCursor: typeof cursor | undefined = undefined;
      //   if (articles.length > limit) {
      //     const nextItem = articles.pop(); // return the last item from the array
      //     nextCursor = nextItem?.id;
      //   }

      //   return {
      //     posts: articles,
      //     nextCursor,
      //   };
      // } catch (err) {
      //   if (err instanceof TRPCError) {
      //     throw err;
      //   }
      //   throw new TRPCError({
      //     code: "INTERNAL_SERVER_ERROR",
      //     message: "Something went wrong, try again later",
      //   });
      // }
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
        // const article = await ctx.prisma.article.delete({
        //   where: {
        //     slug: input.slug,
        //     userId: ctx.session.user.id,
        //   },
        //   select: {
        //     id: true,
        //     user: {
        //       select: {
        //         id: true,
        //       },
        //     },
        //   },
        // });

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

        // const articles = await ctx.prisma.article.findMany({
        //   where: {
        //     isDeleted: false,

        //     user: {
        //       handle: {
        //         handle: input.handle,
        //       },
        //     },
        //   },
        //   select: {
        //     id: true,
        //     title: true,
        //     slug: true,
        //     createdAt: true,
        //     content: true,
        //     read_time: true,
        //     user: {
        //       select: {
        //         profile: true,
        //         username: true,
        //       },
        //     },
        //     subtitle: true,
        //     cover_image: true,
        //   },

        //   take: (limit || 6) + 1,
        //   skip: skip,
        //   cursor: cursor ? { id: cursor } : undefined,
        //   orderBy: {
        //     createdAt: "desc",
        //   },
        // });

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
        // const article = await ctx.prisma.article.findFirst({
        //   where: {
        //     slug: input.slug,
        //   },
        //   select: {
        //     id: true,
        //     user: {
        //       select: {
        //         id: true,
        //       },
        //     },
        //     readers: {
        //       select: {
        //         id: true,
        //       },
        //     },
        //   },
        // });
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
          // await ctx.prisma.article.update({
          //   where: {
          //     id: article.id,
          //   },
          //   data: {
          //     readers: {
          //       ...(hasRead
          //         ? undefined
          //         : {
          //             connect: {
          //               id: ctx.session?.user?.id,
          //             },
          //           }),
          //     },
          //     readCount: {
          //       ...(hasRead
          //         ? undefined
          //         : {
          //             increment: 1,
          //           }),
          //     },
          //   },
          // });
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
        // const article = await ctx.prisma.article.findFirst({
        //   where: {
        //     slug: input.slug,
        //   },
        //   select: {
        //     id: true,
        //     isDeleted: true,
        //     user: {
        //       select: {
        //         id: true,
        //       },
        //     },
        //   },
        // });
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
          // await ctx.prisma.article.update({
          //   where: {
          //     id: article.id,
          //   },
          //   data: {
          //     isDeleted: true,
          //   },
          // });
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
        // const article = await ctx.prisma.article.findFirst({
        //   where: {
        //     slug: input.slug,
        //   },
        //   select: {
        //     id: true,
        //     isDeleted: true,
        //     user: {
        //       select: {
        //         id: true,
        //       },
        //     },
        //   },
        // });

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
          // await ctx.prisma.article.update({
          //   where: {
          //     id: article.id,
          //   },
          //   data: {
          //     isDeleted: false,
          //   },
          // });
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
