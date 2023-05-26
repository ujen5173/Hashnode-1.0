import Document from "~/svgs/Document";
import User from "~/svgs/User";
import React from "react";
import Exit from "~/svgs/Exit";
import Divider from "./Divider";
import Pen from "~/svgs/Pen";
import LogonoText from "~/svgs/LogonoText";
import Explore from "~/svgs/Explore";

const ArticleProfileDropdown = React.forwardRef<HTMLDivElement>(({}, ref) => {
  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-20 mt-1 w-56 rounded-md border border-border-light bg-gray-50 text-left shadow-md dark:border-border dark:bg-primary"
    >
      <div className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-200 dark:text-text-primary dark:hover:bg-primary-light">
        <span>
          <Pen className="h-4 w-4 fill-none stroke-gray-900 dark:stroke-text-primary" />
        </span>
        <span className="text-sm font-medium">New Drafts</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-200 dark:text-text-primary dark:hover:bg-primary-light">
        <span>
          <Document className="h-4 w-4 fill-none stroke-gray-900 dark:stroke-text-primary" />
        </span>
        <span className="text-sm font-medium">All Drafts</span>
      </div>
      <Divider />
      <div className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-200 dark:text-text-primary dark:hover:bg-primary-light">
        <span>
          <LogonoText className="h-4 w-4 fill-gray-900 dark:fill-text-primary" />
        </span>
        <span className="text-sm font-medium">Back to Hashnode</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-200 dark:text-text-primary dark:hover:bg-primary-light">
        <span>
          <Explore className="h-4 w-4 fill-gray-900 dark:fill-text-primary" />
        </span>
        <span className="text-sm font-medium">Explore Hashnode</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-200 dark:text-text-primary dark:hover:bg-primary-light">
        <span>
          <User className="h-4 w-4 fill-gray-900 dark:fill-text-primary" />
        </span>
        <span className="text-sm font-medium">Profile settings</span>
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
});

ArticleProfileDropdown.displayName = "ArticleProfileDropdown";

export default ArticleProfileDropdown;
