import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { Header, MainBody } from "~/components";
import HomeSEO from "~/SEO/Home.seo";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <HomeSEO />
      <Header />
      <div className="border-b border-border-light bg-light-bg p-4 text-center text-gray-700 dark:border-border dark:bg-primary dark:text-text-secondary">
        {status === "authenticated" ? (
          <span className="font-semibold text-green">
            {session.user.username + " is logged in"}
          </span>
        ) : (
          <span className="font-semibold text-red">NOT LOGGED IN</span>
        )}
      </div>
      <MainBody />
    </>
  );
};

export default Home;
