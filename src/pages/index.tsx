import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { Header, MainBody } from "~/components";
import HomeSEO from "~/SEO/Home.seo";
import { authOptions } from "~/server/auth";
import { C, type ContextValue } from "~/utils/context";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const { setUser } = useContext(C) as ContextValue;

  useEffect(() => {
    setUser(session);
  }, []);

  return (
    <>
      <HomeSEO />
      <Header />
      <div className="border-b border-border-light bg-light-bg p-4 text-center text-gray-700 dark:border-border dark:bg-primary dark:text-text-secondary">
        {status === "authenticated" ? (
          <span className="font-semibold text-green">
            {session.user.name + " is logged in"}
          </span>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="font-semibold text-red">NOT LOGGED IN</p>
            <div className="flex items-center gap-2">
              <button
                className="btn-filled"
                onClick={() => void signIn("github")}
              >
                Continue with Github
              </button>
              <button
                className="btn-outline"
                onClick={() => void signIn("google")}
              >
                Continue with Google
              </button>
            </div>
          </div>
        )}
      </div>
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
