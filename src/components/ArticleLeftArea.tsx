import Link from "next/link";
import { Hamburger, Angleleft } from "~/svgs";
import Image from "next/image";
import type { User } from "./ArticleHeader";
import type { FC } from "react";

const ArticleLeftArea: FC<{ user: User }> = ({ user }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Link href="/">
        <button
          aria-label="icon"
          role="button"
          className="btn-icon flex h-10 w-10"
        >
          <Angleleft className="h-5 w-5 fill-black dark:fill-white" />
        </button>
      </Link>

      <button
        aria-label="icon"
        role="button"
        className="btn-icon mr-2 flex h-10 w-10"
      >
        <Hamburger className="h-5 w-5 fill-black dark:fill-white" />
      </button>
      <Link
        aria-label="Visit Profile"
        className="hidden items-center gap-2 md:flex"
        href="/u/@test"
      >
        <Image
          src={user?.profile || ""}
          alt={user?.name}
          width={70}
          height={70}
          draggable={false}
          className="h-8 w-8 rounded-full"
        />
        <h1 className="text-lg font-semibold text-gray-700 dark:text-text-secondary">
          {user?.name}&rsquo;s Blog
        </h1>
      </Link>
    </div>
  );
};

export default ArticleLeftArea;
