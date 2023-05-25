import Document from "~/svgs/Document";
import Bookmarkalt from "./../svgs/Bookmarkalt";
import User from "./../svgs/User";
import Tab from "./../svgs/Tab";
import Image from "next/image";
import React from "react";
import Exit from "./../svgs/Exit";
import Divider from "./Divider";

type ProfileDropdownProps = {
  setOpened: (opened: boolean) => void;
};

const ProfileDropdown = React.forwardRef<HTMLDivElement, ProfileDropdownProps>(
  ({ setOpened }, ref) => {
    return (
      <div
        ref={ref}
        className="absolute right-0 top-full z-20 mt-1 w-56 rounded-md border border-border-light bg-gray-50 text-left shadow-md dark:border-border dark:bg-black"
      >
        <div className="flex items-center gap-2 p-4">
          <Image
            src={"/default_user.avif"}
            alt=""
            width={100}
            height={100}
            className="h-9 w-9"
            onClick={() => setOpened(true)}
          />
          <div>
            <h1 className="text-sm font-semibold dark:text-text-primary">
              ujenbasi
            </h1>
            <h1 className="text-sm font-semibold text-gray-600 dark:text-white">
              @ujenbasi5173
            </h1>
          </div>
        </div>
        <Divider />
        <div className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-200 dark:text-text-primary dark:hover:bg-primary-light">
          <span>
            <Document className="h-4 w-4 fill-none stroke-gray-900 dark:stroke-text-primary" />
          </span>
          <span className="text-sm font-medium">My Drafts</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-200 dark:text-text-primary dark:hover:bg-primary-light">
          <span>
            <Bookmarkalt className="h-4 w-4 fill-gray-900 dark:fill-text-primary" />
          </span>
          <span className="text-sm font-medium">My Bookmarks</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-200 dark:text-text-primary dark:hover:bg-primary-light">
          <span>
            <User className="h-4 w-4 fill-gray-900 dark:fill-text-primary" />
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
        <div className="flex items-center gap-2 px-4 py-3 text-red hover:bg-gray-200 dark:hover:bg-primary-light">
          <span>
            <Exit className="h-4 w-4 fill-red" />
          </span>
          <span>Log out</span>
        </div>
      </div>
    );
  }
);

ProfileDropdown.displayName = "ProfileDropdown";

export default ProfileDropdown;
