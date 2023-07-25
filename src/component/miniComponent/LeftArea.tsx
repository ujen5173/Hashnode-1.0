import Link from "next/link";
import { useState } from "react";
import { Hamburger, Logo, LogonoText } from "~/svgs";
import { HamburgerMenu } from "../aside";

const LeftArea = () => {
  const [menu, setMenu] = useState<boolean>(false);

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        aria-label="menu icon"
        role="button"
        className="btn-icon flex h-10 w-10 lg:hidden"
        onClick={() => setMenu((prev) => !prev)}
      >
        <Hamburger className="h-5 w-5 fill-black dark:fill-white" />
      </button>

      <HamburgerMenu menu={menu} setMenu={setMenu} />

      <Link aria-label="Go to Home Page" href={"/"}>
        <Logo className="hidden h-6 fill-secondary md:block" />
        <LogonoText className="block h-7 fill-secondary md:hidden" />
      </Link>
    </div>
  );
};

export default LeftArea;
