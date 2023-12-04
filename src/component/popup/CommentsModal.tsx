import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useRef, useState, type FC } from "react";

import { TRPCError } from "@trpc/server";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { type Comment } from "~/types";
import { api } from "~/utils/api";
import { CommentCard } from "../card";

const CommentsModal: FC<{
  id: string;
  commentsModal: boolean;
  authorUsername: string;
  setCommentsModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  id,
  commentsModal,
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
    const [commentState, setCommentState] = useState<{
      articleId: string;
      parentId?: string | null;
      type: "INITIAL" | "ALL";
    }>({
      articleId: id,
      type: "INITIAL",
      parentId: null,
    });

    const repliesButtonRef = useRef<boolean[]>([]);

    const {
      data: comments,
      isLoading,
      refetch,
    } = api.comments.getComments.useQuery(
      commentState,
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
        retry: 0,
      }
    );


    const [commentsData, setCommentsData] = useState<{
      count: number;
      comments: Comment[];
    }>({
      count: 0,
      comments: [],
    });

    useEffect(() => {
      if (commentState.type === "INITIAL") {
        setCommentsData({
          count: comments?.count ?? 0,
          comments: comments?.comments ?? [],
        });
      } else {
        setCommentsData(prev => ({
          ...prev,
          comments: prev.comments.map(e => {
            if (e.id === commentState.parentId) {
              return comments?.comments.find(e => e.id === commentState.parentId) ?? e
            } else {
              return e;
            }
          })
        }))
      }
    }, [commentState, comments]);

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

        const commentData = await comment({
          articleId: id,
          content: content,
          commentId: replyingUserDetails?.id,
          type,
        });

        if (type === 'COMMENT') {
          setCommentsData((prev) => ({
            count: prev.count + 1,
            comments: [commentData, ...prev.comments],
          }));
        } else {
          setCommentsData((prev) => ({
            count: prev.count,
            comments: prev.comments.map((e) => {
              if (e.id === commentState.parentId) {
                return {
                  ...e,
                  replies: [commentData, ...e.replies],
                };
              } else {
                return e;
              }
            }),
          }));
        }

        toast.success("Commented successfully");
        setText("")

        await refetch();
      } catch (err) {
        if (err instanceof TRPCError) {
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
              Comments
              ({commentsData.count})
            </h2>
            <button
              onClick={() => {
                setCommentsModal(false);
              }}
              className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-primary"
            >
              <X className="h-6 w-6 stroke-gray-700 dark:stroke-text-secondary" />
            </button>
          </header>

          <main className="border-b border-border-light p-4 pl-2 dark:border-border">
            {user && (
              <div className="flex items-center space-x-2 p-2">
                <Image
                  src={user?.user.image}
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

          <section className="h-max">
            {isLoading && commentState.type === 'INITIAL' ? (
              Array(3).fill("").map((_, i) => (
                <CommentsLoading key={i} />
              ))
            ) : commentsData.comments.length > 0 ? commentsData.comments.map((comment, index) => {
              if (repliesButtonRef.current[index] === undefined) {
                repliesButtonRef.current[index] = false
              }
              return (
                <div className={`relative px-4 border-b border-border-light py-3 last:border-none dark:border-border`}
                  key={comment.id}
                >
                  <CommentCard
                    commentFunc={commentFunc}
                    type="COMMENT"
                    publishing={publishing}
                    comment={comment}
                    commentState={commentState}
                    setReplyingUserDetails={setReplyingUserDetails}
                    replyingUserDetails={replyingUserDetails}
                    replyComment={replyComment}
                    isLoading={isLoading}
                    authorUsername={authorUsername}
                    setCommentState={setCommentState}
                  />
                  {
                    (comment.repliesCount > 1 || (comment.replies[0]?.repliesCount !== undefined && comment.replies[0]?.repliesCount > 0)) && repliesButtonRef.current[index] == false && (
                      <button
                        onClick={() => {
                          repliesButtonRef.current[index] = true
                          setCommentState(prev => ({
                            ...prev,
                            type: "ALL",
                            parentId: comment.id
                          }))
                        }} className="text-twitterColor">View all replies</button>
                    )
                  }
                </div>
              )
            }) : (
              <div className="flex items-center justify-center h-full py-16">
                <p className="text-gray-700 dark:text-text-secondary">
                  No comments yet
                </p>
              </div>
            )}
          </section>
        </section>
      </>
    );
  };

export default CommentsModal;


export const CommentsLoading = () => {
  return (
    <div className="border-b border-border-light p-4 last:border-0 dark:border-border">
      <div className="mb-4 flex gap-2">
        <div className="loading h-10 w-10 rounded-full bg-border-light dark:bg-border" />
        <div>
          <div className="loading mb-2 h-3 w-36 rounded-full bg-border-light dark:bg-border" />
          <div className="loading h-3 w-48 rounded-full bg-border-light dark:bg-border" />
        </div>
      </div>
      <div className="w-full pt-4 pb-6">
        <div className="loading mb-2 h-3 w-full rounded-full bg-border-light dark:bg-border" />
        <div className="loading mb-2 h-3 w-full rounded-full bg-border-light dark:bg-border" />
        <div className="loading h-3 w-full rounded-full bg-border-light dark:bg-border" />
      </div>
    </div>
  )
}