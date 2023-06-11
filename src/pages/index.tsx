import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { AuthCheck, Header, MainBody } from "~/components";
import HomeSEO from "~/SEO/Home.seo";
import { authOptions } from "~/server/auth";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const { setUser } = useContext(C) as ContextValue;

  useEffect(() => {
    setUser(session);
  }, []);

  return (
    <>
      <HomeSEO />
      <Header />
      <AuthCheck />
      <MainBody />
    </>
  );
};

export default Home;

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
