import { Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import {
  ArticleProfileDropdown,
  NotAuthenticatedProfileDropdown
} from "~/component/dropdown";
import { Notification } from "~/component/miniComponent";
import { FollowContext } from "~/pages/u/[username]/[slug]";
import {
  Check,
  Follow,
  Notification as NotificationSVG,
  Search,
  Settings,
  Sun
} from "~/svgs";
import { type UserSimple } from "~/types";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";

const ArticleRightArea: FC<{ user: UserSimple }> = ({ user: author }) => {
  const { handleTheme, setSearchOpen } = useContext(C) as ContextValue;
  const { following, setFollowing } = useContext(FollowContext) as {
    following: boolean;
    setFollowing: React.Dispatch<React.SetStateAction<boolean>>
  };
  const { data: user } = useSession();
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
    setCount(data || 0);
  }, [error, data]);

  const { mutate: followToggle } = api.users.followUserToggle.useMutation();

  const followUser = () => {
    if (!user) {
      toast.error("You need to be logged in to follow a user");
      return;
    }

    setFollowing((prev) => !prev);

    followToggle({
      username: author.username,
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
              <NotificationSVG className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-secondary" />
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
              <Settings className="h-5 w-5 fill-white" />
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

      <button
        aria-label="profile"
        role="button"
        className="relative rounded-full"
      >
        <div ref={setControl}>
          <Image
            src={user?.user.profile || "/default_user.avif"}
            alt={user?.user.name || "Guest User"}
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
