import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo, LogonoText } from "~/svgs";
import { HamburgerMenu } from "../aside";

const LeftArea = () => {
  const [menu, setMenu] = useState<boolean>(false);

  return (
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
  );
};

export default LeftArea;
