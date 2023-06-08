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

const SingleArticle: NextPage<{ article: ArticleCard }> = ({ article }) => {
  const { data: session } = useSession();
  const { setUser } = useContext(C) as ContextValue;

  useEffect(() => {
    setUser(session);
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
  const session = (await getServerSession(
    context.req,
    context.res,
    authOptions
  )) as Session;

  const article = await prisma.article.findUnique({
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

  if (!article) {
    return {
      props: {
        session: session
          ? (JSON.parse(JSON.stringify(session)) as Session)
          : null,
        article: null,
      },
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: session
        ? (JSON.parse(JSON.stringify(session)) as Session)
        : null,
      article: article
        ? (JSON.parse(JSON.stringify(article)) as ArticleCard)
        : null,
    },
  };
};
