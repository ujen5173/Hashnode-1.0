import Image from "next/image";
import React, { useState } from "react";
import Search from "~/svgs/Search";
import Sun from "~/svgs/Sun";
import ArticleProfileDropdown from "./ArticleProfileDropdown";
import { useClickOutside } from "@mantine/hooks";
import Follow from "./../svgs/Follow";

const ArticleRightArea = () => {
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpened(false));

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        aria-label="icon"
        role="button"
        className="btn-icon flex h-10 w-10"
      >
        <Search className="h-7 w-7 fill-none stroke-gray-700 dark:stroke-white" />
      </button>
      <button
        aria-label="icon"
        role="button"
        className="btn-icon flex h-10 w-10"
      >
        <Sun className="h-7 w-7 fill-none stroke-gray-700 dark:stroke-white" />
      </button>
      <button aria-label="icon" role="button" className="btn-follow gap-2">
        <span>
          <Follow className="h-4 w-4 fill-none stroke-secondary" />
        </span>
        <span>Follow</span>
      </button>
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
