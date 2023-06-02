import React from "react";
import { BookmarkMainBody, Header } from "~/components";
import BookmarkSEO from "~/SEO/Bookmark.seo";

const Bookmark = () => {
  return (
    <>
      <BookmarkSEO />
      <Header />
      <BookmarkMainBody />
    </>
  );
};

export default Bookmark;
