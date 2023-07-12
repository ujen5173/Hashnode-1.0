import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { Bookmarkalt, Exit, LogonoText, Pen, User } from "~/svgs";
import { C, type ContextValue } from "~/utils/context";
import Divider from "./Divider";

const ArticleProfileDropdown = React.forwardRef<HTMLDivElement>(({}, ref) => {
  const { user } = useContext(C) as ContextValue;
  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-20 mt-1 w-56 rounded-md border border-border-light bg-gray-50 text-left shadow-md dark:border-border dark:bg-primary"
    >
      <Link href={`/u/@${user?.user.username as string} `}>
        <div className="p-2 pb-0">
          <div className="flex w-full cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-light-bg dark:hover:bg-primary-light">
            <Image
              src={user?.user.profile || "/default_user.avif"}
              alt={user?.user.name || "user"}
              width={100}
              height={100}
              className="h-10 w-10 rounded-full object-cover"
              draggable={false}
            />
            <div>
              <h1 className="text-sm font-semibold dark:text-text-secondary">
                {user?.user.name}
              </h1>
              <h2 className="text-sm text-gray-600 dark:text-text-primary">
                @{user?.user.username}
              </h2>
            </div>
          </div>
        </div>
      </Link>
      <Divider />
      <Link href="/new">
        <div className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-200 dark:text-text-primary dark:hover:bg-primary-light">
          <span>
            <Pen className="h-4 w-4 fill-none stroke-gray-900 dark:stroke-text-primary" />
          </span>
          <span className="text-sm font-medium">New Article</span>
        </div>
      </Link>
      <Link href="/bookmarks">
        <div className="flex cursor-pointer items-center gap-2 px-4 py-3 text-gray-700  hover:bg-gray-200 dark:text-text-primary dark:hover:bg-primary-light">
          <span>
            <Bookmarkalt className="h-4 w-4 fill-gray-900 dark:fill-text-primary" />
          </span>
          <span className="text-sm font-medium">My Bookmarks</span>
        </div>
      </Link>
      <Divider />
      <Link href="/">
        <div className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-200 dark:text-text-primary dark:hover:bg-primary-light">
          <span>
            <LogonoText className="h-4 w-4 fill-gray-900 dark:fill-text-primary" />
          </span>
          <span className="text-sm font-medium">Back to Hashnode</span>
        </div>
      </Link>
      <Link href="/settings">
        <div className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-200 dark:text-text-primary dark:hover:bg-primary-light">
          <span>
            <User className="h-4 w-4 fill-gray-900 dark:fill-text-primary" />
          </span>
          <span className="text-sm font-medium">Profile settings</span>
        </div>
      </Link>
      <Divider />
      <div
        onClick={() => void logout()}
        className="flex items-center gap-2 px-4 py-3 text-red hover:bg-gray-200 dark:hover:bg-primary-light"
      >
        <span>
          <Exit className="h-4 w-4 fill-red" />
        </span>
        <span>Log out</span>
      </div>
    </div>
  );
});

ArticleProfileDropdown.displayName = "ArticleProfileDropdown";

export default ArticleProfileDropdown;
