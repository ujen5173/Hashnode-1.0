import React from "react";
import { bookmarksArticles } from "~/utils/constants";
import Aside from "./Aside";
import ArticleCard from "./Cards/ArticleCard";
import RightAsideMain from "./RightAsideMain";

const BookmarkMainBody = () => {
  return (
    <main className="min-h-screen w-full bg-light-bg dark:bg-black">
      <div className="mx-auto flex max-w-[1550px] justify-between gap-4 px-4">
        <Aside />
        <section className="my-4 min-h-screen w-full flex-[5]">
          <div className="mb-4 rounded-md border border-border-light bg-white px-6 py-12 dark:border-border dark:bg-primary">
            <h1 className="mb-2 text-center text-3xl font-semibold text-gray-700 dark:text-text-secondary">
              Bookmarks
            </h1>
            <p className="mx-auto w-10/12 text-center text-base font-normal text-gray-500 dark:text-text-primary">
              All articles you have bookmarked on Hashnode Clone
            </p>
          </div>

          <div className="rounded-md border border-border-light bg-white pt-2 dark:border-border dark:bg-primary">
            {bookmarksArticles.map((article) => (
              <ArticleCard card={article} key={article.id} />
            ))}
          </div>
        </section>
        <RightAsideMain />
      </div>
    </main>
  );
};

export default BookmarkMainBody;
