import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import {
  Bookmarkalt,
  Exit,
  Feed,
  Manage,
  Search,
  User as UserSVG,
} from "~/svgs";
import { C, type ContextValue } from "~/utils/context";

const ProfileDropdown = React.forwardRef<
  HTMLDivElement,
  {
    user: Session | null;
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  }
>(({ user, setOpened }, ref) => {
  const { setSearchOpen } = useContext(C) as ContextValue;
  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-20 mt-2 w-64 rounded-md border border-border-light bg-gray-50 py-2 text-left shadow-lg dark:border-border dark:bg-primary"
    >
      <Link href={`/u/@${user?.user.username as string} `}>
        <div className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-primary-light">
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
      </Link>
      <div className="my-2 h-[1px] w-full bg-border-light dark:bg-border" />
      {user?.user && user?.user.handle ? (
        <div>
          <h1 className="mb-1 px-4 text-xs font-semibold text-gray-500 dark:text-text-primary">
            Personal Blogs
          </h1>
          <Link href={`/${user.user.id}/dashboard`}>
            <div className="px-4 py-2 hover:bg-gray-200 hover:dark:bg-border">
              <h1 className="max-height-one text-sm text-gray-700 dark:text-text-secondary">
                {`${user.user.handle.handle}.hashnode-t3.dev`}
              </h1>
            </div>
          </Link>
        </div>
      ) : (
        <Link href={`/onboard/blog/setup`}>
          <div className="flex w-full cursor-pointer gap-2 px-4 py-2 hover:bg-light-bg dark:hover:bg-primary-light">
            <Feed className="h-7 w-7 fill-secondary" />
            <div>
              <h1 className="mb-1 text-sm font-semibold text-secondary">
                Start a personal blog
              </h1>
              <h1 className="text-xs font-medium text-gray-500 dark:text-text-secondary">
                Create a Hashnode blog for personal use. No collaborators.
              </h1>
            </div>
          </div>
        </Link>
      )}
      <div className="my-2 h-[1px] w-full bg-border-light dark:bg-border" />
      <Link href="/bookmarks">
        <div className="flex cursor-pointer items-center gap-2 px-4 py-3 text-gray-700  hover:bg-gray-200 dark:text-text-secondary dark:hover:bg-primary-light">
          <span>
            <Bookmarkalt className="h-4 w-4 fill-gray-900 dark:fill-text-secondary" />
          </span>
          <span className="text-sm font-medium">My Bookmarks</span>
        </div>
      </Link>
      <Link href="/settings">
        <div className="flex cursor-pointer items-center gap-2 px-4 py-3 text-gray-700  hover:bg-gray-200 dark:text-text-secondary dark:hover:bg-primary-light">
          <span>
            <UserSVG className="h-4 w-4 fill-gray-900 dark:fill-text-secondary" />
          </span>
          <span className="text-sm font-medium">Account Settings</span>
        </div>
      </Link>
      {/*?? ↘️ forced as string because this component will only mount to authenticated users. */}
      <Link href={`/${user?.user.id as string}/dashboard`}>
        <div className="flex cursor-pointer items-center gap-2 px-4 py-3 text-gray-700  hover:bg-gray-200 dark:text-text-secondary dark:hover:bg-primary-light">
          <span>
            <Manage className="h-4 w-4 fill-none stroke-gray-900 dark:stroke-text-secondary" />
          </span>
          <span className="text-sm font-medium">Manage your blogs</span>
        </div>
      </Link>
      <div
        onClick={() => {
          setOpened(false);
          setSearchOpen(true);
        }}
        className="flex cursor-pointer items-center gap-2 px-4 py-3 text-gray-700  hover:bg-gray-200 dark:text-text-secondary dark:hover:bg-primary-light lg:hidden"
      >
        <span>
          <Search className="h-4 w-4 stroke-gray-900 dark:stroke-text-primary" />
        </span>
        <span className="text-sm font-medium">Search</span>
      </div>
      <div className="my-2 h-[1px] w-full bg-border-light dark:bg-border" />
      <button
        onClick={() => {
          void logout();
        }} className="flex w-full items-center gap-2 px-4 py-3 text-red hover:bg-gray-200 dark:hover:bg-primary-light"
      >
        <span>
          <Exit className="h-4 w-4 fill-red" />
        </span>
        <span>Log out</span>
      </button>
    </div>
  );
});

ProfileDropdown.displayName = "ProfileDropdown";

export default ProfileDropdown;
