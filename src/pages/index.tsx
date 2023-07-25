import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { Anouncement, Header, MainBody } from "~/component";
import HomeSEO from "~/SEO/Home.seo";
import { authOptions } from "~/server/auth";
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
      <div className="w-full bg-light-bg px-0 pt-4 dark:bg-black sm:px-4 lg:hidden lg:pt-0">
        <Anouncement /> {/* Hashnode Pro Section */}
      </div>
      {/* <AuthCheck /> */}
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
