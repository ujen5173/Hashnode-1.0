import { and, eq } from "drizzle-orm";
import type { GetServerSideProps, NextPage } from "next";
import React, { createContext } from "react";
import { ArticleBody, ArticleHeader, Footer } from "~/component";
import MetaTags from "~/component/MetaTags";
import { db } from "~/server/db";
import { articles } from "~/server/db/schema";
import { type Article } from "~/types";
import { api } from "~/utils/api";

interface Props {
  article: {
    id: string,
    title: string,
    subtitle: string | null,
    slug: string,
    cover_image: string,
    disabledComments: boolean,
    readCount: number,
    likesCount: number,
    commentsCount: number,
    createdAt: string,
    content: string,
    seriesId: string | null,
    read_time: number
    user: {
      username: string,
      bio: string | null,
      id: string;
      image: string,
      name: string,
    },
  };
}

export const FollowContext = createContext<{
  following: boolean;
  setFollowing: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  following: false,
  setFollowing: () => {
    // do nothing
  },
});

const SingleArticle: NextPage<Props> = ({ article }) => {
  const [following, setFollowing] = React.useState(false);

  const { data: tagsData, isLoading: isTagsLoading } = api.tags.getMultiple.useQuery(
    {
      article: article.id,
    },
    {
      enabled: !!article.id,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <>
      <MetaTags
        title={article.title}
        description={article.subtitle ?? article.title}
      />
      <FollowContext.Provider value={{ following, setFollowing }}>
        <ArticleHeader
          user={
            article.user
          }
        />
        <ArticleBody
          article={article}
          user={
            article.user
          }
          tagsData={tagsData}
          tagsLoading={isTagsLoading}
        />
      </FollowContext.Provider>
      <Footer />
    </>
  );
};

export default SingleArticle;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params as {
    username: string;
    slug: string;
  };

  try {
    const article = await db.query.articles.findFirst({
      columns: {
        id: true,
        title: true,
        subtitle: true,
        slug: true,
        cover_image: true,
        disabledComments: true,
        readCount: true,
        likesCount: true,
        commentsCount: true,
        createdAt: true,
        content: true,
        seriesId: true,
        read_time: true,
      },
      with: {
        user: {
          columns: {
            username: true,
            bio: true,
            id: true,
            image: true,
            name: true,
          },
        },
      },
      where: and(eq(articles.isDeleted, false), eq(articles.slug, params.slug)),
    });

    if (!article) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        article: JSON.parse(JSON.stringify(article)) as Article & {
          isFollowing: boolean;
        },
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
