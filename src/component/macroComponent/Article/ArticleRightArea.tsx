import { Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { Bell, Check, Plus, Search, Settings, Sun } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import {
  ArticleProfileDropdown,
  NotAuthenticatedProfileDropdown,
} from "~/component/dropdown";
import { Notification } from "~/component/miniComponent";
import { FollowContext } from "~/pages/u/[username]/[slug]";
import { api } from "~/utils/api";
import { C } from "~/utils/context";

type UserType = {
  username: string;
  name: string;
  id: string;

  image: string | null;
  followers: { userId: string }[];
};
const ArticleRightArea: FC<{ user: UserType }> = ({ user: author }) => {
  const { handleTheme, setSearchOpen } = useContext(C)!;
  const { following, setFollowing } = useContext(FollowContext) as {
    following: boolean;
    setFollowing: React.Dispatch<React.SetStateAction<boolean>>;
  };

  const { data: follow } = api.users.followState.useQuery(
    {
      username: author.username,
    },
    {
      enabled: !!author.username,
      refetchOnWindowFocus: false,
    },
  );

  const { data: user } = useSession();
  useEffect(() => {
    if (follow !== undefined) {
      setFollowing(follow.following);
    }
  }, [follow]);

  const [count, setCount] = useState(0);

  const [opened, setOpened] = useState(false); // notification dropdown state
  const [control, setControl] = useState<HTMLDivElement | null>(null);
  const [dropdown, setDropdown] = useState<HTMLDivElement | null>(null);

  useClickOutside<HTMLDivElement>(() => setOpened(false), null, [
    control,
    dropdown,
  ]);

  const [notificationOpened, setNotificationOpened] = useState(false); // notification dropdown state
  const [notificationControl, setNotificationControl] =
    useState<HTMLDivElement | null>(null);
  const [notificationDropdown, setNotificationDropdown] =
    useState<HTMLDivElement | null>(null);

  useClickOutside<HTMLDivElement>(() => setNotificationOpened(false), null, [
    notificationControl,
    notificationDropdown,
  ]);

  // notifications are refetched every 15 seconds
  const { data, error } = api.notifications.getCount.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchInterval: 15000, // 15 seconds
    enabled: !!user,
    retry: 0,
  });

  const { mutate } = api.notifications.markAsRead.useMutation(); // mark all notifications as read when notification popup is opened

  useEffect(() => {
    if (opened) {
      mutate();
      setCount(0);
    }
  }, [opened]);

  useEffect(() => {
    if (error) {
      toast.error("Error Fetching Notifications State");
    }
    setCount(+(data?.count ?? 0));
  }, [error, data]);

  const { mutate: followToggle } = api.users.followUser.useMutation();

  const followUser = () => {
    if (!user) {
      toast.error("You need to be logged in to follow a user");
      return;
    }

    setFollowing((prev) => !prev);

    followToggle({
      userId: author.id,
    });
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Tooltip label="Search" position="bottom" withArrow>
        <button
          aria-label="icon"
          role="button"
          className="btn-icon hidden h-10 w-10 lg:flex"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-secondary" />
        </button>
      </Tooltip>

      <Tooltip label="Toggle Theme" position="bottom" withArrow>
        <button
          aria-label="icon"
          role="button"
          className="btn-icon flex h-10 w-10"
          onClick={handleTheme}
        >
          <Sun className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-secondary" />
        </button>
      </Tooltip>

      <div className="relative hidden sm:block">
        <Tooltip label="Notifications" position="bottom" withArrow>
          <div className="relative" ref={setNotificationControl}>
            <button
              onClick={() => setNotificationOpened((prev) => !prev)}
              aria-label="icon"
              role="button"
              className="btn-icon flex h-10 w-10"
            >
              <Bell className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-secondary" />
            </button>

            {count > 0 && (
              <div className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red text-xs text-white">
                <span className="text-xs">{count}</span>
              </div>
            )}
          </div>
        </Tooltip>

        {notificationOpened && (
          <div
            ref={setNotificationDropdown}
            className="absolute -right-2 top-full z-50 mt-2"
          >
            <Notification />
          </div>
        )}
      </div>

      <div className="hidden md:block">
        {user?.user.username === author?.username ? (
          <Link href={`/${user?.user.id}/dashboard`}>
            <button className="btn-filled flex w-full items-center justify-center gap-2 text-secondary md:w-max">
              <Settings className="h-5 w-5 stroke-white" />
              Dashboard
            </button>
          </Link>
        ) : (
          <button
            onClick={() => void followUser()}
            className="btn-outline flex w-full items-center justify-center gap-2 text-secondary md:w-max"
          >
            {following ? (
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
        )}
      </div>

      <button
        aria-label="image"
        role="button"
        className="relative rounded-full"
      >
        <div ref={setControl}>
          <Image
            src={user?.user.image ?? "/static/default_user.avif"}
            alt={user?.user.name ?? "Guest User"}
            width={100}
            height={100}
            draggable={false}
            className="h-9 w-9 overflow-hidden rounded-full"
            onClick={() => setOpened((prev) => !prev)}
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
  );
};

export default ArticleRightArea;
