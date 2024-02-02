import type { GetServerSideProps, NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { ExploreMainBody, Header } from "~/component";
import MetaTags from "~/component/MetaTags";
import { authOptions } from "~/server/auth";

const ExplorePage: NextPage = () => {
  return (
    <>
      <MetaTags
        title={`Explore Popular Tech Blogs and Topics`}
        description="Explore the most popular tech blogs from the Hashnode community. A constantly updating list of the best minds in tech."
      />

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
