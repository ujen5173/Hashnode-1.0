import React, { useContext, useState, type FC } from "react";
import Image from "next/image";
import {
  Angledown,
  Check,
  Follow,
  Linkedin,
  ProfileShare,
  Report,
  Twitter,
} from "~/svgs";
import { useClickOutside } from "@mantine/hooks";
import { C, type ContextValue } from "~/utils/context";
import Link from "next/link";
import { type UserDetailsInterface } from "~/pages/u/[username]";

const UserProfileArea: FC<{
  userDetails: UserDetailsInterface | undefined;
}> = ({ userDetails }) => {
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpened(false));
  const [opened2, setOpened2] = useState(false);
  const ref2 = useClickOutside<HTMLDivElement>(() => setOpened2(false));
  const { user, following, followUser } = useContext(C) as ContextValue;

  return (
    <div className="mb-10 flex flex-col gap-8 md:flex-row">
      <div className="h-40 w-40 overflow-hidden rounded-full bg-light-bg dark:bg-primary-light">
        <Image
          src={userDetails?.profile || ""}
          alt={userDetails?.name || ""}
          width={100}
          className="h-full w-full rounded-full object-cover"
          height={100}
        />
      </div>

      <div className="flex flex-1 flex-col items-start gap-4 lg:flex-row">
        <div className="flex w-full flex-1 items-start justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-gray-700 dark:text-text-secondary">
              {userDetails?.name}
            </h1>
            <p className="mb-6 text-base font-medium text-gray-500 dark:text-text-primary">
              {userDetails?.tagline}
            </p>
            <div className="flex gap-4 text-gray-700 dark:text-text-primary">
              <span>
                {Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(+following.followersCount || 0)}{" "}
                Follower
              </span>
              <span>
                {Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(userDetails?.followingCount || 0)}{" "}
                Following
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setOpened(true)}
                className="btn-icon-outline"
              >
                <ProfileShare className="h-5 w-5 fill-gray-700 dark:fill-text-secondary" />
              </button>
              {opened && (
                <div
                  ref={ref}
                  className="absolute right-0 top-full z-50 mt-2 hidden sm:block"
                >
                  <ul className="w-40 overflow-hidden rounded-md bg-white dark:bg-black">
                    <li className="w-full text-base font-semibold text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-primary-light">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://twitter.com/intent/tweet?text=${
                          process.env.NEXT_PUBLIC_VERCEL_URL as string
                        }/u/@${userDetails?.username || ""}`}
                      >
                        <button className="flex w-full items-center justify-center gap-2 p-4 text-left">
                          <span>
                            <Twitter className="h-6 w-6 fill-twitterColor" />
                          </span>
                          <span>Twitter</span>
                        </button>
                      </a>
                    </li>
                    <li className="w-full text-base font-semibold text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-primary-light">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://linkedin.com/post?text=${
                          process.env.NEXT_PUBLIC_VERCEL_URL as string
                        }/u/@${userDetails?.username || ""}`}
                      >
                        <button className="flex w-full items-center justify-center gap-2 p-4 text-left">
                          <span>
                            <Linkedin className="h-6 w-6 fill-linkedinColor" />
                          </span>
                          <span>Linkedin</span>
                        </button>
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setOpened2(true)}
                className="btn-icon-outline"
              >
                <Angledown className="h-6 w-6 fill-gray-700 dark:fill-text-secondary" />
              </button>
              {opened2 && (
                <div
                  ref={ref2}
                  className="absolute right-0 top-full z-50 mt-2 hidden sm:block"
                >
                  <ul className="w-max overflow-hidden rounded-md bg-white dark:bg-black">
                    <li className="w-full p-4 text-base font-semibold text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-primary-light">
                      <button className="flex w-full items-center justify-center gap-2 pr-8 text-left">
                        <span>
                          <Report className="h-6 w-6 fill-twitterColor" />
                        </span>
                        <span>Report this profile</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {user?.user.username === userDetails?.username ? (
          <Link href={"/settings"}>
            <button className="btn-outline flex w-full items-center justify-center gap-2 text-secondary md:w-max">
              Edit Profile
            </button>
          </Link>
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
  );
};

export default UserProfileArea;
