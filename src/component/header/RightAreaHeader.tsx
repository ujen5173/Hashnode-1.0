import { Tooltip } from "@mantine/core";
import { useClickOutside, useViewportSize } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import { Notification as NotificationSVG, Pen, Sun, Updates } from "~/svgs";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import { Notification } from "../miniComponent";

const RightArea: FC = () => {
  const { handleTheme } = useContext(C) as ContextValue;
  const { data: user } = useSession();
  const [opened, setOpened] = useState(false);

  const [control, setControl] = useState<HTMLDivElement | null>(null);
  const [dropdown, setDropdown] = useState<HTMLDivElement | null>(null);

  useClickOutside<HTMLDivElement>(() => setOpened(false), null, [
    control,
    dropdown,
  ]);

  const [count, setCount] = useState(0);
  const { width } = useViewportSize();
  const path = useRouter().pathname;

  // notifications are refetched every 15 seconds
  const { data, error } = api.notifications.getCount.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchInterval: 15000, // 15 seconds
    enabled: !!user,
  });

  useEffect(() => {
    if (opened) {
      setCount(0);
    }
  }, [opened]);

  useEffect(() => {
    if (error) {
      toast.error("Error Fetching Notifications State");
    }
    setCount(data || 0);
  }, [error, data]);

  return (
    <>
      {!!user && (
        <>
          <Link href={user.user.handle ? "/article/new" : "/onboard/blog/setup"}>
            <button
              aria-label="icon"
              role="button"
              className="btn-filled hidden items-center justify-center gap-2 hover:bg-blue-500 sm:flex"
            >
              <Pen className="h-4 w-4 fill-white stroke-white" />
              <span className="text-sm">Write</span>
            </button>
          </Link>

          <div className="block sm:hidden">
            <Link href={user.user.handle ? "/article/new" : "/onboard/blog/setup"}>
              <button
                aria-label="icon"
                role="button"
                className="btn-icon flex h-10 w-10 xl:hidden"
              >
                <Pen className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-secondary" />
              </button>
            </Link>
          </div>
        </>
      )}

      <Tooltip label="Updates" position="bottom" withArrow>
        <button
          aria-label="icon"
          role="button"
          className="btn-icon hidden h-10 w-10 xl:flex"
        >
          <Updates className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-secondary" />
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

      <div className={`relative ${path === "/notifications" ? "hidden" : ""}`}>
        <Tooltip label="Notifications" position="bottom" withArrow>
          <div>
            <div
              onClick={() => setOpened((prev) => !prev)}
              ref={setControl}
              aria-label="icon"
              role="button"
              className="btn-icon hidden h-10 w-10 sm:flex"
            >
              <NotificationSVG className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-secondary" />
            </div>

            <Link
              className="block sm:hidden"
              href={!!user?.user ? "/notifications" : "/onboard"}
            >
              <button
                onClick={() => setOpened((prev) => !prev)}
                aria-label="icon"
                role="button"
                className="btn-icon flex h-10 w-10"
              >
                <NotificationSVG className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-secondary" />
              </button>
            </Link>
          </div>
        </Tooltip>

        {count > 0 && (
          <div className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red text-xs text-white">
            <span className="text-xs">{count}</span>
          </div>
        )}

        {opened && width >= 640 && (
          <div
            ref={setDropdown}
            className="absolute -right-2 top-full z-50 mt-2 hidden sm:block"
          >
            <Notification />
          </div>
        )}
      </div>
    </>
  );
};

export default RightArea;
