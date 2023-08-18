import { type NotificationTypes } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FC } from "react";
import { toast } from "react-toastify";
import useOnScreen from "~/hooks/useOnScreen";
import { api } from "~/utils/api";
import { notificationNavigation } from "~/utils/constants";
import { NotificationLoading } from "../loading";
import ManageData from "./ManageData";

enum Type {
  all = "all",
  new_articles = "new_article",
  comments = "comment",
  likes = "like",
}

const Notification = () => {
  const [notificationType, setNotificationType] = useState<Type>(Type.all);
  const { data: user } = useSession();
  const { mutate } = api.notifications.markAsRead.useMutation(); // mark all notifications as read when notification popup is opened

  useEffect(() => {
    mutate();
  }, []);

  return user ? (
    <div className="relative">
      <div className="absolute -top-2 right-[1.2rem] h-4 w-4 rotate-45 border-l border-t border-border-light bg-white dark:border-border dark:bg-black" />
      <div className="rounded-lg overflow-hidden border border-border-light dark:border-border mt-1 w-full shadow-lg md:w-[35rem]">
        <section className="sticky top-0 left-0 w-full bg-white dark:bg-black z-20 p-4 pb-0">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              Notifications
            </h1>
          </div>

          <header className="relative border-b border-border-light px-4 dark:border-border">
            <div className="flex w-max items-end justify-center gap-2">
              {notificationNavigation(notificationType).map((type) => (
                <button
                  key={type.id}
                  onClick={() => setNotificationType(type.name as Type)}
                  className={`${notificationType === type.name
                    ? "btn-tab-active"
                    : "btn-tab-secondary"
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </header>
        </section>

        <section className="h-[50vh] min-h-[400px] max-h-[700px] w-full bg-white dark:bg-black flex-1 overflow-auto scroll-area p-4 text-center">
          <NotificationContainer res={notificationType} />
        </section>

        <Link href="/notifications" className="font-semibold text-secondary">
          <div className="sticky bottom-0 left-0 flex items-center justify-center border-t border-border-light bg-white p-4 dark:border-border dark:bg-black">
            See all notifications
          </div>
        </Link>
      </div>
    </div>

  ) : (
    <div className="w-72 rounded-md border border-border-light bg-white p-6 shadow-md dark:border-border dark:bg-primary">
      <h1 className="mb-3 text-2xl font-semibold text-gray-700 dark:text-text-secondary">
        Sign in to see notifications from your favorite tech writers!
      </h1>

      <p className="mb-5 text-base text-gray-500 dark:text-text-primary">
        Learn insights from developers and people in tech from around the world.
        Grow 1% every day.
      </p>

      <Link href="/onboard">
        <button className="btn-filled">Let&apos;s start</button>
      </Link>
    </div>
  );
};

export default Notification;

export const NotificationContainer: FC<{
  res: "all" | "comment" | "like" | "new_article" | "follow";
}> = ({ res }) => {
  const { data, isLoading, isError, fetchNextPage, isFetchingNextPage, hasNextPage } = api.notifications.get.useInfiniteQuery(
    {
      limit: 6,
      type: res.toLocaleUpperCase() as NotificationTypes,
    },
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  useEffect(() => {
    if (isError) {
      toast.error("Error Fetching Notifications");
    }
  }, [isError]);

  const notifications = useMemo(
    () => data?.pages.flatMap((page) => page.notifications),
    [data]
  );

  const bottomRef = useRef<HTMLDivElement>(null);
  const reachedBottom = useOnScreen(bottomRef);

  useEffect(() => {
    if (reachedBottom && hasNextPage) {
      void fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reachedBottom]);


  return (
    <div className="scroll-area min-h-[19.25rem] overflow-auto px-4">
      <ManageData
        loading={
          <div className="loading h-24 w-full border-b border-border-light py-4 dark:border-border"></div>
        }
        type="NOTIFICATION"
        notificationData={{ data: notifications, isLoading, type: "ALL" }}
      />
      {
        isFetchingNextPage && (
          <>
            <NotificationLoading />
            <NotificationLoading />
            <NotificationLoading />
            <NotificationLoading />
            <NotificationLoading />
            <NotificationLoading />
          </>
        )
      }
      <div ref={bottomRef} />
    </div>
  );
};
