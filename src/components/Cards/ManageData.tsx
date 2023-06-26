import React, { type FC } from "react";
import { type TrendingTagsTypes } from "~/utils/context";
import { type TrendingArticleTypes } from "./../../utils/context";
import ArticleCard from "./ArticleCard";
import TagCard from "./TagCard";

const ManageData: FC<{
  loading: React.ReactNode;
  articleData?: TrendingArticleTypes;
  tagsData?: TrendingTagsTypes;
  type: "TAG" | "ARTICLE";
}> = ({ loading, articleData, tagsData, type }) => {
  return (
    <>
      {type === "TAG" ? (
        tagsData?.isLoading ? (
          <div className="flex w-full flex-wrap gap-4">
            {Array(4)
              .fill("")
              .map((_, i) => (
                <div key={i} className="w-[calc(100%/2-0.5rem)]">
                  {loading}
                </div>
              ))}
          </div>
        ) : tagsData?.data && tagsData?.data.length > 0 ? (
          <div className="flex w-full flex-wrap gap-4 p-4">
            {tagsData.data.map((item) => {
              return (
                <div key={item.id} className="w-[calc(100%/2-0.5rem)]">
                  <TagCard tag={item} />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-500 dark:text-gray-400">
            No Tags found!
          </p>
        )
      ) : articleData?.isLoading ? (
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
              <ArticleCard card={item} />
            </div>
          );
        })
      ) : (
        <div className="py-16">
          <p className="text-center text-lg text-gray-500 dark:text-gray-400">
            No Articles found! 😢
          </p>
        </div>
      )}
    </>
  );
};

export default ManageData;
