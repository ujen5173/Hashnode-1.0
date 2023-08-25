import { useSession } from "next-auth/react";
import type { FC } from "react";
import type { DetailedTag } from "~/types";
import { api } from "~/utils/api";
import { Bookmarks } from "../macroComponent/Bookmark";
import { Anouncement, Others, Trending } from "../miniComponent";

const RightAsideMain: FC<{ tagDetails?: DetailedTag }> = ({ tagDetails }) => {
  const { data: session } = useSession();
  const { data } = api.users.subscriptionStatus.useQuery(undefined, {
    enabled: !!session,
    refetchOnWindowFocus: false,
  });

  return (
    <aside className="container-right-aside my-4 hidden min-h-[100dvh] lg:block">
      {tagDetails ? (
        <div className="rounded-md mb-4 border border-border-light bg-white p-6 dark:border-border dark:bg-primary">
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
        !data && (
          <div className="mb-4">
            <Anouncement />
          </div>
        ))}
      <Trending />
      <Bookmarks />
      <Others />
    </aside>
  );
};

export default RightAsideMain;
