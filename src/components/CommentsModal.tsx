import Image from "next/image";
import React, { type FC, useContext, useState } from "react";
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
  const { mutateAsync: comment } = api.posts.newComment.useMutation();
  const [commentId, setCommentId] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const { data: comments, isLoading } = api.posts.getComments.useQuery(
    {
      articleId: id,
    },
    {
      enabled: !!id,
    }
  );

  const commentFunc = async (type: "REPLY" | "COMMENT", content: string) => {
    await comment({
      articleId: id,
      content,
      commentId,
      type,
    });
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
        <header className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold text-gray-700 dark:text-text-secondary">
            Comments (0)
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

        <main className="border-b border-border-light p-4 dark:border-border">
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
            placeholder="Write a thoughtful comment..."
          />

          <div
            onClick={() => void commentFunc("COMMENT", text)}
            className="flex-end flex justify-end"
          >
            <button className="btn-filled">Comment</button>
          </div>
        </main>

        <section className="h-full">
          {!isLoading &&
            comments?.map((comment) => (
              <CommentCard
                setCommentId={setCommentId}
                commentFunc={commentFunc}
                type="COMMENT"
                comment={comment}
                key={comment.id}
              />
            ))}
        </section>
      </section>
    </>
  );
};

export default CommentsModal;
