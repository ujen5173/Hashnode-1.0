import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import MetaTags from "~/components/meta/MetaTags";
import AIBanner from "../AIBanner";
import LeftAside from "../asides/Left";
import RightAside from "../asides/Right";
import Header from "../header/Header";

const MainLayout = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();

  return (
    <>
      <MetaTags title={title} description={description} />
      <Header />

      {session?.user.stripeSubscriptionStatus !== "active" && (
        <div className="w-full bg-light-bg px-4 pt-4 dark:bg-black lg:hidden lg:pt-0">
          <AIBanner />
        </div>
      )}

      <main className="min-h-[100dvh] w-full bg-light-bg dark:bg-black">
        <div className="container-body mx-auto max-w-[1550px] gap-4 px-2 sm:px-4">
          <LeftAside />
          {children}
          <RightAside />
        </div>
      </main>
    </>
  );
};

export default MainLayout;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const hasSession = context.req.headers.cookie?.includes(
    "next-auth.session-token",
  );

  if (
    hasSession &&
    (context.req.url === "/explore/tags-following" ||
      context.req.url === "/explore/articles-following")
  ) {
    return { props: { session: null }, redirect: { destination: "/" } };
  }

  return {
    props: {},
  };
};
