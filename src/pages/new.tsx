import React, { useState } from "react";
import { NewArticleBody, NewArticleHeader } from "~/components";
import NewSEO from "~/SEO/New.seo";

const NewArticle = () => {
  const [publishModal, setPublishModal] = useState<boolean>(false);

  return (
    <>
      <NewSEO />
      <NewArticleHeader setPublishModal={setPublishModal} />
      <NewArticleBody
        publishModal={publishModal}
        setPublishModal={setPublishModal}
      />
    </>
  );
};

export default NewArticle;
