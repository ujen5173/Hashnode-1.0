import Image from "next/image";
import Link from "next/link";
import React, { type FC } from "react";
import {
  type NotificationDataTypes,
  type TrendingTagsTypes,
} from "~/utils/context";
import { formatDate } from "~/utils/miniFunctions";
import NotificationLoading from "../Loading/NotificationLoading";
import { type TrendingArticleTypes } from "./../../utils/context";
import ArticleCard from "./ArticleCard";
import TagCard from "./TagCard";
import TrendingCard from "./TrendingCard";

const ManageData: FC<{
  loading: React.ReactNode;
  articleData?: TrendingArticleTypes;
  tagsData?: TrendingTagsTypes;
  type: "TAG" | "ARTICLE" | "MINI_ARTICLES" | "NOTIFICATION";
  notificationData?: NotificationDataTypes;
  filter?: "This week" | "Any" | "This month" | "This year";
}> = ({ loading, articleData, tagsData, type, notificationData, filter }) => {
  return (
    <>
      {type === "TAG" ? (
        tagsData?.isLoading ? (
          <div className="flex w-full flex-wrap gap-4 p-4">
            {Array(6)
              .fill("")
              .map((_, i) => (
                <div key={i} className="w-full md:w-[calc(100%/2-0.5rem)]">
                  {loading}
                </div>
              ))}
          </div>
        ) : tagsData?.data && tagsData?.data.length > 0 ? (
          <div className="flex w-full flex-wrap gap-4 p-4">
            {tagsData.data.map((item) => {
              return (
                <div
                  key={item.id}
                  className="w-full md:w-[calc(100%/2-0.5rem)]"
                >
                  <TagCard tag={item} type={filter || "Any"} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16">
            <p className="text-center text-lg text-gray-500 dark:text-gray-400">
              No Tags found!
            </p>
          </div>
        )
      ) : type === "ARTICLE" || type === "MINI_ARTICLES" ? (
        articleData?.isLoading ? (
          <>
            {Array(4)
              .fill("")
              .map((_, i) => (
                <div key={i}>{loading}</div>
              ))}
          </>
        ) : articleData?.data && articleData?.data.length > 0 ? (
          articleData.data.map((item) => {
            return (
              <div
                key={item.id}
                className="border-b border-border-light last:border-none dark:border-border"
              >
                {type === "ARTICLE" ? (
                  <ArticleCard card={item} />
                ) : (
                  <TrendingCard
                    article={{
                      id: item.id,
                      title: item.title,
                      slug: item.slug,
                      user: {
                        id: item.user.id as string,
                        profile: item.user.profile,
                        name: item.user.name,
                        username: item.user.username,
                      },
                      likesCount: item.likesCount,
                      commentsCount: item.commentsCount,
                    }}
                    key={item.id}
                  />
                )}
              </div>
            );
          })
        ) : (
          <div className="py-16">
            <p className="text-center text-lg text-gray-500 dark:text-gray-400">
              No Articles found! 😢
            </p>
          </div>
        )
      ) : type === "NOTIFICATION" ? (
        notificationData?.isLoading ? (
          <>
            {Array(4)
              .fill("")
              .map((_, i) => (
                <div
                  className="border-b border-border-light last:border-none dark:border-border"
                  key={i}
                >
                  <NotificationLoading />
                </div>
              ))}
          </>
        ) : notificationData?.data && notificationData?.data.length > 0 ? (
          notificationData.data.map((notification) => {
            return (
              <div
                key={notification.id}
                className="flex items-start justify-between gap-4 border-b border-border-light py-4 last:border-none dark:border-border "
              >
                <div className="relative">
                  <Image
                    src={notification?.from.profile || "/default_user.avif"}
                    alt={notification?.from.name || ""}
                    width={70}
                    height={70}
                    className="h-10 w-10 overflow-hidden rounded-full"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="mb-2 text-base text-gray-500 dark:text-text-primary">
                    <Link href={`/u/@${notification.articleAuthor as string}`}>
                      <span className="mr-1 font-semibold text-gray-700 dark:text-text-secondary">
                        {notification.from.name}
                      </span>
                    </Link>
                    {notification.type === "COMMENT"
                      ? "commented on your article"
                      : notification.type === "LIKE"
                      ? "liked your article"
                      : notification.type === "NEW_ARTICLE"
                      ? "published a new article"
                      : "followed you"}
                  </p>
                  {notification.type === "COMMENT" && (
                    <div className="mb-2 rounded-md border border-border-light bg-light-bg p-3 text-gray-700 dark:border-border dark:bg-primary dark:text-text-secondary">
                      {notification.body}
                    </div>
                  )}
                  <Link
                    href={`/u/@${notification.articleAuthor as string}/${
                      notification.slug as string
                    }`}
                  >
                    <h1 className="mb-1 text-lg font-semibold text-secondary">
                      {notification.title}
                    </h1>
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-text-primary">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16">
            <p className="text-center text-lg text-gray-500 dark:text-gray-400">
              No Notifications yet!
            </p>
          </div>
        )
      ) : null}
    </>
  );
};

export default ManageData;
