import type { GetServerSideProps, NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import React, { createContext } from "react";
import ArticleSEO from "~/SEO/Article.seo";
import { ArticleBody, ArticleHeader, Footer } from "~/component";
import { authOptions } from "~/server/auth";
import { generateSSGHelper } from "~/server/ssgHelper";
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
      <ArticleSEO article={article} />
      <FollowContext.Provider value={{ following, setFollowing }} >
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

  const ssg = await generateSSGHelper({ req: context.req, res: context.res });

  const params = context.params as {
    username: string;
    slug: string;
  };

  try {
    const data = await ssg.posts.getSingleArticle.fetch({
      slug: params.slug,
    });

    return {
      props: {
        session: session
          ? (JSON.parse(JSON.stringify(session)) as Session)
          : null,
        article: data
          ? (JSON.parse(JSON.stringify(data)) as Article & {
            isFollowing: boolean;
          })
          : null,
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};
