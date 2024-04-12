import { useClickOutside } from "@mantine/hooks";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Logo, LogonoText } from "~/svgs";
import ProfileDropdown from "../dropdowns/ProfileDropdown";
import UnAuthenticatedProfileDropdown from "../dropdowns/UnAuthenticatedProfileDropdown";
import HamburgerMenu from "../menu/global/MobileMenu";
import Actions from "./Actions";
import SearchArea from "./SearchArea";

const Header: React.FC<{ search?: boolean }> = ({ search = true }) => {
  const { data: user } = useSession();
  const [opened, setOpened] = useState(false);

  const [control, setControl] = useState<HTMLDivElement | null>(null);
  const [dropdown, setDropdown] = useState<HTMLDivElement | null>(null);
  const [menu, setMenu] = useState<boolean>(false);

  useClickOutside<HTMLDivElement>(() => setOpened(false), null, [
    control,
    dropdown,
  ]);

  return (
    <header className="sticky left-0 top-0 z-50 w-full border-b border-border-light bg-white dark:border-border dark:bg-primary">
      <div className="mx-auto flex max-w-[1550px] items-center justify-between gap-4 px-4 py-2 md:py-4">
        <div className="flex flex-1 items-center justify-between gap-8 md:gap-4">
          <div className="flex items-center justify-center gap-4">
            <button
              role="button"
              aria-label="Home"
              className="btn-icon flex h-10 w-10 lg:hidden"
              onClick={() => setMenu((prev) => !prev)}
            >
              <Menu className="h-5 w-5 stroke-black dark:stroke-white" />
            </button>

            <HamburgerMenu menu={menu} setMenu={setMenu} />

            <Link href={"/"}>
              <Logo className="hidden h-6 fill-secondary md:block" />
              <LogonoText className="block h-7 fill-secondary md:hidden" />
            </Link>
          </div>
          {search && <SearchArea />}
        </div>

        <div className="flex items-center gap-2">
          <Actions />

          <div className="relative rounded-full">
            <div ref={setControl}>
              <Image
                src={user?.user.image ?? "/static/default_user.avif"}
                alt={user?.user.name ?? "user"}
                width={180}
                height={180}
                className="h-7 w-7 cursor-pointer select-none overflow-hidden rounded-full md:h-8 md:w-8 lg:h-9 lg:w-9"
                onClick={() => setOpened((prev) => !prev)}
                draggable={false}
              />
            </div>

            {opened &&
              (!!user ? (
                <ProfileDropdown
                  setOpened={setOpened}
                  user={user}
                  ref={setDropdown}
                />
              ) : (
                <UnAuthenticatedProfileDropdown ref={setDropdown} />
              ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
