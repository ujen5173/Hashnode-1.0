import { Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState, type FC } from "react";
import {
  Check,
  Follow,
  Github,
  Hamburger,
  Linkedin,
  LogonoText,
  Search,
  Settings,
  Sun,
  Twitter,
} from "~/svgs";
import { C, type ContextValue } from "~/utils/context";
import ArticleHamburgerMenu from "./ArticleHamburgerMenu";
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
  const [menu, setMenu] = useState(false);
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
    <header className="border-b border-border-light bg-white px-2 dark:border-border dark:bg-primary sm:px-4 lg:border-none">
      <div className="container mx-auto px-2 pb-2 pt-8 sm:px-4">
        <nav className="flex w-full items-center justify-between py-2">
          <div className="block lg:hidden">
            <button
              arial-label="Hamburger Menu"
              role="button"
              onClick={() => setOpened(true)}
              className="btn-icon-large flex"
            >
              <Hamburger className="h-6 w-6 fill-gray-700 dark:fill-text-secondary" />
            </button>
            <ArticleHamburgerMenu
              user={user?.user || null}
              menu={menu}
              setMenu={setMenu}
            />
          </div>
          <div className="hidden lg:block">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={author.profile}
                alt={author.name}
                width={100}
                height={100}
                className="h-10 w-10 cursor-pointer select-none overflow-hidden rounded-full"
                draggable={false}
              />

              <h3 className="text-2xl font-semibold text-gray-700 dark:text-text-secondary">
                {author.name}&apos;s Blog
              </h3>
            </Link>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Tooltip label="Search" position="bottom" withArrow>
              <button
                aria-label="Search Hashnode"
                role="button"
                className="btn-icon flex h-10 w-10"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-6 w-6 fill-none stroke-gray-700 dark:stroke-text-secondary" />
              </button>
            </Tooltip>
            <Tooltip label="Toggle Theme" position="bottom" withArrow>
              <button
                aria-label="Toggle Theme"
                role="button"
                className="btn-icon flex h-10 w-10"
                onClick={handleTheme}
              >
                <Sun className="h-6 w-6 fill-none stroke-gray-700 dark:stroke-text-secondary" />
              </button>
            </Tooltip>
            <button
              aria-label="User Profile"
              role="button"
              className="relative rounded-full"
              style={{ cursor: "default!important" }}
            >
              <Image
                src={user?.user.profile || "/default_user.avif"}
                alt={user?.user.name || "user"}
                width={100}
                height={100}
                className="h-10 w-10 cursor-pointer select-none overflow-hidden rounded-full"
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
        </nav>

        <section className="flex w-full flex-col lg:pb-4 lg:pt-8">
          <div className="m-4 block lg:hidden">
            <h1 className="text-center text-2xl font-semibold text-gray-700 dark:text-text-secondary sm:text-3xl">
              {author.name}&apos;s Blog
            </h1>
          </div>

          <div className="flex w-full flex-col items-center justify-between lg:flex-row-reverse">
            <div className="mb-4 flex w-full items-center justify-center gap-2 lg:mb-0 lg:w-auto">
              {user?.user.username === author.username ? (
                <button className="btn-filled flex w-auto items-center justify-center gap-2 text-secondary md:w-max">
                  <Settings className="h-5 w-5 fill-white" />
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => void followUser()}
                  className="btn-outline flex w-auto items-center justify-center gap-2 text-secondary md:w-max"
                >
                  {following.status ? (
                    <>
                      <Check className="h-5 w-5 fill-secondary" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <Follow className="h-5 w-5 fill-secondary" />
                      <span>Follow User</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="flex items-center justify-center gap-2">
              <button className="btn-icon-large flex">
                <Twitter className="h-6 w-6 fill-text-secondary dark:fill-text-primary" />
              </button>
              <button className="btn-icon-large flex">
                <Github className="h-6 w-6 fill-text-secondary dark:fill-text-primary" />
              </button>
              <button className="btn-icon-large flex">
                <LogonoText className="h-6 w-6 fill-text-secondary dark:fill-text-primary" />
              </button>
              <button className="btn-icon-large flex">
                <Linkedin className="h-6 w-6 fill-text-secondary dark:fill-text-primary" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </header>
  );
};
export default AuthorBlogHeader;
