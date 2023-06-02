import React from "react";
import Aside from "./Aside";
import BookmarkMainComponent from "./BookmarkMainComponent";
import RightAsideMain from "./RightAsideMain";

const BookmarkMainBody = () => {
  return (
    <main className="min-h-screen w-full bg-light-bg dark:bg-black">
      <div className="container-body mx-auto max-w-[1550px] gap-4 px-4">
        <Aside />
        <BookmarkMainComponent />
        <RightAsideMain />
      </div>
    </main>
  );
};

export default BookmarkMainBody;
