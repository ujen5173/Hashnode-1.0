import { useClickOutside } from "@mantine/hooks";
import Link from "next/link";
import { useContext, useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import { Notification as NotificationSVG, Pen, Sun, Updates } from "~/svgs";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import Notification from "./Notification";

const RightArea: FC = () => {
  const { user, handleTheme } = useContext(C) as ContextValue;
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpened(false));
  const [count, setCount] = useState(0);

  // notifications are refetched every 15 seconds
  const { data, error } = api.notifications.getCount.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchInterval: 15000, // 15 seconds
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

  return (
    <>
      {!!user && (
        <>
          <Link href={"/new"}>
            <button
              aria-label="icon"
              role="button"
              className="btn-filled hidden items-center justify-center gap-2 hover:bg-blue-500 sm:flex"
            >
              <Pen className="h-4 w-4 fill-white stroke-white" />
              <span>Write</span>
            </button>
          </Link>
          <div className="block sm:hidden">
            <Link href={"/new"}>
              <button
                aria-label="icon"
                role="button"
                className="btn-icon flex h-10 w-10 xl:hidden"
              >
                <Pen className="h-5 w-5 stroke-gray-700 dark:stroke-text-primary" />
              </button>
            </Link>
          </div>
        </>
      )}
      <button
        aria-label="icon"
        role="button"
        className="btn-icon hidden h-10 w-10 xl:flex"
      >
        <Updates className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-primary" />
      </button>

      <button
        aria-label="icon"
        role="button"
        className="btn-icon flex h-10 w-10"
        onClick={handleTheme}
      >
        <Sun className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-primary" />
      </button>
      <div className="relative">
        <button
          onClick={() => setOpened((prev) => !prev)}
          aria-label="icon"
          role="button"
          className="btn-icon hidden h-10 w-10 sm:flex"
        >
          <NotificationSVG className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-primary" />
        </button>
        <div className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red text-xs text-white">
          <span className="text-xs">{count}</span>
        </div>
        {opened && (
          <div
            ref={ref}
            className="absolute right-0 top-full z-50 mt-2 hidden sm:block"
          >
            <Notification />
          </div>
        )}
      </div>
    </>
  );
};

export default RightArea;
