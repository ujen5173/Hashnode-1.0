import React, { useState, useContext, type FC } from "react";
import { useClickOutside } from "@mantine/hooks";
import { C } from "~/utils/context";
import Image from "next/image";
import ProfileDropdown from "./ProfileDropdown";
import RightArea from "./RightArea.header";
import SearchArea from "./Search";
import LeftArea from "./LeftArea";

const Header: React.FC = () => {
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpened(false));

  const { handleTheme } = useContext(C);

  return (
    <header className="w-full border-b border-border-light bg-white dark:border-border dark:bg-primary">
      <div className="mx-auto flex max-w-[1550px] items-center justify-between gap-4 px-4 py-4">
        <div className="flex flex-1 items-center justify-between gap-8 md:gap-4">
          <LeftArea />
          <SearchArea />
        </div>

        <div className="flex items-center gap-2">
          <RightArea handleTheme={handleTheme} />
          <button
            aria-label="icon"
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
            {opened && <ProfileDropdown setOpened={setOpened} ref={ref} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
