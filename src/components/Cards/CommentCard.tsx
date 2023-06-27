import Image from "next/image";
import React, { useContext, useState, type FC } from "react";
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
}> = ({ comment, type, commentFunc, setCommentId }) => {
  const [reply, setReply] = useState(false);
  const { user } = useContext(C) as ContextValue;
  const [text, setText] = useState<string>("");
  const { mutate: likeComment } = api.comments.likeComment.useMutation();

  const handleLike = () => {
    likeComment({ commentId: comment.id });
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
        <div className="mb-2 flex gap-2 py-2">
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
            <button className="btn-icon flex items-center gap-1 p-1">
              <button onClick={handleLike}>
                <Heart className="h-6 w-6 fill-none stroke-gray-700 dark:stroke-text-secondary" />
              </button>
              <span className="text-gray-700 dark:text-text-secondary">2</span>
            </button>
            <button className="btn-icon flex items-center gap-1 p-1">
              <button>
                <CommentSVG className="h-6 w-6 fill-none stroke-gray-700 dark:stroke-text-secondary" />
              </button>
              <span className="text-gray-700 dark:text-text-secondary">2</span>
            </button>

            <button
              onClick={() => {
                setCommentId(comment?.id);
                setReply(true);
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
            />
          ))}
        </div>
      </div>

      {reply && (
        <>
          <div className="absolute left-8 top-0 h-6 w-[2px] bg-gray-700 dark:bg-[#475569]" />

          <main className=" ">
            {user && (
              <div className="flex items-center space-x-2 p-2">
                <Image
                  src={user?.user?.profile}
                  alt="user"
                  width={40}
                  height={40}
                  className="h-10 w-10 overflow-hidden rounded-full object-cover"
                />
                <div className="flex flex-col space-y-1">
                  <h3 className="text-lg font-bold text-gray-700 dark:text-text-secondary">
                    {user?.user?.name}
                  </h3>
                </div>
              </div>
            )}

            <textarea
              className="min-h-[12rem] w-full resize-none rounded-lg bg-transparent p-4 text-lg text-gray-700 outline-none dark:text-text-secondary"
              placeholder="Write a thoughtful comment?..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex-end flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setReply(false);
                }}
                className="btn-subtle"
              >
                Cancel
              </button>
              <button
                onClick={() => void commentFunc("COMMENT", text)}
                className="btn-filled"
              >
                Comment
              </button>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default CommentCard;
