// ACCEPTED PARAMS: article/new | article/edit/[articleId]

import type { GetServerSideProps, NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { useState } from "react";
import NewSEO from "~/SEO/New.seo";
import { NewArticleBody, NewArticleHeader } from "~/component";
import { authOptions } from "~/server/auth";

const NewArticle: NextPage = () => {
  const [publishModal, setPublishModal] = useState<boolean>(false);
  const [publishing, setPublishing] = useState<boolean>(false); // upload loading
  const [savedState, setSavedState] = useState<boolean>(true);


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
