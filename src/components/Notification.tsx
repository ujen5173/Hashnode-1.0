import { type NotificationTypes } from "@prisma/client";
import { useContext, useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import ManageData from "./Cards/ManageData";

enum Type {
  all = "all",
  new_articles = "new_article",
  comments = "comment",
  likes = "like",
}

const Notification = () => {
  const [notificationType, setNotificationType] = useState<Type>(Type.all);
  const { user } = useContext(C) as ContextValue;

  return user ? (
    <div className="w-full rounded-md border border-border-light bg-white p-4 shadow-lg dark:border-border dark:bg-black md:w-[35rem]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Notifications
        </h1>
      </div>
      <header className="scroll-area overflow-auto border-b border-border-light px-4 dark:border-border">
        <div className="flex w-max items-end justify-center gap-2">
          {[
            { id: 123, name: "all", label: "All Notifications" },
            { id: 345, name: "comment", label: "Comments" },
            { id: 567, name: "like", label: "Likes" },
            { id: 789, name: "new_article", label: "Articles" },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setNotificationType(type.name as Type)}
              className={`${
                notificationType === type.name
                  ? "btn-tab-active"
                  : "btn-tab-secondary"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </header>

      <section className="min-h-[20rem] flex-1 text-center">
        <NotificationContainer res={notificationType} />
      </section>
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
      <button className="btn-filled">Let&apos;s start</button>
    </div>
  );
};

export default Notification;

const NotificationContainer: FC<{
  res: "all" | "comment" | "like" | "new_article" | "follow";
}> = ({ res }) => {
  const { data, isLoading, isError } = api.notifications.get.useQuery(
    {
      limit: 6,
      type: res.toLocaleUpperCase() as NotificationTypes,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (isError) {
      toast.error("Error Fetching Notifications");
    }
  }, [isError]);

  return (
    <div className=" scroll-area max-h-[400px] overflow-auto px-4">
      <ManageData
        loading={
          <div className="loading h-24 w-full border-b border-border-light py-4 dark:border-border"></div>
        }
        type="NOTIFICATION"
        notificationData={{ data, isLoading, type: "ALL" }}
      />
    </div>
  );
};
