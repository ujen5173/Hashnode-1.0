import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { type Notification } from "~/utils/context";
import { formatDate } from "~/utils/miniFunctions";

const NotificationCard: FC<{ notification: Notification }> = ({
  notification,
}) => {
  return (
    <div
      key={notification.id}
      className="flex items-start justify-between gap-4 border-b border-border-light py-4 last:border-none dark:border-border "
    >
      <div className="relative">
        <Image
          src={notification?.from.image ?? "/static/default_user.avif"}
          alt={notification?.from.name || ""}
          width={70}
          height={70}
          className="h-10 w-10 overflow-hidden rounded-full"
        />
      </div>

      <div className="flex-1 text-left">
        <p className="mb-2 text-base text-gray-500 dark:text-text-primary">
          <Link href={`/u/@${notification.from.username}`}>
            <span className="mr-1 font-semibold text-gray-700 dark:text-text-secondary">
              {notification.from.name}
            </span>
          </Link>

          {notification.type === "COMMENT"
            ? "commented on your article"
            : notification.type === "LIKE"
              ? "liked your article"
              : notification.type === "ARTICLE"
                ? "published a new article"
                : "followed you"}
        </p>

        {notification.type === "COMMENT" && (
          <div className="mb-2 rounded-md border border-border-light bg-light-bg p-3 text-gray-700 dark:border-border dark:bg-primary dark:text-text-secondary">
            <div
              dangerouslySetInnerHTML={{ __html: notification.body ?? "" }}
            />
          </div>
        )}

        <Link href={`/u/@${notification.articleAuthor!}/${notification.slug!}`}>
          <h1 className="max-height-one mb-1 text-lg font-semibold text-secondary">
            {notification.title}
          </h1>
        </Link>

        <p className="text-sm text-gray-500 dark:text-text-primary">
          {formatDate(notification.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default NotificationCard;
