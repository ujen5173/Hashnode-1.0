import { ChevronLeft, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, type FC } from "react";
import ArticleHeaderActions from "./ArticleHeaderActions";

type UserType = {
  name: string;
  username: string;
  image: string | null;
};

const ArticleHeader: FC<{ user: UserType }> = ({ user }) => {
  const [menu, setMenu] = useState(false);

  return (
    <header className="w-full border-b border-border-light bg-white dark:border-border dark:bg-primary">
      <div className="mx-auto flex max-w-[1550px] items-center justify-between gap-4 px-4 py-4">
        <div className="flex flex-1 items-center justify-between gap-8 md:gap-4">
          <div className="flex items-center justify-center gap-2">
            <Link href="/">
              <button
                aria-label="icon"
                role="button"
                className="btn-icon flex h-10 w-10"
              >
                <ChevronLeft className="h-5 w-5 stroke-gray-700 dark:stroke-text-secondary" />
              </button>
            </Link>

            <button
              aria-label="icon"
              role="button"
              onClick={() => setMenu((prev) => !prev)}
              className="btn-icon mr-2 flex h-10 w-10"
            >
              <Menu className="h-5 w-5 stroke-gray-700 dark:stroke-text-secondary" />
            </button>

            {/* <ArticleHamburgerMenu user={user} menu={menu} setMenu={setMenu} /> */}

            <Link
              aria-label="Visit image"
              className="hidden items-center gap-2 md:flex"
              href={`/u/@${user.username}`}
            >
              <Image
                src={user?.image ?? ""}
                alt={user?.name}
                width={70}
                height={70}
                draggable={false}
                className="h-8 w-8 rounded-full"
              />
              <h1 className="text-lg font-semibold text-gray-700 dark:text-text-secondary">
                {user?.name}&rsquo;s Blog
              </h1>
            </Link>
          </div>

          <ArticleHeaderActions
            user={
              user as {
                image: string | null;
                name: string;
                id: string;
                followers: { userId: string }[];
                username: string;
              }
            }
          />
        </div>
      </div>
    </header>
  );
};

export default ArticleHeader;
