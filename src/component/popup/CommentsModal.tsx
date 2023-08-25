import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useRef, useState, type FC } from "react";
import { toast } from "react-toastify";
import { Times } from "~/svgs";
import { api } from "~/utils/api";
import { CommentCard } from "../card";

const CommentsModal: FC<{
  id: string;
  commentsModal: boolean;
  authorUsername: string;
  setCommentsModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCommentsCount: React.Dispatch<React.SetStateAction<number>>;
}> = ({
  id,
  commentsModal,
  setCommentsCount,
  authorUsername,
  setCommentsModal,
}) => {
    const { data: user } = useSession();
    const [replyingUserDetails, setReplyingUserDetails] = useState<{
      id: string;
      username: string;
    } | null>(null);
    const [text, setText] = useState("");
    const commentSection = useRef<HTMLDivElement | null>(null);
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

    useEffect(() => {
      if (comments) {
        setCommentsCount(comments.totalComments);
      }
    }, [comments]);

    const { mutateAsync: comment, isLoading: publishing } =
      api.comments.newComment.useMutation();

    const commentFunc = async (type: "REPLY" | "COMMENT", content: string) => {
      try {
        if (!user) {
          toast.error("You need to login to comment");
          return;
        }
        if (content.length < 5) {
          toast.error("Comment is too short");
          return;
        }
        if (content.length > 255) {
          toast.error("Comment is too long");
          return;
        }
        await comment({
          articleId: id,
          content: content,
          commentId: replyingUserDetails?.id,
          type,
        });
        toast.success("Commented successfully");
        setText("")
        await refetch();
      } catch (err) {
        if (err instanceof TRPCClientError) {
          // setEmptyEditor(true);
          toast.error(err.message);
        }
      }
    };

    const replyComment = (comment: { id: string; username: string }) => {
      setReplyingUserDetails(comment);
    };

    const cancelComment = () => {
      setText("")
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
          ref={commentSection}
          className={`fixed right-0 top-0 h-full min-h-[100dvh] w-full max-w-[450px] overflow-auto border-l border-border-light bg-light-bg dark:border-border dark:bg-primary ${commentsModal ? "commentsModal" : "commentsModal-off"
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
                  <h3 className="text-base font-semibold text-gray-700 dark:text-text-secondary">
                    {user?.user.username}
                  </h3>
                </div>
              </div>
            )}

            <div className="">
              <textarea
                className="w-full h-20 p-2 rounded-md bg-transparent resize-none text-gray-700 dark:text-text-secondary outline-none"
                placeholder="Write a thoughtful comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className="flex-end flex justify-end gap-2">
              <button
                className={`btn-filled ${publishing ? "cursor-not-allowed opacity-40" : ""
                  }`}
                aria-label="Comment Button"
                disabled={publishing}
                onClick={() => !publishing && void commentFunc("COMMENT", text)}
              >
                {publishing ? "Publishing..." : "Comment"}
              </button>
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
                  commentFunc={commentFunc}
                  type="COMMENT"
                  publishing={publishing}
                  comment={comment}
                  key={comment.id}
                  setReplyingUserDetails={setReplyingUserDetails}
                  replyingUserDetails={replyingUserDetails}
                  replyComment={replyComment}
                  authorUsername={authorUsername}
                />
              ))}
          </section>
        </section>
      </>
    );
  };

export default CommentsModal;
