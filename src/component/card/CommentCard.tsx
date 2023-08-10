import { Tooltip } from "@mantine/core";
import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import type { Comment } from "~/types";
import { api } from "~/utils/api";
import { formatDate } from "~/utils/miniFunctions";
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
}) => {
  const { data: user } = useSession();
  const { mutate: likeComment } = api.comments.likeComment.useMutation();
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [replyText, setReplyText] = useState("")
  const [replies, setReplies] = useState<{
    totalReplies: number;
    replies: Comment[];
  }>({
    totalReplies: 0,
    replies: [],
  });
  const [getReplyComment, setGetReplyComment] = useState<string | null>(null);
  const { refetch, isFetching: isLoading } = api.comments.getReplies.useQuery(
    {
      commentId: getReplyComment as string, // forcing it to be a string as it wont be null when passing to server.
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

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

    const hasLiked = comment.likes.find((like) => like.id === user?.user.id)
      ? true
      : false;

    setLike({
      hasLiked,
      likesCount: comment.likesCount,
    });
  }, [comment.likesCount, comment.likes, user?.user.id]);

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
    setGetReplyComment(id);
    setTimeout(() => {
      // this timeout is to make sure the comment is added to the database before fetching the replies
      refetch()
        .then((res) => {
          setReplies(
            res.data || {
              totalReplies: 0,
              replies: [],
            } // fallback
          );
          setReplyingUserDetails(null);
          setShowReplies(true);
          setReplyText("");
        })
        .catch(() => {
          toast.error("Something went wrong, please try again later");
        });
    }, 100);
  };

  const cancelReply = () => {
    setReplyingUserDetails(null);
    setShowReplies(false);
    setReplyText("");

  };

  const ShowRepliesSection = () => {
    setShowReplies((prev) => !prev);
    if (!showReplies && comment?.repliesCount && comment?.repliesCount > 0) {
      // this function will run only when the showReplies state is false
      // which means this wont run when the user clicks on the button to hide the replies
      setGetReplyComment(comment.id);
      setTimeout(() => {
        void refetch().then((res) => {
          setReplies(
            res.data || {
              totalReplies: 0,
              replies: [],
            } // fallback
          );
        });
      }, 100);
    }
  };

  return (
    <div
      className={`relative px-4 ${type === "REPLY"
        ? "pt-6"
        : "border-b border-border-light py-3 last:border-none dark:border-border"
        }`}
    >
      {type === "REPLY" && (
        <div className="absolute left-[2.15rem] top-0 h-6 w-[1.7px] bg-gray-400 dark:bg-[#475569]" />
      )}

      <div className="my-2 flex gap-2">
        <Image
          src={comment?.user?.profile}
          alt={comment?.user?.name}
          width={40}
          height={40}
          className="h-9 w-9 overflow-hidden rounded-full object-cover"
        />

        <div className="flex flex-1 items-start gap-2">
          <div className="mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-700 dark:text-text-secondary">
                {comment?.user?.name}
              </h3>
              {
                comment?.user.stripeSubscriptionStatus === "active" && (
                  <Tooltip label="Hashnode Clone Pro User" position="bottom" style={{
                    fontSize: "0.8rem",
                    fontWeight: "400",
                    letterSpacing: "0.5px"
                  }}>
                    <span className="px-2 py-1 tracking-wider rounded-md bg-light-bg dark:bg-primary-light border border-border-light dark:border-border font-semibold text-xs text-gray-700 dark:text-text-secondary">PRO</span>
                  </Tooltip>
                )
              }
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

        <CommentFooter
          handleLike={handleLike}
          like={like}
          comment={comment}
          ShowRepliesSection={ShowRepliesSection}
          isLoading={isLoading}
          replyComment={replyComment}
        />
      </div>

      {showReplies && (
        <div>
          {replies.replies?.map((reply, index) =>
            replyingUserDetails?.id === reply.id &&
              replyingUserDetails?.id === comment.id ? (
              <div key={index} className="">
                <CommentCard
                  commentFunc={commentFunc}
                  comment={reply}
                  key={reply.id}
                  type="REPLY"
                  setReplyingUserDetails={setReplyingUserDetails}
                  replyingUserDetails={replyingUserDetails}
                  replyComment={replyComment}
                  publishing={publishing}
                  authorUsername={authorUsername}
                />

                <div className="relative pl-4 pt-7">
                  <ReplyDetails
                    replyText={replyText}
                    setReplyText={setReplyText}
                    replyingUserDetails={replyingUserDetails}
                    publishing={publishing}
                    cancelReply={cancelReply}
                    handleReply={handleReply}
                    commentId={comment.id}
                  />
                </div>
              </div>
            ) : (
              <CommentCard
                commentFunc={commentFunc}
                comment={reply}
                key={reply.id}
                type="REPLY"
                setReplyingUserDetails={setReplyingUserDetails}
                replyingUserDetails={replyingUserDetails}
                replyComment={replyComment}
                publishing={publishing}
                authorUsername={authorUsername}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
