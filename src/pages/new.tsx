import React, { useState } from "react";
import { NewArticleBody, NewArticleHeader } from "~/components";

const NewArticle = () => {
  const [publishModal, setPublishModal] = useState<boolean>(false);

  return (
    <>
      <NewArticleHeader setPublishModal={setPublishModal} />
      <NewArticleBody
        publishModal={publishModal}
        setPublishModal={setPublishModal}
      />
    </>
  );
};

export default NewArticle;
