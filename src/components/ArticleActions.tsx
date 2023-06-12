import { type FC, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Heart, Comment, Share, Dots, Bookmarkplus } from "~/svgs";
import Bookmarked from "~/svgs/Bookmarked";
import type { ArticleCard } from "~/types";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";

const ArticleActions: FC<{ article: ArticleCard }> = ({ article }) => {
  const { user, bookmarks, updateBookmark } = useContext(C) as ContextValue;
  const { mutateAsync: LikeArticle } = api.posts.likeArticle.useMutation();
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

  const likeFunction = async () => {
    const res = await LikeArticle({
      articleId: article.id,
    });

    toast.success(res.message);
    setLike({
      hasLiked: res.hasLiked,
      likesCount: res.likesCount,
    });
  };

  return (
    <div className="sticky bottom-4 mx-auto flex w-11/12 items-center justify-between gap-2 rounded-full border border-border-light bg-light-bg px-4 py-1 dark:border-border dark:bg-primary-light sm:w-max md:left-1/2 md:-translate-x-1/2">
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
      <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>
      <button
        aria-label="icon"
        role="button"
        className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
      >
        <div className="flex items-center justify-center gap-2">
          <Comment className="h-5 w-5 fill-none stroke-border dark:stroke-text-primary md:h-6 md:w-6" />
        </div>
        <span>{article.comments.length}</span>
      </button>
      <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>
      <button
        aria-label="icon"
        onClick={() => updateBookmark(article.id)}
        role="button"
        className={`btn-icon-large flex items-center justify-center`}
      >
        {bookmarks.find((bookmark) => bookmark.id === article.id) ? (
          <Bookmarkplus className="h-5 w-5 fill-gray-700 dark:fill-text-primary" />
        ) : (
          <Bookmarked className="h-5 w-5" />
        )}
      </button>

      <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>
      <button
        aria-label="icon"
        role="button"
        className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
      >
        <div className="flex items-center justify-center gap-2">
          <Share className="h-5 w-5 fill-none stroke-border dark:stroke-text-primary md:h-6 md:w-6" />
        </div>
      </button>
      <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>
      <button
        aria-label="icon"
        role="button"
        className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
      >
        <div className="flex items-center justify-center gap-2">
          <Dots className="h-5 w-5 stroke-border dark:stroke-text-primary md:h-6 md:w-6" />
        </div>
      </button>
    </div>
  );
};

export default ArticleActions;
