import { TRPCClientError } from "@trpc/client";
import Image from "next/image";
import React, { useContext, useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import { Comment as CommentSVG, Heart } from "~/svgs";
import type { Comment } from "~/types";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import { formatDate } from "~/utils/miniFunctions";

export const CommentCard: FC<{
  comment: Comment;
  type: "REPLY" | "COMMENT";
  commentFunc: (type: "REPLY" | "COMMENT", content: string) => Promise<void>;
  setCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  setReply: React.Dispatch<React.SetStateAction<boolean>>;
  setReplyingUsername: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({
  comment,
  setReply,
  type,
  commentFunc,
  setCommentId,
  setReplyingUsername,
}) => {
  const { user } = useContext(C) as ContextValue;
  const { mutate: likeComment } = api.comments.likeComment.useMutation();
  const [like, setLike] = useState({
    hasLiked: false,
    likesCount: comment.likesCount,
  });

  useEffect(() => {
    if (!user?.user.id) {
      return setLike({
        hasLiked: false,
        likesCount: comment.likesCount,
      });
    }

    const hasLiked = comment.likes.find((like) => like.id === user?.user.id)
      ? true
      : false;

    setLike({
      hasLiked,
      likesCount: comment.likesCount,
    });
  }, [user?.user.id]);

  const handleLike = () => {
    if (!user?.user.id) {
      toast.error("You need to login to like an article");
      return;
    }

    try {
      setLike({
        hasLiked: !like.hasLiked,
        likesCount: like.hasLiked ? like.likesCount - 1 : like.likesCount + 1,
      });
      likeComment({
        commentId: comment.id,
      });
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <div
        className={`relative ${
          type === "REPLY"
            ? "pt-6"
            : "border-b border-border-light py-3 last:border-none dark:border-border"
        } px-4`}
      >
        {type === "REPLY" && (
          <div className="absolute left-8 top-0 h-6 w-[2px] bg-gray-700 dark:bg-[#475569]" />
        )}
        <div className="mb-2 flex gap-2">
          <Image
            src={comment?.user?.profile}
            alt={comment?.user?.name}
            width={40}
            height={40}
            className="mt-2 h-10 w-10 overflow-hidden rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-text-secondary">
                {comment?.user?.name}
              </h3>

              <p className="text-sm text-gray-500 dark:text-text-primary">
                {formatDate(new Date(comment?.createdAt))}
              </p>
            </div>
          </div>
        </div>
        <div className="">
          <p className="mb-4 text-base text-gray-700 dark:text-text-secondary">
            {comment?.body}
          </p>

          <div className="flex items-center gap-4 py-2">
            <button
              onClick={handleLike}
              className="btn-icon flex items-center gap-1 p-1"
            >
              <button>
                <Heart
                  className={`h-5 w-5 fill-none ${
                    like.hasLiked
                      ? "fill-red stroke-red"
                      : "stroke-border dark:stroke-text-primary"
                  }  md:h-6 md:w-6`}
                />
              </button>
              <span className="text-gray-700 dark:text-text-secondary">
                {like.likesCount}
              </span>
            </button>
            <button className="btn-icon flex items-center gap-1 p-1">
              <button>
                <CommentSVG className="h-6 w-6 fill-none stroke-gray-700 dark:stroke-text-secondary" />
              </button>
              <span className="text-gray-700 dark:text-text-secondary">
                {comment.replies.length}
              </span>
            </button>

            <button
              onClick={() => {
                setCommentId(comment?.id);
                setReply(true);
                setReplyingUsername(comment?.user?.username);
              }}
              className="btn-link"
            >
              Reply
            </button>
          </div>
        </div>
        <div>
          {comment?.replies?.map((reply) => (
            <CommentCard
              commentFunc={commentFunc}
              setCommentId={setCommentId}
              comment={reply}
              key={reply.id}
              type="REPLY"
              setReply={setReply}
              setReplyingUsername={setReplyingUsername}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CommentCard;
