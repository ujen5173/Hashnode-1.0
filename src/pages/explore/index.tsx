import React from "react";
import { Header } from "~/components";
import ExploreMainBody from "~/components/ExploreMainBody";
import ExploreSEO from "~/SEO/Explore.seo";

const ExplorePage = () => {
  return (
    <>
      <ExploreSEO />
      <Header />
      <ExploreMainBody />
    </>
  );
};

export default ExplorePage;
