import Image from "next/image";
import React, { useContext, useState } from "react";
import ArticleProfileDropdown from "./ArticleProfileDropdown";
import { useClickOutside } from "@mantine/hooks";
import { C } from "~/utils/context";
import { Search, Sun, Follow } from "~/svgs";

const ArticleRightArea = () => {
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpened(false));
  const { handleTheme } = useContext(C);

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
        <button aria-label="icon" role="button" className="btn-follow gap-2">
          <span>
            <Follow className="h-5 w-5 fill-none stroke-secondary" />
          </span>
          <span>Follow</span>
        </button>
      </div>

      <button
        aria-label="profile"
        role="button"
        className="relative rounded-full"
      >
        <Image
          src={"/default_user.avif"}
          alt=""
          width={100}
          height={100}
          className="h-9 w-9 overflow-hidden rounded-full"
          onClick={() => setOpened(true)}
        />
        {opened && <ArticleProfileDropdown ref={ref} />}
      </button>
    </div>
  );
};

export default ArticleRightArea;
