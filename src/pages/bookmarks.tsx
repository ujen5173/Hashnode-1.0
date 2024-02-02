import type { NextPage } from "next";
import { Header } from "~/component";
import { BookmarkMainBody } from "~/component/macroComponent/Bookmark";

const Bookmark: NextPage = () => {

  return (
    <>
      <Header />
      <BookmarkMainBody />
    </>
  );
};

export default Bookmark;
