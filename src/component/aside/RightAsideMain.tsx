import type { FC } from "react";
import type { DetailedTag } from "~/types";
import { Bookmarks } from "../macroComponent/Bookmark";
import { Anouncement, Others, Trending } from "../miniComponent";

const RightAsideMain: FC<{ tagDetails?: DetailedTag }> = ({ tagDetails }) => {
  return (
    <aside className="container-right-aside my-4 hidden min-h-screen lg:block">
      {tagDetails ? (
        <div className="rounded-md border border-border-light bg-white p-6 dark:border-border dark:bg-primary">
          <header className="mb-5 flex gap-4">
            <h1 className="text-xl font-bold text-black dark:text-white">
              About this Tag
            </h1>
          </header>

          <p className="text-base text-gray-500 dark:text-text-primary">
            {tagDetails.description || "No description provided."}
          </p>
        </div>
      ) : (
        <Anouncement />
      )}
      <Trending />
      <Bookmarks />
      <Others />
    </aside>
  );
};

export default RightAsideMain;
