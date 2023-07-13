import type { GetServerSideProps, NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { ArticleBody, ArticleHeader, Footer } from "~/components";
import ArticleSEO from "~/SEO/Article.seo";
import { authOptions } from "~/server/auth";
import { generateSSGHelper } from "~/server/ssgHelper";
import { type Article } from "~/types";
import { C, type ContextValue } from "~/utils/context";

interface Props {
  article: Article & {
    isFollowing: boolean;
  };
}

const SingleArticle: NextPage<Props> = ({ article }) => {
  const { data: session } = useSession();
  const { setUser, setFollowing } = useContext(C) as ContextValue;

  useEffect(() => {
    setUser(session);
    setFollowing({
      status: article.isFollowing,
      followersCount: "", // not needed
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
  const session = await getServerSession(context.req, context.res, authOptions);

  const ssg = await generateSSGHelper({ req: context.req, res: context.res });

  const params = context.params as {
    username: string;
    slug: string;
  };

  try {
    const data = await ssg.posts.getSingleArticle.fetch({
      slug: params.slug,
      username: params.username,
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
        destination: "/",
        permanent: false,
      },
    };
  }
};
