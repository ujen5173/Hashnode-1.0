import type { GetServerSideProps, NextPage } from "next";
import React, { createContext } from "react";
import { ArticleBody, ArticleHeader, Footer } from "~/component";
import MetaTags from "~/component/MetaTags";
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
        article: data
          ? (JSON.parse(JSON.stringify(data)) as Article & {
              isFollowing: boolean;
            })
          : null,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
