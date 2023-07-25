import Link from "next/link";
import { type FC } from "react";
import { Topright } from "~/svgs";
import { type DetailedUser } from "~/types";

const UserBlogingArea: FC<{
  userDetails: DetailedUser;
}> = ({ userDetails }) => {
  return (
    <div className="my-6 w-full rounded-md border border-border-light px-6 py-6 dark:border-border md:px-12">
      <header className="mb-6 w-full border-b border-border-light py-3 dark:border-border">
        <h1 className="text-lg font-semibold text-gray-700 dark:text-text-secondary md:text-xl lg:text-2xl">
          Writes at
        </h1>
      </header>

      <section className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-0">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-700 dark:text-text-secondary md:text-xl">
            {userDetails?.handle?.name === userDetails?.username
              ? `${userDetails?.handle?.name}'s Blog`
              : userDetails?.handle?.name}
          </h1>

          <h1 className="text-sm font-normal text-gray-700 dark:text-text-primary md:text-base">
            {userDetails?.handle?.handle}.hashnode-t3.vercel.app
          </h1>
        </div>

        <Link href={`/dev/@${userDetails?.handle?.handle as string}`}>
          <button className="btn-outline flex items-center justify-center gap-2">
            <Topright className="h-4 w-4 fill-gray-700 dark:fill-text-secondary" />

            <span className="text-sm text-gray-700 dark:text-text-secondary md:text-base">
              Read the Blog
            </span>
          </button>
        </Link>
      </section>
    </div>
  );
};

export default UserBlogingArea;
