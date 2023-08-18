import { Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState, type FC } from "react";
import { v4 as uuid } from "uuid";
import { type BlogSocial } from "~/pages/dev/[username]";
import {
  Angleleft,
  Check,
  Dailydev,
  Follow,
  Github,
  Global,
  Hamburger,
  Instagram,
  Linkedin,
  Mastodon,
  Search,
  Settings,
  Sun,
  Twitter,
  Youtube,
} from "~/svgs";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import { ArticleHamburgerMenu } from "../aside";
import {
  ArticleProfileDropdown,
  NotAuthenticatedProfileDropdown,
} from "../dropdown";

interface Props {
  user: {
    name: string;
    username: string;
    profile: string;
    handle: {
      handle: string;
      name: string;
      social: BlogSocial;
    };
    followers: { id: string }[];
  };
}

const AuthorBlogHeader: FC<Props> = ({ user: author }) => {
  const {
    handleTheme,
    setSearchOpen
  } = useContext(C) as ContextValue;
  const { mutate: followToggle } = api.users.followUserToggle.useMutation();

  const [following, setFollowing] = useState(false);

  const followUser = () => {
    setFollowing(prev => !prev);

    followToggle({
      username: author.username,
    });
  }

  const [opened, setOpened] = useState(false);
  const [menu, setMenu] = useState(false);
  const [control, setControl] = useState<HTMLDivElement | null>(null);
  const [dropdown, setDropdown] = useState<HTMLDivElement | null>(null);
  const { data: user } = useSession();

  useClickOutside<HTMLDivElement>(() => setOpened(false), null, [
    control,
    dropdown,
  ]);

  useEffect(() => {
    if (author && user) {
      setFollowing(author.followers.find((e) => e.id === user?.user.id)
        ? true
        : false);
    }
  }, [user, author]);

  return (
    <header className="border-b border-border-light bg-white px-2 dark:border-border dark:bg-primary sm:px-4 lg:border-none">
      <div className="container mx-auto p-2 sm:px-4">
        <nav className="flex w-full items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <div className="block sm:hidden">
              <button
                arial-label="Hamburger Menu"
                role="button"
                onClick={() => setMenu(true)}
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

            <div className="">
              <Link href="/">
                <button
                  arial-label="Back to home Menu"
                  role="button"
                  className="btn-icon-large flex"
                >
                  <Angleleft className="h-6 w-6 fill-gray-700 dark:fill-text-secondary" />
                </button>
              </Link>

              <ArticleHamburgerMenu
                user={user?.user || null}
                menu={menu}
                setMenu={setMenu}
              />
            </div>

            <div className="hidden sm:block">
              <Link
                href={`/u/@${author.username}`}
                className="flex items-center gap-2"
              >
                <Image
                  src={author.profile}
                  alt={author.name}
                  width={100}
                  height={100}
                  className="h-10 w-10 cursor-pointer select-none overflow-hidden rounded-full"
                  draggable={false}
                />

                <h3 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
                  {author.name}&apos;s Blog
                </h3>
              </Link>
            </div>
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
              <div ref={setControl}>
                <Image
                  src={user?.user.profile || "/default_user.avif"}
                  alt={user?.user.name || "user"}
                  width={100}
                  height={100}
                  className="h-10 w-10 cursor-pointer select-none overflow-hidden rounded-full"
                  onClick={() => setOpened((prev) => !prev)}
                  draggable={false}
                />
              </div>

              {opened &&
                (!!user ? (
                  <ArticleProfileDropdown ref={setDropdown} />
                ) : (
                  <NotAuthenticatedProfileDropdown ref={setDropdown} />
                ))}
            </button>
          </div>
        </nav>

        <section className="flex w-full flex-col sm:py-4">
          <div className="m-4 block sm:hidden">
            <h1 className="text-center text-xl font-semibold text-gray-700 dark:text-text-secondary sm:text-2xl">
              {author.name}&apos;s Blog
            </h1>
          </div>

          <div className="flex w-full flex-col items-center justify-between sm:flex-row-reverse">
            <div className="mb-4 flex w-full items-center justify-center gap-2 sm:mb-0 sm:w-auto">
              {user?.user.username === author.username ? (
                <Link href={`/${user?.user.id}/dashboard`}>
                  <button className="btn-filled flex w-auto items-center justify-center gap-2 text-secondary md:w-max">
                    <Settings className="h-5 w-5 fill-white" />
                    Dashboard
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => void followUser()}
                  className="btn-outline flex w-auto items-center justify-center gap-2 text-secondary md:w-max"
                >
                  {following ? (
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

            <div className="flex items-center justify-center">
              {author.handle.social &&
                Object.entries(author.handle.social)
                  .filter((e) => e[0] !== "handle" && e[1] !== "")
                  .map((e) => {
                    const iconStyle =
                      "h-5 w-5 fill-gray-500 dark:fill-text-primary";
                    const social = {
                      twitter: <Twitter className={iconStyle} />,
                      github: <Github className={iconStyle} />,
                      linkedin: <Linkedin className={iconStyle} />,
                      mastodon: <Mastodon className={iconStyle} />,
                      instagram: <Instagram className={iconStyle} />,
                      website: <Global className={iconStyle} />,
                      youtube: <Youtube className={iconStyle} />,
                      dailydev: <Dailydev className={iconStyle} />,
                    };

                    return (
                      <a target="_blank" key={uuid()} href={e[1] as string}>
                        <button className="btn-icon-large flex">
                          {social[e[0] as keyof typeof social]}
                        </button>
                      </a>
                    );
                  })}
            </div>
          </div>
        </section>
      </div>
    </header>
  );
};
export default AuthorBlogHeader;
