import { type FC } from "react";

interface Props {
  commentId: string;
  replyText: string;
  setReplyText: React.Dispatch<React.SetStateAction<string>>;
  replyingUserDetails: {
    id: string;
    username: string;
  } | null;
  publishing: boolean;
  handleReply: (id: string | null) => void;
  cancelReply: () => void;
}

const ReplyDetails: FC<Props> = ({
  commentId,
  replyText,
  setReplyText,
  replyingUserDetails,
  publishing,
  cancelReply,
  handleReply,
}) => {
  return (
    <div className="relative pl-4 pt-7">
      <div className="absolute left-[2.15rem] top-0 h-6 w-[1.7px] bg-gray-400 dark:bg-[#475569]" />

      <div className="mb-2 rounded-md border border-border-light dark:border-border">
        <textarea
          className="w-full h-20 p-2 rounded-md resize-none outline-none text-gray-700 dark:text-text-secondary bg-transparent"
          placeholder={`Reply to @${replyingUserDetails?.username as string}`}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />

        <div className="flex-end flex justify-end gap-2">
          <button
            className={`btn-filled ${publishing ? "cursor-not-allowed opacity-40" : ""
              }`}
            aria-label="Reply Button"
            disabled={publishing}
            onClick={() => handleReply(commentId)}
          >
            {publishing ? "Replying..." : "Reply"}
          </button>

          <button
            className="btn-outline"
            aria-label="Cancel Reply Button"
            onClick={() => void cancelReply()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyDetails;
