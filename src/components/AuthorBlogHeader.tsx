import { Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState, type FC } from "react";
import { Check, Follow, Logo, LogonoText, Search, Settings, Sun } from "~/svgs";
import { C, type ContextValue } from "~/utils/context";
import ArticleProfileDropdown from "./ArticleProfileDropdown";
import NotAuthenticatedProfileDropdown from "./NotAuthenticatedProfileDropdown";

const AuthorBlogHeader: FC<{
  user: {
    name: string;
    username: string;
    profile: string;
    followers: { id: string }[];
  };
}> = ({ user: author }) => {
  const {
    user,
    handleTheme,
    setSearchOpen,
    following,
    setFollowing,
    followUser,
  } = useContext(C) as ContextValue;
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpened(false));

  useEffect(() => {
    if (author && user) {
      setFollowing({
        status: author.followers.find((e) => e.id === user?.user.id)
          ? true
          : false,
        followersCount: "", // not needed!
      });
    }
  }, [user, author]);

  return (
    <header className="bg-white px-4 py-6 dark:bg-primary">
      <div className="mx-auto flex max-w-[1300px] items-center justify-between py-2">
        <div className="flex items-center gap-2">
          {author && (
            <Link
              href={`/u/@${author.username}`}
              className="flex items-center gap-2"
            >
              <Image
                src={author.profile}
                className="h-10 w-10 rounded-full object-cover"
                width={50}
                height={50}
                alt={`${author.username}'s Blog`}
              />
              <h1 className="text-base font-semibold  text-gray-700 dark:text-text-secondary md:text-lg">
                {author.username}&apos;s Blog
              </h1>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/">
            <Logo className="h-7 fill-secondary" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip label="Search" position="bottom" withArrow>
            <button
              aria-label="icon"
              role="button"
              className="btn-icon hidden h-10 w-10 lg:flex"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-primary" />
            </button>
          </Tooltip>
          <Tooltip label="Toggle Theme" position="bottom" withArrow>
            <button
              aria-label="icon"
              role="button"
              className="btn-icon flex h-10 w-10"
              onClick={handleTheme}
            >
              <Sun className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-primary" />
            </button>
          </Tooltip>
          <button
            aria-label="icon"
            role="button"
            className="relative rounded-full"
            style={{ cursor: "default!important" }}
          >
            <Image
              src={user?.user.profile || "/default_user.avif"}
              alt={user?.user.name || "user"}
              width={100}
              height={100}
              className="h-7 w-7 cursor-pointer select-none overflow-hidden rounded-full md:h-8 md:w-8 lg:h-9 lg:w-9"
              onClick={() => setOpened(true)}
              draggable={false}
            />
            {opened &&
              (!!user ? (
                <ArticleProfileDropdown ref={ref} />
              ) : (
                <NotAuthenticatedProfileDropdown ref={ref} />
              ))}
          </button>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1300px] items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Link href="/">
            <LogonoText className="h-5 w-5 fill-gray-700 dark:fill-text-secondary" />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {user?.user.username === author.username ? (
            <button className="btn-filled flex w-full items-center justify-center gap-2 text-secondary md:w-max">
              <Settings className="h-5 w-5 fill-white" />
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => void followUser()}
              className="btn-outline flex w-full items-center justify-center gap-2 text-secondary md:w-max"
            >
              {following.status ? (
                <>
                  <Check className="h-5 w-5 fill-secondary" />
                  Following
                </>
              ) : (
                <>
                  <Follow className="h-5 w-5 fill-secondary" />
                  Follow User
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
export default AuthorBlogHeader;
