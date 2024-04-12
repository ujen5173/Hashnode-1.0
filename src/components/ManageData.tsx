import React, { type FC } from "react";
import {
  type NotificationDataTypes,
  type TrendingArticleTypes,
  type TrendingTagsTypes,
} from "~/utils/context";
import ArticleCard from "./card/ArticleCard";
import NotificationCard from "./card/NotificationCard";
import TagCard from "./card/TagCard";
import TrendingCard from "./card/TrendingCard";

interface Props {
  loading: React.ReactNode;
  articleData?: TrendingArticleTypes;
  tagsData?: TrendingTagsTypes;
  type: "TAG" | "ARTICLE" | "MINI_ARTICLES" | "NOTIFICATION";
  notificationData?: NotificationDataTypes;
  filter?: "This week" | "Any" | "This month" | "This year";
  error?: string | null;
}

const ManageData: FC<Props> = ({
  loading,
  articleData,
  tagsData,
  type,
  notificationData,
  filter,
  error = null,
}) => {
  const renderLoadingPlaceholder = (count: number) =>
    Array(count)
      .fill("")
      .map((_, i) => (
        <div
          key={i}
          className="articleCard border-b border-border-light last:border-none dark:border-border"
        >
          {loading}
        </div>
      ));
  const renderTagLoadingPlaceholder = (count: number) =>
    Array(count)
      .fill("")
      .map((_, i) => (
        <div
          key={i}
          className="w-full rounded-md border border-border-light bg-light-bg dark:border-border dark:bg-primary-light md:w-[calc(100%/2-0.5rem)]"
        >
          {loading}
        </div>
      ));
  const renderNotificationoadingPlaceholder = (count: number) =>
    Array(count)
      .fill("")
      .map((_, i) => (
        <div
          key={i}
          className="border-b border-border-light last:border-none dark:border-border"
        >
          {loading}
        </div>
      ));

  const renderErrorPlaceholder = (message: string) => (
    <div className="py-16">
      <p className="text-center text-lg text-gray-500 dark:text-gray-400">
        {error ?? message}
      </p>
    </div>
  );

  return (
    <div className="manageData-container w-full">
      {type === "TAG" &&
        (tagsData?.isLoading ? (
          <div className="flex w-full flex-wrap gap-4 p-4">
            {renderTagLoadingPlaceholder(6)}
          </div>
        ) : tagsData?.data && tagsData?.data.length > 0 && error === null ? (
          <div className="flex w-full flex-wrap gap-4 p-4">
            {tagsData.data.map((item) => (
              <div key={item.id} className="w-full md:w-[calc(100%/2-0.5rem)]">
                <TagCard tag={item} type={filter ?? "Any"} />
              </div>
            ))}
          </div>
        ) : (
          renderErrorPlaceholder("No Tags found!")
        ))}

      {(type === "ARTICLE" || type === "MINI_ARTICLES") &&
        (articleData?.isLoading ? (
          <>{renderLoadingPlaceholder(4)}</>
        ) : articleData?.data &&
          articleData?.data.length > 0 &&
          error === null ? (
          articleData.data.map((item) => (
            <div
              key={item.id}
              className="articleCard border-b border-border-light last:border-none dark:border-border"
            >
              {type === "ARTICLE" ? (
                <ArticleCard card={item} />
              ) : (
                <TrendingCard article={item} />
              )}
            </div>
          ))
        ) : (
          renderErrorPlaceholder("No Articles found! 😢")
        ))}

      {type === "NOTIFICATION" &&
        (notificationData?.isLoading ? (
          <>{renderNotificationoadingPlaceholder(4)}</>
        ) : notificationData?.data &&
          notificationData?.data.length > 0 &&
          error === null ? (
          notificationData.data.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))
        ) : (
          renderErrorPlaceholder("No Notifications yet!")
        ))}
    </div>
  );
};

export default ManageData;
