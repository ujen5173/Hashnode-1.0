import React from "react";
import Topright from "~/svgs/Topright";

const UserBlogingArea = () => {
  return (
    <div className="my-6 w-full rounded-md border border-border-light px-6 py-3 dark:border-border md:px-12 md:py-6">
      <header className="mb-6 w-full border-b border-border-light py-3 dark:border-border">
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-text-secondary">
          Writes at
        </h1>
      </header>
      <section className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-0">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
            Shen&apos;s Developer Diary
          </h1>
          <h1 className="text-base font-normal text-gray-700 dark:text-text-primary">
            blogs.shen.dev
          </h1>
        </div>
        <button className="btn-outline flex items-center justify-center gap-2">
          <Topright className="h-4 w-4 fill-gray-700 dark:fill-text-secondary" />
          <span className="text-gray-700 dark:text-text-secondary">
            Read the Blog
          </span>
        </button>
      </section>
    </div>
  );
};

export default UserBlogingArea;
