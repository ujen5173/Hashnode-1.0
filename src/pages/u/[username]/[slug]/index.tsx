import { and, eq } from "drizzle-orm";
import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import React, { createContext } from "react";
import { ArticleBody, ArticleHeader, Footer } from "~/component";
import MetaTags from "~/component/MetaTags";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";
import { articles, follow } from "~/server/db/schema";
import { type Article } from "~/types";

interface Props {
  article: Article & {
    isFollowing: boolean;
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
  const [following, setFollowing] = React.useState(article.isFollowing);

  return (
    <>
      <MetaTags
        title={article.title}
        description={article.subtitle ?? article.title}
      />
      <FollowContext.Provider value={{ following, setFollowing }}>
        <ArticleHeader user={article.user} />
        <ArticleBody article={article} />
      </FollowContext.Provider>
      <Footer />
    </>
  );
};

export default SingleArticle;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const params = context.params as {
    username: string;
    slug: string;
  };
  try {
    const article = await db.query.articles
      .findFirst({
        with: {
          user: {
            with: {
              followers: {
                where: eq(follow.followingId, session?.user?.id ?? ""),
                columns: {
                  userId: true,
                },
              },
            },
          },
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
          eq(articles.slug, params.slug),
        ),
      })
      .then((res) => ({ ...res, tags: res?.tags.map((e) => e.tag) }));

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
