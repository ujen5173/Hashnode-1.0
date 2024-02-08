// ACCEPTED PARAMS: article/new | article/edit/[articleId]

import { and, eq } from "drizzle-orm";
import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import { useState } from "react";
import { NewArticleBody, NewArticleHeader } from "~/component";
import MetaTags from "~/component/MetaTags";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";
import { articles } from "~/server/db/schema";
import { type ArticleForEdit } from "~/types";

const NewArticle: NextPage<{ article: ArticleForEdit }> = ({ article }) => {
  const [publishModal, setPublishModal] = useState<boolean>(false);

  const [publishing, setPublishing] = useState<boolean>(false); // upload loading

  return (
    <>
      <MetaTags title="Publish New / Edit Article" />

      <NewArticleHeader
        setPublishModal={setPublishModal}
        publishing={publishing}
      />
      <NewArticleBody
        publishModal={publishModal}
        setPublishModal={setPublishModal}
        publishing={publishing}
        setPublishing={setPublishing}
        article={article}
      />
    </>
  );
};

export default NewArticle;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user) {
    return { props: { session: null }, redirect: { destination: "/onboard" } };
  }

  if (!session?.user.handle) {
    return {
      props: { session: null },
      redirect: { destination: "/onboard/blog/setup" },
    };
  }

  const [requestType, slug] = context.query.params as
    | ["new"]
    | ["edit", string];
  let article: ArticleForEdit | undefined = undefined;

  if (requestType === "edit" && slug) {
    article = await db.query.articles
      .findFirst({
        where: and(
          eq(articles.slug, slug),
          eq(articles.isDeleted, false),
          eq(articles.userId, session.user.id),
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
          seoOgImageKey: true,
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
      })
      .then((article) => {
        if (!article) return undefined;
        return {
          ...article,
          tags: article.tags.map((e) => e.tag.name),
          series: article.series?.title ?? null,
          seoTitle: article.seoTitle ?? "",
          seoDescription: article.seoDescription ?? "",
        };
      });
  }

  if (requestType === "edit" && !article) {
    return { notFound: true };
  }

  return {
    props: {
      article: article
        ? (JSON.parse(JSON.stringify(article)) as ArticleForEdit)
        : null,
    },
  };
};
