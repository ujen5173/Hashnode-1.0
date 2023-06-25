import type { GetServerSideProps, NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { BookmarkMainBody, Header } from "~/components";
import BookmarkSEO from "~/SEO/Bookmark.seo";
import { authOptions } from "~/server/auth";
import { C, type ContextValue } from "~/utils/context";
import { useContext, useEffect } from "react";
import { useSession } from "next-auth/react";

const Bookmark: NextPage = () => {
  const { data: session } = useSession();
  const { setUser } = useContext(C) as ContextValue;

  useEffect(() => {
    setUser(session);
  }, [session]);

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
