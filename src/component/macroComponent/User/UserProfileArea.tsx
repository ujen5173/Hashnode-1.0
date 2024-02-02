import { Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import {
  AlertOctagon,
  Check,
  ChevronDown,
  Linkedin,
  Plus,
  Share,
  Twitter,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import { type DetailedUser } from "~/types";
import { api } from "~/utils/api";

const UserimageArea: FC<{
  userDetails: DetailedUser | undefined;
}> = ({ userDetails }) => {
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpened(false));
  const [opened2, setOpened2] = useState(false);
  const ref2 = useClickOutside<HTMLDivElement>(() => setOpened2(false));
  const { data: user } = useSession();

  const { mutate: follow } = api.users.followUser.useMutation();

  const [following, setFollowing] = useState({
    status: false,
    followerCount: 0,
  });

  useEffect(() => {
    setFollowing({
      status: userDetails?.isFollowing ?? false,
      followerCount: userDetails?.followersCount ?? 0,
    });
  }, [userDetails]);

  const followUser = () => {
    if (!user) {
      return toast.error("You need to be logged in to follow users");
    }

    setFollowing((prev) => ({
      ...prev,
      status: !prev.status,
      followerCount: prev.status
        ? prev.followerCount - 1
        : prev.followerCount + 1,
    }));

    if (userDetails) {
      follow({
        userId: userDetails.id,
      });
    }
  };

  return (
    <div className="mb-10 flex flex-col gap-8 md:flex-row">
      <div className="h-28 w-28 overflow-hidden rounded-full bg-light-bg dark:bg-primary-light md:h-32 md:w-32 lg:h-36 lg:w-36 xl:h-40 xl:w-40">
        <Image
          src={userDetails?.image ?? ""}
          alt={userDetails?.name ?? ""}
          width={160}
          height={160}
          decoding="async"
          className="h-full w-full rounded-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col items-start gap-4 lg:flex-row">
        <div className="flex w-full flex-1 items-start justify-between">
          <div>
            <div className="mb-3 md:mb-5">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-text-secondary md:text-2xl">
                  {userDetails?.name}
                </h3>
                {userDetails?.stripeSubscriptionStatus === "active" && (
                  <Tooltip
                    label="Hashnode Clone Pro User"
                    position="bottom"
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "400",
                      letterSpacing: "0.5px",
                    }}
                  >
                    <span className="rounded-md border border-border-light bg-light-bg px-2 py-1 text-xs font-semibold tracking-wider text-gray-700 dark:border-border dark:bg-primary-light dark:text-text-secondary">
                      PRO
                    </span>
                  </Tooltip>
                )}
              </div>

              <p className="text-base font-medium text-gray-500 dark:text-text-primary lg:text-lg">
                @{userDetails?.username}
              </p>
            </div>

            <p className="mb-3 text-base font-medium text-gray-500 dark:text-text-primary md:mb-5">
              {userDetails?.tagline}
            </p>

            <div className="flex gap-4 text-gray-700 dark:text-text-primary">
              <Link href={`/u/@${userDetails?.username}/followers`}>
                <span className="hover:underline">
                  <span className="font-medium">
                    {Intl.NumberFormat("en-US", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(following?.followerCount ?? 0)}{" "}
                  </span>
                  Follower
                </span>
              </Link>

              <Link href={`/u/@${userDetails?.username}/following`}>
                <span className="hover:underline">
                  <span className="font-medium">
                    {Intl.NumberFormat("en-US", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(userDetails?.followingCount ?? 0)}{" "}
                  </span>
                  Following
                </span>
              </Link>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setOpened(true)}
                className="btn-icon-outline"
              >
                <Share className="h-5 w-5 stroke-gray-700 dark:stroke-text-secondary" />
              </button>

              {opened && (
                <div
                  ref={ref as React.MutableRefObject<HTMLDivElement>}
                  className="absolute right-0 top-full z-50 mt-2 rounded-md border border-border-light shadow-lg dark:border-border"
                >
                  <ul className="w-40 overflow-hidden rounded-md bg-white dark:bg-black">
                    <li className="w-full text-base font-semibold text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-primary-light">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://twitter.com/intent/tweet?text=${process.env.NEXT_PUBLIC_VERCEL_URL!
                          }/u/@${userDetails?.username ?? ""}`}
                      >
                        <button className="flex w-full items-center justify-center gap-2 p-4 text-left">
                          <span>
                            <Twitter className="h-6 w-6 fill-twitterColor stroke-none" />
                          </span>

                          <span>Twitter</span>
                        </button>
                      </a>
                    </li>

                    <li className="w-full text-base font-semibold text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-primary-light">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${process.env.NEXT_PUBLIC_VERCEL_URL!
                          }/u/@${userDetails?.username ?? ""}`}
                      >
                        <button className="flex w-full items-center justify-center gap-2 p-4 text-left">
                          <span>
                            <Linkedin className="h-6 w-6 stroke-linkedinColor" />
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
                <ChevronDown className="h-6 w-6 stroke-gray-700 dark:stroke-text-secondary" />
              </button>

              {opened2 && (
                <div
                  ref={ref2 as React.MutableRefObject<HTMLDivElement>}
                  className="absolute right-0 top-full z-50 mt-2 block overflow-hidden rounded-md border border-border-light shadow-lg dark:border-border"
                >
                  <ul className="w-max bg-white dark:bg-black">
                    <li className="w-full p-4 text-base font-semibold text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-primary-light">
                      <button className="flex w-full items-center justify-center gap-2 pr-8 text-left">
                        <span>
                          <AlertOctagon className="h-6 w-6 stroke-twitterColor" />
                        </span>

                        <span>Report this Profile</span>
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
          <div className="max-w-[250px]">
            <button
              onClick={() => void followUser()}
              className="btn-outline flex w-full items-center justify-center gap-2 text-secondary md:w-max"
            >
              {following.status ? (
                <>
                  <Check className="h-5 w-5 stroke-secondary" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 stroke-secondary" />
                  <span>Follow User</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserimageArea;
