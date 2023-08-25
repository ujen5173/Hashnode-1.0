import { useSession } from "next-auth/react";
import Link from "next/link";
import { type FC } from "react";
import { Logo, Magic, Times } from "~/svgs";
import { asideItems } from "~/utils/constants";

const HamburgerMenu: FC<{
  menu: boolean;
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ menu, setMenu }) => {
  const { data: user } = useSession();

  return (
    <>
      <div
        onClick={() => setMenu(false)}
        className={`fixed inset-0 z-20 bg-gray-400 bg-opacity-40 ${menu ? "block" : "hidden"
          }`}
      />
      <section
        className={`hamburger_menu ${menu ? "active" : "inactive"
          } fixed left-0 top-0 z-50 h-[100dvh] w-full max-w-[16rem] overflow-auto`}
      >
        <div className="flex min-h-[100dvh] w-full flex-col">
          <header className="flex items-center justify-between border-b border-border border-border-light bg-light-bg p-6 py-4 shadow-md dark:border-border dark:bg-primary">
            <Link href="/">
              <Logo className="h-6 fill-secondary" />
            </Link>
            <button
              onClick={() => setMenu(false)}
              aria-label="Close Hambuger Menu"
              className="btn-icon-large flex"
            >
              <Times className="h-5 w-5 fill-gray-700 dark:fill-text-secondary" />
            </button>
          </header>
          <section className="flex flex-1 flex-col bg-light-bg px-4 shadow-md dark:bg-primary">
            <div className="flex flex-1 flex-col py-4">
              <ul className="mb-4 border-b border-border-light pb-4 dark:border-border">
                {asideItems.map((item, index) => (
                  <li key={index}>
                    <Link href={item.href}>
                      <div className="rounded-md px-4 py-3 text-base font-medium tracking-wide text-gray-700 hover:bg-gray-200 dark:text-text-secondary dark:hover:bg-primary-light">
                        {item.name}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex-1">
                <Link href="/">
                  <div className="flex items-center gap-2 rounded-md px-4 py-2 text-base tracking-wide text-gray-700 hover:bg-gray-200 dark:text-text-secondary dark:hover:bg-primary-light">
                    <Magic className="h-5 w-5 fill-secondary" />
                    <span>Rix</span>
                    <button className="400 rounded-full border border-border-light bg-gray-100 px-2 py-1 text-xs font-medium text-secondary dark:border-border dark:bg-border">
                      Upcomming
                    </button>
                  </div>
                </Link>
              </div>
            </div>
            {!user?.user && (
              <div className="mt-16 flex flex-wrap justify-center gap-2 p-4">
                <button className="btn-filled w-full">Sign In</button>
                <button className="btn-outline w-full">Sign Up</button>
              </div>
            )}
          </section>
        </div>
      </section>
    </>
  );
};

export default HamburgerMenu;
