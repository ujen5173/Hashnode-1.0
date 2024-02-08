import { Tooltip } from "@mantine/core";
import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import type { Comment } from "~/types";
import { api } from "~/utils/api";
import { formatDate } from "~/utils/miniFunctions";
import { CommentLoading } from "../loading";
import { CommentFooter, ReplyDetails } from "../miniComponent";

interface Props {
  comment: Comment;
  type: "REPLY" | "COMMENT";
  authorUsername: string;
  commentFunc: (type: "REPLY" | "COMMENT", content: string) => Promise<void>;
  publishing: boolean;
  replyingUserDetails: {
    id: string;
    username: string;
  } | null;
  setReplyingUserDetails: React.Dispatch<
    React.SetStateAction<{
      id: string;
      username: string;
    } | null>
  >;
  replyComment: (data: { id: string; username: string }) => void;
  commentState: {
    articleId: string;
    parentId?: string | null;
    type: "INITIAL" | "ALL";
  };
  setCommentState: React.Dispatch<
    React.SetStateAction<{
      articleId: string;
      parentId?: string | null;
      type: "INITIAL" | "ALL";
    }>
  >;
  isLoading: boolean;
}

export const CommentCard: FC<Props> = ({
  comment,
  authorUsername,
  type,
  commentFunc,
  publishing,
  replyingUserDetails,
  setReplyingUserDetails,
  replyComment,
  commentState,
  setCommentState,
  isLoading,
}) => {
  const { data: user } = useSession();
  const { mutate: likeComment } = api.comments.likeComment.useMutation();
  const [showReply, setShowReply] = useState(type === "COMMENT" ? true : false);
  const [replyText, setReplyText] = useState("");

  const [like, setLike] = useState({
    hasLiked: false,
    likesCount: comment.likesCount,
  });

  // get like status
  useEffect(() => {
    if (!user?.user.id) {
      return setLike({
        hasLiked: false,
        likesCount: comment.likesCount,
      });
    }

    setLike({
      hasLiked: comment.hasLiked,
      likesCount: comment.likesCount,
    });
  }, [comment.likesCount, comment.hasLiked, user?.user.id]);

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

  const handleReply = (id: string | null) => {
    if (!id) return;
    !publishing && void commentFunc("REPLY", replyText);
    setReplyingUserDetails(null);
    setReplyText("");
  };

  const cancelReply = () => {
    setReplyingUserDetails(null);
    setReplyText("");
  };

  return (
    <div>
      {type === "REPLY" && (
        <div className="absolute left-[2.15rem] top-0 h-6 w-[1.7px] bg-gray-400 dark:bg-[#475569]" />
      )}

      <div className="my-2 flex gap-2">
        <Link href={`/u/@${comment?.user.username}`}>
          <Image
            src={comment?.user.image ?? "/static/default_user.avif"}
            alt={comment?.user.name}
            width={40}
            height={40}
            className="h-9 w-9 overflow-hidden rounded-full object-cover"
          />
        </Link>

        <div className="flex flex-1 items-start gap-2">
          <div className="mb-2">
            <div className="flex items-center gap-2">
              <Link href={`/u/@${comment?.user.username}`}>
                <h3 className="text-base font-semibold text-gray-700 dark:text-text-secondary">
                  {comment?.user?.name}
                </h3>
              </Link>
              {comment?.user.stripeSubscriptionStatus === "active" && (
                <Tooltip
                  label="Hashnode Clone Pro User"
                  position="bottom"
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "400",
                    letterSpacing: "0.5px",
                  }}
                >
                  <span className="rounded-md border border-border-light bg-light-bg px-2 py-[1px] text-xs font-semibold tracking-wider text-gray-700 dark:border-border dark:bg-primary-light dark:text-text-secondary">
                    PRO
                  </span>
                </Tooltip>
              )}
            </div>

            <p className="text-xs text-gray-500 dark:text-text-primary">
              {formatDate(new Date(comment?.createdAt))}
            </p>
          </div>

          {comment.user.username === authorUsername && (
            <div className="rounded-full bg-[#bbf7d0] px-2 py-1 text-xs font-medium text-[#166534] dark:bg-[#166534] dark:text-white">
              Author
            </div>
          )}
        </div>
      </div>

      <div className="">
        <div
          dangerouslySetInnerHTML={{ __html: comment.body || "" }}
          className="w-full break-words text-gray-700 dark:text-text-secondary"
        />
        <CommentFooter
          handleLike={handleLike}
          like={like}
          comment={comment}
          setShowReply={setShowReply}
          replyComment={replyComment}
        />
        {replyingUserDetails && replyingUserDetails.id === comment.id && (
          <ReplyDetails
            replyText={replyText}
            setReplyText={setReplyText}
            replyingUserDetails={replyingUserDetails}
            publishing={publishing}
            cancelReply={cancelReply}
            handleReply={handleReply}
            commentId={comment.id}
          />
        )}
      </div>

      {showReply && (
        <div>
          {isLoading &&
          commentState.type === "ALL" &&
          commentState.parentId === comment.id
            ? Array(2)
                .fill("")
                .map((_, i) => <CommentLoading key={i} />)
            : comment.replies?.map((reply) => (
                <div className={`relative px-4 pt-6`} key={reply.id}>
                  <CommentCard
                    commentFunc={commentFunc}
                    comment={reply}
                    type="REPLY"
                    setReplyingUserDetails={setReplyingUserDetails}
                    replyingUserDetails={replyingUserDetails}
                    replyComment={replyComment}
                    publishing={publishing}
                    authorUsername={authorUsername}
                    isLoading={isLoading}
                    commentState={commentState}
                    setCommentState={setCommentState}
                  />
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
