import { eq } from "drizzle-orm";
import type { GetServerSideProps, NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { Aside, Header, MainTagBody, RightAsideMain } from "~/component";
import TagSEO from "~/SEO/Tag.seo";
import { authOptions } from "~/server/auth";
import db from "~/server/db";
import { tags } from "~/server/db/schema";
import type { DetailedTag } from "~/types";

const SingleTag: NextPage<{ tagDetails: DetailedTag }> = ({ tagDetails }) => {
  return (
    <>
      <TagSEO tagDetails={tagDetails} />

      <Header />

      <main className="min-h-[100dvh] w-full bg-light-bg dark:bg-black">
        <div className="container-body mx-auto max-w-[1550px] gap-4 sm:px-4">
          <Aside />
          <MainTagBody tagDetails={tagDetails} />
          <RightAsideMain tagDetails={tagDetails} />
        </div>
      </main>
    </>
  );
};

export default SingleTag;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const params = context.params?.slug as string;

  if (!params) {
    return {
      props: {
        session: session,
        tagDetails: null,
      },
      redirect: {
        destination: "/",
      },
    };
  }

  const tagDetails = await db.query.tags.findFirst({
    where: eq(tags.slug, params),
    with: {
      followers: {
        columns: {
          userId: true
        },
      },
      articles: {
        columns: {
          articleId: true
        },
      },
    }
  }).then((res) => {
    return {
      ...res,
      followers: res?.followers.map((e) => e.userId),
      articles: res?.articles.map((e) => e.articleId),
    }
  });

  return {
    props: {
      session: session
        ? (JSON.parse(JSON.stringify(session)) as Session)
        : null,
      tagDetails: JSON.parse(JSON.stringify(tagDetails)) as DetailedTag,
    },
  };
};
