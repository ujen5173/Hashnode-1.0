import { TRPCClientError } from "@trpc/client";
import Image from "next/image";
import React, { useContext, useState, type FC } from "react";
import { toast } from "react-toastify";
import { Times } from "~/svgs";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import CommentCard from "./Cards/CommentCard";

const CommentsModal: FC<{
  id: string;
  commentsModal: boolean;
  setCommentsModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ id, commentsModal, setCommentsModal }) => {
  const { user } = useContext(C) as ContextValue;
  const [commentId, setCommentId] = useState<string | null>(null);
  const [replyingUsername, setReplyingUsername] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [reply, setReply] = useState<boolean>(false);
  const {
    data: comments,
    isLoading,
    refetch,
  } = api.comments.getComments.useQuery(
    {
      articleId: id,
    },
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
    }
  );

  const { mutateAsync: comment, isLoading: publishing } =
    api.comments.newComment.useMutation();

  const commentFunc = async (type: "REPLY" | "COMMENT", content: string) => {
    try {
      if (!user) {
        toast.error("You need to login to comment");
        return;
      }
      if (text.length < 5) {
        toast.error("Comment is too short");
        return;
      }
      if (text.length > 255) {
        toast.error("Comment is too long");
        return;
      }
      await comment({
        articleId: id,
        content,
        commentId,
        type,
      });
      await refetch();
      toast.success("Commented successfully");
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast.error(err.message);
      }
    }
  };

  const cancelComment = () => {
    setReply(false);
    setCommentId(null);
    setReplyingUsername(null);
    setText("");
  };

  return (
    <>
      <div
        onClick={() => {
          setCommentsModal(false);
        }}
        className={`fixed inset-0 bg-primary-light bg-opacity-50`}
      />
      <section
        className={`fixed right-0 top-0 h-full min-h-screen w-full max-w-[450px] overflow-auto border-l border-border-light bg-light-bg dark:border-border dark:bg-primary ${
          commentsModal ? "commentsModal" : "commentsModal-off"
        }`}
      >
        <header className="flex items-center justify-between border-b border-border-light p-4 dark:border-border">
          <h2 className="text-xl font-bold text-gray-700 dark:text-text-secondary">
            Comments ({comments?.totalComments})
          </h2>
          <button
            onClick={() => {
              setCommentsModal(false);
            }}
            className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-primary"
          >
            <Times className="h-6 w-6 fill-gray-700 dark:fill-text-secondary" />
          </button>
        </header>

        <main className="border-b border-border-light p-4 pl-2 dark:border-border">
          {user && (
            <div className="flex items-center space-x-2 p-2">
              <Image
                src={user?.user.profile}
                alt="user"
                width={40}
                height={40}
                className="h-10 w-10 overflow-hidden rounded-full object-cover"
              />
              <div className="flex flex-col space-y-1">
                <h3 className="text-lg font-bold text-gray-700 dark:text-text-secondary">
                  {user?.user.name}
                </h3>
              </div>
            </div>
          )}

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[12rem] w-full resize-none rounded-lg bg-transparent p-4 text-lg text-gray-700 outline-none dark:text-text-secondary"
            placeholder={
              reply
                ? `Reply to @${replyingUsername || "unknown user"}`
                : "Write a thoughtful comment..."
            }
          />

          <div className="flex-end flex justify-end gap-2">
            {reply ? (
              <button
                className={`btn-filled ${
                  publishing ? "cursor-not-allowed opacity-40" : ""
                }`}
                aria-label="Reply Button"
                disabled={publishing}
                onClick={() => !publishing && void commentFunc("REPLY", text)}
              >
                {publishing ? "Replying..." : "Reply"}
              </button>
            ) : (
              <button
                className={`btn-filled ${
                  publishing ? "cursor-not-allowed opacity-40" : ""
                }`}
                aria-label="Comment Button"
                disabled={publishing}
                onClick={() => !publishing && void commentFunc("COMMENT", text)}
              >
                {publishing ? "Publishing..." : "Comment"}
              </button>
            )}
            <button
              className="btn-outline"
              aria-label="Cancel Button"
              onClick={() => void cancelComment()}
            >
              Cancel
            </button>
          </div>
        </main>

        <section className="h-full">
          {!isLoading &&
            comments?.comments?.map((comment) => (
              <CommentCard
                setCommentId={setCommentId}
                commentFunc={commentFunc}
                type="COMMENT"
                comment={comment}
                setReply={setReply}
                key={comment.id}
                setReplyingUsername={setReplyingUsername}
              />
            ))}
        </section>
      </section>
    </>
  );
};

export default CommentsModal;
