import type { GetServerSideProps, NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { NewArticleBody, NewArticleHeader } from "~/components";
import NewSEO from "~/SEO/New.seo";
import { authOptions } from "~/server/auth";
import { C, type ContextValue } from "~/utils/context";

const NewArticle: NextPage = () => {
  const [publishModal, setPublishModal] = useState<boolean>(false);
  const [publishing, setPublishing] = useState<boolean>(false); // upload loading
  const { data: session } = useSession();
  const { setUser } = useContext(C) as ContextValue;
  const [savedState, setSavedState] = useState<boolean>(true);

  useEffect(() => {
    setUser(session);
  }, []);

  return (
    <>
      <NewSEO />
      <NewArticleHeader
        setPublishModal={setPublishModal}
        publishing={publishing}
        savedState={savedState}
      />
      <NewArticleBody
        publishModal={publishModal}
        setPublishModal={setPublishModal}
        publishing={publishing}
        setPublishing={setPublishing}
        setSavedState={setSavedState}
      />
    </>
  );
};

export default NewArticle;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user) {
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
