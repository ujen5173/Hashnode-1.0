import type { GetServerSideProps, NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { Header } from "~/component";
import { BookmarkMainBody } from "~/component/macroComponent/Bookmark";
import BookmarkSEO from "~/SEO/Bookmark.seo";
import { authOptions } from "~/server/auth";

const Bookmark: NextPage = () => {

  return (
    <>
      <BookmarkSEO />
      <Header />
      <BookmarkMainBody />
    </>
  );
};

export default Bookmark;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      session: session
        ? (JSON.parse(JSON.stringify(session)) as Session)
        : null,
    },
  };
};
