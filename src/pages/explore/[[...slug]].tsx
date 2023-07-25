import type { GetServerSideProps, NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { ExploreMainBody, Header } from "~/component";
import ExploreSEO from "~/SEO/Explore.seo";
import { authOptions } from "~/server/auth";
import { C, type ContextValue } from "~/utils/context";

const ExplorePage: NextPage = () => {
  const { data: session } = useSession();
  const { setUser } = useContext(C) as ContextValue;

  useEffect(() => {
    setUser(session);
  }, []);

  return (
    <>
      <ExploreSEO />
      <Header />
      <ExploreMainBody />
    </>
  );
};

export default ExplorePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (
    !session?.user &&
    (context.req.url === "/explore/tags-following" ||
      context.req.url === "/explore/articles-following")
  ) {
    return { props: { session: null }, redirect: { destination: "/" } };
  }

  return {
    props: {
      session: session
        ? (JSON.parse(JSON.stringify(session)) as Session)
        : null,
    },
  };
};
