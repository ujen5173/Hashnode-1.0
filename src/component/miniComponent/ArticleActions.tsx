import { Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";

import { Bookmark, BookmarkMinus, Heart, MessageCircle, MoreVertical, Share2 } from "lucide-react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { C } from "~/utils/context";
import ShareOptions from "./ShareOptions";

interface Props {
  article: {
    id: string,
    title: string,
    subtitle: string | null,
    slug: string,
    cover_image: string,
    disabledComments: boolean,
    readCount: number,
    likesCount: number,
    commentsCount: number,
    createdAt: string,
    content: string,
    read_time: number
    user: {
      username: string,
      image: string,
      name: string,
    },
  }; setCommentsModal: React.Dispatch<React.SetStateAction<boolean>>;
  commentsCount: number;
}

const ArticleActions: FC<Props> = ({
  article,
  commentsCount,
  setCommentsModal,
}) => {
  const [shareOpen, setShareOpen] = useState(false);
  const [control, setControl] = useState<HTMLDivElement | null>(null);
  const [dropdown, setDropdown] = useState<HTMLDivElement | null>(null);

  useClickOutside<HTMLDivElement>(() => setShareOpen(false), null, [
    control,
    dropdown,
  ]);

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [optionsControl, setOptionsControl] = useState<HTMLDivElement | null>(null);
  const [optionsDropdown, setOptionsDropdown] = useState<HTMLDivElement | null>(null);

  useClickOutside<HTMLDivElement>(() => setOptionsOpen(false), null, [
    optionsControl,
    optionsDropdown,
  ]);

  const { bookmarks, updateBookmark } = useContext(C)!;
  const { data: user } = useSession();
  const { mutate: LikeArticle } = api.likes.likeArticle.useMutation();
  const [like, setLike] = useState({
    hasLiked: false,
    likesCount: article.likesCount,
  });

  const { data } = api.likes.likeState.useQuery(
    {
      articleId: article.id,
    },
    {
      enabled: !!article.id,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (data) {
      setLike(prev => ({
        ...prev,
        hasLiked: data.liked,
      }));
    }
  }, [data]);

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
      <div className="mx-auto flex items-center justify-between gap-2 rounded-full border border-border-light bg-light-bg px-4 py-1 shadow-sm dark:border-border dark:bg-primary-light sm:w-max">
        <Tooltip label="Like" withArrow>
          <button
            aria-label="icon"
            role="button"
            onClick={() => void likeFunction()}
            className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
          >
            <div className="flex items-center justify-center gap-2">
              <Heart
                className={`h-5 w-5 fill-none ${like.hasLiked
                  ? "fill-red stroke-red"
                  : "stroke-border dark:stroke-text-primary"
                  }  md:h-6 md:w-6`}
              />
            </div>

            <span>{like.likesCount}</span>
          </button>
        </Tooltip>

        <div className="h-6 w-[2px] bg-border-light dark:bg-border" />

        <Tooltip
          label={`${article.disabledComments
            ? "Comments Disabled"
            : `Comments (${commentsCount})`
            }`}
          classNames={{
            tooltip: `${article.disabledComments
              ? "bg-[#dc2626!important] text-[#fafafa!important] dark:text-[#fff!important]"
              : ""
              }`,
          }}
          withArrow
        >
          <button
            aria-label="icon"
            role="button"
            onClick={() => !article.disabledComments && setCommentsModal(true)}
            disabled={article.disabledComments}
            className={`${article.disabledComments ? "cursor-not-allowed opacity-70" : ""
              } flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border`}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageCircle className="h-5 w-5 fill-none stroke-border dark:stroke-text-primary md:h-6 md:w-6" />
            </div>

            <span>{commentsCount}</span>
          </button>
        </Tooltip>

        <div className="h-6 w-[2px] bg-border-light dark:bg-border" />

        <Tooltip label="Bookmark" withArrow>
          <button
            aria-label="icon"
            onClick={() => updateBookmark(article.id)}
            role="button"
            className={`dark:hover:bg-border ${bookmarks.find((bookmark) => bookmark.id === article.id)
              ? "bg-secondary bg-opacity-20"
              : ""
              } btn-icon-large flex w-max items-center justify-center`}
          >
            {bookmarks.find((bookmark) => bookmark.id === article.id) ? (
              <BookmarkMinus className="h-6 w-6 stroke-gray-700 dark:stroke-text-primary" />
            ) : (
              <Bookmark className="h-6 w-6 stroke-gray-700 dark:stroke-text-primary" />
            )}
          </button>
        </Tooltip>

        <div className="h-6 w-[2px] bg-border-light dark:bg-border" />

        <div className="relative">
          {shareOpen && (
            <ShareOptions
              acticleDetails={{
                title: article.title,
                by: article.user.username,
              }}
              ref={setDropdown}
              setShareOpen={setShareOpen}
            />
          )}

          <Tooltip label="Share" withArrow>
            <div
              ref={setControl}
            >
              <button
                aria-label="icon"
                role="button"
                onClick={() => void setShareOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
              >
                <div className="flex items-center justify-center gap-2">
                  <Share2 className="h-5 w-5 fill-none stroke-border dark:stroke-text-primary md:h-6 md:w-6" />
                </div>
              </button>
            </div>
          </Tooltip>
        </div>

        <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>

        <div className="relative">
          {optionsOpen && (
            <MoreOptions
              ref={setOptionsDropdown}
              setOptionsOpen={setOptionsOpen}
              slug={article.slug}
              user={user?.user.username === article.user.username}
            />
          )}

          <Tooltip label="More Options" withArrow position="bottom">
            <div
              ref={setOptionsControl}
            >
              <button
                aria-label="icon"
                role="button"
                onClick={() => void setOptionsOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
              >
                <div className="flex items-center justify-center gap-2">
                  <MoreVertical className="h-5 w-5 fill-border dark:fill-text-primary md:h-6 md:w-6" />
                </div>
              </button>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ArticleActions;

const MoreOptions = React.forwardRef<
  HTMLDivElement,
  {
    setOptionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user: boolean;
    slug: string
  }
>(({ setOptionsOpen, slug, user }, ref) => {
  const router = useRouter();
  const { mutateAsync: deleteArticle } = api.posts.deleteTemporarily.useMutation();
  const { mutateAsync: disableComment } = api.posts.disableComments.useMutation();
  const userActions = [
    "Edit",
    "Delete",
    "Disable Comments",
    "Pin to your blog",
    "Report",
  ]

  const guestActions = [
    "Report",
    "Follow",
  ];

  const actionControler = async (name: string) => {
    switch (name) {
      case "Delete":
        try {
          const res = await deleteArticle({
            slug,
          });

          if (res.success) {
            toast.success("Article deleted successfully");
          } else {
            toast.error("Failed to delete article");
          }
        } catch (err) {
          if (err instanceof TRPCClientError) {
            toast.error(err.message);
          } else {
            toast.error("Failed to delete article");
          }
        }
        break;
      case "Edit":
        void router.push(`/article/edit/${slug}`);
        break;

      case "Disable Comments":
        try {
          const res = await disableComment({
            slug,
          })

          if (res.success) {
            toast.success("Comments disabled successfully");
          } else {
            toast.error("Failed to disable comments");
          }
        } catch (err) {
          if (err instanceof TRPCClientError) {
            toast.error(err.message);
          } else {
            toast.error("Failed to disable comments");
          }
        }
        break;
      default:
        break;
    }
  }

  return (
    <div
      ref={ref}
      className="absolute -right-full bottom-full mt-2 min-w-[190px] rounded-md border border-border-light bg-white shadow-md dark:border-border dark:bg-primary md:-left-2"
    >
      <ul className="py-2">
        {user ? userActions.map((option, index) => (
          <li
            onClick={() => {
              void actionControler(option)
              setOptionsOpen(false)
            }}
            className="flex w-full cursor-pointer items-center justify-start gap-3 px-4 py-2 pr-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-text-secondary dark:hover:bg-border"
            key={index}
          >
            {option}
          </li>
        )) : guestActions.map((option, index) => (
          <li
            onClick={() => {
              void actionControler(option)
              setOptionsOpen(false)
            }
            }
            className="flex w-full cursor-pointer items-center justify-start gap-3 px-4 py-2 pr-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-text-secondary dark:hover:bg-border"
            key={index}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>)
});

MoreOptions.displayName = "MoreOptions";