import React from "react";
import { ArticleBody, ArticleHeader, Footer } from "~/components";
import ArticleSEO from "~/SEO/Article.seo";

const SingleArticle = () => {
  return (
    <>
      <ArticleSEO />
      <ArticleHeader />
      <ArticleBody />
      <Footer />
    </>
  );
};

export default SingleArticle;
