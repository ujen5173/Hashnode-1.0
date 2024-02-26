import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { Anouncement, Header, MainBody } from "~/component";
import MetaTags from "~/component/MetaTags";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <MetaTags title="Home" />

      <Header />
      {session?.user.stripeSubscriptionStatus !== "active" && (
        <div className="w-full bg-light-bg pt-4 dark:bg-black px-4 lg:hidden lg:pt-0">
          <Anouncement />
        </div>
      )}
      <MainBody />
    </>
  );
};

export default Home;
