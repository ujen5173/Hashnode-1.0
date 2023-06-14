import type { GetServerSideProps, NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect } from "react";
import { ArticleBody, ArticleHeader, Footer } from "~/components";
import ArticleSEO from "~/SEO/Article.seo";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import type { ArticleCard } from "~/types";
import { C, type ContextValue } from "~/utils/context";

interface Props {
  article: ArticleCard & {
    isFollowing: boolean;
    user: {
      followersCount: number;
    };
  };
}

const SingleArticle: NextPage<Props> = ({ article }) => {
  const { data: session } = useSession();
  const { setUser, setFollowing } = useContext(C) as ContextValue;

  useEffect(() => {
    setUser(session);
    setFollowing({
      status: article.isFollowing,
      followersCount: article.user.followersCount.toString(),
    });
  }, []);

  return (
    <>
      <ArticleSEO article={article} />
      <ArticleHeader user={article.user} />
      <ArticleBody article={article} />
      <Footer />
    </>
  );
};

export default SingleArticle;

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("Server rendered...");
  const session = getServerSession(context.req, context.res, authOptions);

  const article = prisma.article.findUnique({
    where: {
      slug: context.params?.slug as string,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          bio: true,
          profile: true,
          followersCount: true,
          followers: {
            select: {
              id: true,
            },
          },
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      likes: {
        select: {
          id: true,
        },
      },
      comments: {
        select: {
          id: true,
        },
      },
    },
  });

  const [sessionData, articleData] = await Promise.all([session, article]);

  if (!articleData) {
    return {
      props: {
        session: sessionData
          ? (JSON.parse(JSON.stringify(sessionData)) as Session)
          : null,
        article: null,
      },
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let isFollowing = false;
  if (sessionData) {
    isFollowing = articleData.user.followers.some(
      (follower) => follower.id === sessionData?.user.id
    );
  }

  return {
    props: {
      session: sessionData
        ? (JSON.parse(JSON.stringify(sessionData)) as Session)
        : null,
      article: articleData
        ? (JSON.parse(
            JSON.stringify({ ...articleData, isFollowing })
          ) as ArticleCard & {
            isFollowing: boolean;
          })
        : null,
    },
  };
};
