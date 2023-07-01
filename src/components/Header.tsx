import { useClickOutside } from "@mantine/hooks";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { Search } from "~/svgs";
import { C, type ContextValue } from "~/utils/context";
import LeftArea from "./LeftArea";
import NotAuthenticatedProfileDropdown from "./NotAuthenticatedProfileDropdown";
import ProfileDropdown from "./ProfileDropdown";
import RightArea from "./RightAreaHeader";
import SearchArea from "./Search";

const Header: React.FC = () => {
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpened(false));
  const { user } = useContext(C) as ContextValue;
  const [searchOpened, setSearchOpened] = useState(false);

  return (
    <header className="w-full border-b border-border-light bg-white dark:border-border dark:bg-primary">
      <div className="mx-auto flex max-w-[1550px] items-center justify-between gap-4 px-4 py-4">
        <div className="flex flex-1 items-center justify-between gap-8 md:gap-4">
          <LeftArea />
          <button
            onClick={() => setSearchOpened(true)}
            className="btn-icon-large flex lg:hidden"
          >
            <Search className="h-5 w-5 stroke-gray-700 dark:stroke-text-primary" />
          </button>
          <SearchArea opened={searchOpened} setOpened={setSearchOpened} />
        </div>

        <div className="flex items-center gap-2">
          <RightArea />
          <button
            aria-label="icon"
            role="button"
            className="relative rounded-full"
          >
            <Image
              src={user?.user.profile || "/default_user.avif"}
              alt={user?.user.name || "user"}
              width={100}
              height={100}
              className="h-9 w-9 select-none overflow-hidden rounded-full"
              onClick={() => setOpened(true)}
              draggable={false}
            />
            {opened &&
              (!!user ? (
                <ProfileDropdown user={user} ref={ref} />
              ) : (
                <NotAuthenticatedProfileDropdown ref={ref} />
              ))}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
