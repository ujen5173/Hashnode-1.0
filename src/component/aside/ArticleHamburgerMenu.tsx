import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { Times } from "~/svgs";
import { type UserSimple } from "~/types";
import { HashnodeSocials } from "~/utils/constants";

interface Props {
  user: UserSimple | null;
  menu: boolean;
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const ArticleHamburgerMenu: FC<Props> = ({ user, menu, setMenu }) => {
  return (
    <>
      <div
        onClick={() => setMenu(false)}
        className={`fixed inset-0 z-20 bg-gray-400 bg-opacity-40 ${menu ? "block" : "hidden"
          }`}
      />
      <section
        className={`hamburger_menu ${menu ? "active" : "inactive"
          } fixed left-0 top-0 z-50 h-screen w-full max-w-[18rem] overflow-auto md:max-w-[20rem]`}
      >
        <div className="flex min-h-[100dvh] w-full flex-col">
          <header className="flex items-center justify-between border-b border-border border-border-light bg-light-bg p-6 shadow-md dark:border-border dark:bg-primary">
            <Link className="flex items-center gap-2" href="/">
              <Image
                src={user?.profile || "/default_user.avif"}
                alt={user?.name || "User"}
                className="h-10 w-10 rounded-full object-cover"
                width={180}
                height={180}
              />

              {user?.name && (
                <h1 className="text-lg font-medium text-gray-700 dark:text-text-secondary">
                  {user?.name}&rsquo;s Blog
                </h1>
              )}
            </Link>

            <button
              aria-label="Close Hambuger Menu"
              onClick={() => setMenu(false)}
              className="btn-icon-large flex"
            >
              <Times className="h-5 w-5 fill-gray-700 dark:fill-text-secondary" />
            </button>
          </header>

          <section className="flex flex-1 flex-col bg-light-bg shadow-md dark:bg-primary">
            <div className="flex flex-1 flex-col py-4">
              <h1 className="mb-4 px-6 py-2 text-sm font-medium tracking-wide text-gray-700 dark:text-text-secondary">
                BLOG MENU
              </h1>

              <ul className="mb-4 border-b border-border-light px-4 pb-4 dark:border-border">
                {["Home", "Badges"].map((item, index) => (
                  <li key={index}>
                    <Link href={`/${item.toLowerCase()}`}>
                      <div className="rounded-md px-6 py-3 text-base font-medium tracking-wide text-gray-700 hover:bg-gray-200 dark:text-text-secondary dark:hover:bg-primary-light">
                        {item}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              <h1 className="mb-4 px-6 py-2 text-base font-medium tracking-wide text-gray-700 dark:text-text-secondary">
                BLOG SOCIALS
              </h1>

              <ul className="mb-4 flex flex-wrap gap-2 border-b border-border-light px-4 pb-4 dark:border-primary-light">
                {HashnodeSocials.map((item, index) => (
                  <li key={index}>
                    <a
                      target="_blank"
                      className="btn-icon-large flex"
                      href={`/${item.link}`}
                      aria-label={`Follow us on ${item.name}`}
                      title={`Follow us on ${item.name}`}
                    >
                      {item.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default ArticleHamburgerMenu;
