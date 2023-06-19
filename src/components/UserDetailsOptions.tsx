import React from "react";

const UserDetailsOptions = () => {
  return (
    <div className="rounded-md border border-border-light bg-white dark:border-border dark:bg-primary">
      <ul>
        <li className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-light-bg dark:text-text-primary dark:hover:bg-border">
          PROFILE
        </li>
        <li className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-light-bg dark:text-text-primary dark:hover:bg-border">
          EMAIL NOTIFICATIONS
        </li>
        <li className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-light-bg dark:text-text-primary dark:hover:bg-border">
          MANAGE BLOGS
        </li>
        <li className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-light-bg dark:text-text-primary dark:hover:bg-border">
          DEVELOPER
        </li>
        <li className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-light-bg dark:text-text-primary dark:hover:bg-border">
          ACCOUNT
        </li>
        <li className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-light-bg dark:text-text-primary dark:hover:bg-border">
          BETA FEATURES
        </li>
        <li className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-light-bg dark:text-text-primary dark:hover:bg-border">
          PRO SUBSCRIPTIONS
        </li>
      </ul>
    </div>
  );
};

export default UserDetailsOptions;
