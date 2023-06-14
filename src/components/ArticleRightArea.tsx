import Image from "next/image";
import React, { type FC, useContext, useState } from "react";
import ArticleProfileDropdown from "./ArticleProfileDropdown";
import { useClickOutside } from "@mantine/hooks";
import { C, type ContextValue } from "~/utils/context";
import { Search, Sun, Follow, Check } from "~/svgs";
import NotAuthenticatedProfileDropdown from "./NotAuthenticatedProfileDropdown";

const ArticleRightArea: FC = () => {
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpened(false));
  const { handleTheme, user } = useContext(C) as ContextValue;
  const { following, followUser } = useContext(C) as ContextValue;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        aria-label="icon"
        role="button"
        className="btn-icon hidden h-10 w-10 lg:flex"
      >
        <Search className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-white" />
      </button>
      <button
        aria-label="icon"
        role="button"
        className="btn-icon flex h-10 w-10"
        onClick={handleTheme}
      >
        <Sun className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-white" />
      </button>
      <div className="hidden md:block">
        <button
          onClick={() => void followUser()}
          className="btn-outline flex w-full items-center justify-center gap-2 text-secondary md:w-max"
        >
          {following.status ? (
            <>
              <Check className="h-5 w-5 fill-secondary" />
              Following
            </>
          ) : (
            <>
              <Follow className="h-5 w-5 fill-secondary" />
              Follow User
            </>
          )}
        </button>
      </div>
      <button
        aria-label="profile"
        role="button"
        className="relative rounded-full"
      >
        <Image
          src={user?.user.profile || "/default_user.avif"}
          alt={user?.user.name || "Guest User"}
          width={100}
          height={100}
          draggable={false}
          className="h-9 w-9 overflow-hidden rounded-full"
          onClick={() => setOpened(true)}
        />
        {opened &&
          (!!user ? (
            <ArticleProfileDropdown ref={ref} />
          ) : (
            <NotAuthenticatedProfileDropdown ref={ref} />
          ))}
      </button>
    </div>
  );
};

export default ArticleRightArea;
