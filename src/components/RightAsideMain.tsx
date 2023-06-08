import Anouncement from "./Anouncement";
import Drafts from "./Drafts";
import Bookmarks from "./Bookmarks";
import Others from "./Others";
import Trending from "./Trending";
import type { FC } from "react";
import type { DetailedTag } from "~/types";

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

          <p className="text-base text-gray-700 dark:text-text-secondary">
            {tagDetails.description || "No description provided."}
          </p>
        </div>
      ) : (
        <Anouncement />
      )}
      <Trending />
      <Drafts />
      <Bookmarks />
      <Others />
    </aside>
  );
};

export default RightAsideMain;
