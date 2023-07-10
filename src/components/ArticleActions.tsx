import { Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { TRPCClientError } from "@trpc/client";
import React, { useContext, useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import { Bookmarkplus, Comment, Heart, Report, Share } from "~/svgs";
import Bookmarked from "~/svgs/Bookmarked";
import type { Article } from "~/types";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import ShareOptions from "./ShareOptions";

const ArticleActions: FC<{
  article: Article;
  setCommentsModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ article, setCommentsModal }) => {
  const [shareOpen, setShareOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setShareOpen(false));
  const { user, bookmarks, updateBookmark } = useContext(C) as ContextValue;
  const { mutate: LikeArticle } = api.likes.likeArticle.useMutation();
  const [like, setLike] = useState({
    hasLiked: false,
    likesCount: article.likesCount,
  });

  useEffect(() => {
    if (!user?.user.id) {
      return setLike({
        hasLiked: false,
        likesCount: article.likesCount,
      });
    }

    const hasLiked = article.likes.find((like) => like.id === user?.user.id)
      ? true
      : false;

    setLike({
      hasLiked,
      likesCount: article.likesCount,
    });
  }, [user?.user.id]);

  const likeFunction = () => {
    if (!user?.user.id) {
      toast.error("You need to login to like an article");
      return;
    }

    try {
      setLike({
        hasLiked: !like.hasLiked,
        likesCount: like.hasLiked ? like.likesCount - 1 : like.likesCount + 1,
      });
      LikeArticle({
        articleId: article.id,
      });
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="sticky bottom-4 left-0 flex w-full items-center justify-center gap-2 px-4 py-4">
      <div className="mx-auto flex items-center justify-between gap-2 rounded-full border border-border-light bg-light-bg px-4 py-1 dark:border-border dark:bg-primary-light sm:w-max">
        <Tooltip label="Link">
          <button
            aria-label="icon"
            role="button"
            onClick={() => void likeFunction()}
            className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
          >
            <div className="flex items-center justify-center gap-2">
              <Heart
                className={`h-5 w-5 fill-none ${
                  like.hasLiked
                    ? "fill-red stroke-red"
                    : "stroke-border dark:stroke-text-primary"
                }  md:h-6 md:w-6`}
              />
            </div>
            <span>{like.likesCount}</span>
          </button>
        </Tooltip>
        {!article.disabledComments && (
          <>
            <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>
            <Tooltip label="Comments">
              <button
                aria-label="icon"
                role="button"
                onClick={() => setCommentsModal(true)}
                className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
              >
                <div className="flex items-center justify-center gap-2">
                  <Comment className="h-5 w-5 fill-none stroke-border dark:stroke-text-primary md:h-6 md:w-6" />
                </div>
                <span>{article.commentsCount}</span>
              </button>
            </Tooltip>
          </>
        )}

        <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>
        <Tooltip label="Bookmark">
          <button
            aria-label="icon"
            onClick={() => updateBookmark(article.id)}
            role="button"
            className={`${
              bookmarks.find((bookmark) => bookmark.id === article.id)
                ? "bg-secondary bg-opacity-20"
                : ""
            } btn-icon-large flex w-max items-center justify-center`}
          >
            {bookmarks.find((bookmark) => bookmark.id === article.id) ? (
              <Bookmarked className="h-5 w-5" />
            ) : (
              <Bookmarkplus className="h-5 w-5 fill-gray-700 dark:fill-text-primary" />
            )}
          </button>
        </Tooltip>

        <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>
        <Tooltip label="Share">
          <div className="relative">
            {shareOpen && (
              <ShareOptions
                acticleDetails={{
                  title: article.title,
                  by: article.user.username,
                }}
                ref={ref}
                setShareOpen={setShareOpen}
              />
            )}
            <button
              aria-label="icon"
              role="button"
              onClick={() => void setShareOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
            >
              <div className="flex items-center justify-center gap-2">
                <Share className="h-5 w-5 fill-none stroke-border dark:stroke-text-primary md:h-6 md:w-6" />
              </div>
            </button>
          </div>
        </Tooltip>
        <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>
        <Tooltip label="Report">
          <button
            aria-label="icon"
            role="button"
            className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
          >
            <div className="flex items-center justify-center gap-2">
              <Report className="h-5 w-5 fill-border dark:fill-text-primary md:h-6 md:w-6" />
            </div>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ArticleActions;
