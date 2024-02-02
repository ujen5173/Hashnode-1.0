
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Header, ManageData, NotificationLoading } from "~/component";
import useWindowSize from "~/hooks/useWindow";
import { api } from "~/utils/api";
import { notificationNavigation } from "~/utils/constants";
import type { NotificationTypesEnum } from "~/utils/context";

enum Type {
  all = "all",
  articles = "article",
  comments = "comment",
  likes = "like",
}

const Notifications = () => {
  const { data: session } = useSession();
  const { mutate } = api.notifications.markAsRead.useMutation(); // mark all notifications as read when notification popup is opened
  const { width } = useWindowSize();

  useEffect(() => {
    if (session) {
      mutate();
    }
  }, [session]);

  const [notificationType, setNotificationType] = useState<Type>(Type.all);
  const { data, isLoading, isError } = api.notifications.get.useQuery(
    {
      limit: 6,
      type: notificationType.toLocaleUpperCase() as NotificationTypesEnum,
    },
    {
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );

  useEffect(() => {
    if (isError) {
      toast.error("Error Fetching Notifications");
    }
  }, [isError]);

  return (
    <>
      <Header />

      <div className="min-h-[100dvh] w-full bg-white px-0 py-8 dark:bg-black md:px-4">
        <div className="mx-auto max-w-[800px] rounded-lg border border-border-light bg-white px-4 dark:border-border dark:bg-primary">
          <div className="mb-4 flex items-center justify-between gap-2 border-b border-border-light p-4 dark:border-border">
            <h1
              className={`text-xl font-semibold text-gray-800 dark:text-white ${width >= 500 ? "mx-0" : "mx-auto"
                }`}
            >
              Notifications
            </h1>
          </div>

          <header className="scroll-area overflow-auto border-b border-border-light dark:border-border">
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
                  {type.icon ? type.icon(type.name) : null}
                  {type.label}
                </button>
              ))}
            </div>
          </header>

          <section className="flex-1 text-center">
            <ManageData
              loading={
                <div className="loading h-24 w-full border-b border-border-light py-4 dark:border-border"></div>
              }
              type="NOTIFICATION"
              notificationData={{ data: data?.notifications, isLoading, type: notificationType as unknown as NotificationTypesEnum }}
            />
            {
              isLoading && (
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
          </section>
        </div>
      </div>
    </>
  );
};

export default Notifications;

