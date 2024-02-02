import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { Anouncement, Header, MainBody } from "~/component";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Header />
      {session?.user.stripeSubscriptionStatus !== "active" && (
        <div className="w-full bg-light-bg px-0 pt-4 dark:bg-black sm:px-4 lg:hidden lg:pt-0">
          <Anouncement />
        </div>
      )}
      <MainBody />
    </>
  );
};

export default Home;
