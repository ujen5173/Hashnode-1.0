import type { NextPage } from "next";
import { Header } from "~/component";
import MetaTags from "~/component/MetaTags";
import { BookmarkMainBody } from "~/component/macroComponent/Bookmark";

const Bookmark: NextPage = () => {
  return (
    <>
      <MetaTags title="Bookmarks" />
      <Header />
      <BookmarkMainBody />
    </>
  );
};

export default Bookmark;
