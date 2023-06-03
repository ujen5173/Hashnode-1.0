import React, { useState } from "react";
import { NewArticleBody, NewArticleHeader } from "~/components";
import NewSEO from "~/SEO/New.seo";

const NewArticle = () => {
  const [publishModal, setPublishModal] = useState<boolean>(false);
  const [publishing, setPublishing] = useState<boolean>(false); // upload loading

  return (
    <>
      <NewSEO />
      <NewArticleHeader
        setPublishModal={setPublishModal}
        publishing={publishing}
      />
      <NewArticleBody
        publishModal={publishModal}
        setPublishModal={setPublishModal}
        publishing={publishing}
        setPublishing={setPublishing}
      />
    </>
  );
};

export default NewArticle;
