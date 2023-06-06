import { Document, Bookmarkalt, User as UserSVG, Tab, Exit } from "~/svgs";
import Image from "next/image";
import React from "react";
import Divider from "./Divider";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import Link from "next/link";

const ProfileDropdown = React.forwardRef<
  HTMLDivElement,
  { user: Session | null }
>(({ user }, ref) => {
  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-20 mt-1 w-56 rounded-md border border-border-light bg-gray-50 text-left shadow-md dark:border-border dark:bg-black"
    >
      <div className="flex items-center gap-2 p-4">
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
      <Divider />
      <div className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-200 dark:text-text-primary dark:hover:bg-primary-light">
        <span>
          <Document className="h-4 w-4 fill-none stroke-gray-900 dark:stroke-text-primary" />
        </span>
        <span className="text-sm font-medium">My Drafts</span>
      </div>
      <Link href="/bookmarks">
        <div className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-200 dark:text-text-primary dark:hover:bg-primary-light">
          <span>
            <Bookmarkalt className="h-4 w-4 fill-gray-900 dark:fill-text-primary" />
          </span>
          <span className="text-sm font-medium">My Bookmarks</span>
        </div>
      </Link>
      <div className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-200 dark:text-text-primary dark:hover:bg-primary-light">
        <span>
          <UserSVG className="h-4 w-4 fill-gray-900 dark:fill-text-primary" />
        </span>
        <span className="text-sm font-medium">Account Settings</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-200 dark:text-text-primary dark:hover:bg-primary-light">
        <span>
          <Tab className="h-4 w-4 fill-gray-900 dark:fill-text-primary" />
        </span>
        <span className="text-sm font-medium">Manage your blogs</span>
      </div>
      <Divider />{" "}
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

ProfileDropdown.displayName = "ProfileDropdown";

export default ProfileDropdown;
