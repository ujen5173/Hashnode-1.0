import { Tooltip } from "@mantine/core";
import { useClickOutside, useViewportSize } from "@mantine/hooks";
import { Bell, GitBranch, Pencil, Sun } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import { api } from "~/utils/api";
import { C } from "~/utils/context";
import { Notification } from "../miniComponent";

const RightArea: FC = () => {
  const { handleTheme } = useContext(C)!;
  const { data: user } = useSession();
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const [control, setControl] = useState<HTMLDivElement | null>(null);
  const [dropdown, setDropdown] = useState<HTMLDivElement | null>(null);

  useClickOutside<HTMLDivElement>(() => setOpened(false), null, [
    control,
    dropdown,
  ]);

  const [count, setCount] = useState(0);
  const { width } = useViewportSize();

  // notifications are refetched every 15 seconds
  const { data, error } = api.notifications.getCount.useQuery(undefined, {
    refetchOnWindowFocus: false,
    enabled: !!user,
    retry: 0
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
    setCount(+(data?.count ?? 0));
  }, [error, data]);

  return (
    <>
      {!!user && (
        <>
          <Link href={user.user.handle ? "/article/new" : `/onboard/blog/setup?redirect=/article/new`}>
            <button
              aria-label="Write"
              role="button"
              className="btn-filled hidden items-center justify-center gap-2 hover:bg-blue-500 sm:flex"
            >
              <Pencil className="h-4 w-4 fill-none stroke-white" />
              <span className="text-sm">Write</span>
            </button>
          </Link>

          <div className="block sm:hidden">
            <Link href={user.user.handle ? "/article/new" : `/onboard/blog/setup?redirect=/article/new`}>
              <button
                aria-label="icon"
                role="button"
                className="btn-icon flex h-10 w-10 xl:hidden"
              >
                <Pencil className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-secondary" />
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
          <GitBranch className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-secondary" />
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

      <div className={`relative ${router.pathname === "/notifications" ? "hidden" : ""}`}>
        <Tooltip label="Notifications" position="bottom" withArrow>
          <div>
            <div
              onClick={() => setOpened((prev) => !prev)}
              ref={setControl}
              aria-label="icon"
              role="button"
              className="btn-icon hidden h-10 w-10 sm:flex"
            >
              <Bell className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-secondary" />
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
                <Bell className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-secondary" />
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
