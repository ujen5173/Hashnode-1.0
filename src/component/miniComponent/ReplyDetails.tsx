import { type FC } from "react";
import { type DefaultEditorContent } from "~/types";
import Editor from "../editor";

interface Props {
  commentId: string;
  replyText: DefaultEditorContent;
  setReplyText: React.Dispatch<React.SetStateAction<DefaultEditorContent>>;
  replyingUserDetails: {
    id: string;
    username: string;
  } | null;
  publishing: boolean;
  handleReply: (id: string | null) => void;
  cancelReply: () => void;
  emptyEditor: boolean;
}

const ReplyDetails: FC<Props> = ({
  commentId,
  replyText,
  setReplyText,
  replyingUserDetails,
  publishing,
  cancelReply,
  handleReply,
  emptyEditor
}) => {
  return (
    <div className="relative pl-4 pt-7">
      <div className="absolute left-[2.15rem] top-0 h-6 w-[1.7px] bg-gray-400 dark:bg-[#475569]" />

      <div className="mb-2 rounded-md border border-border-light p-4 dark:border-border">
        <Editor
          value={replyText}
          onChange={(value) => setReplyText(value)}
          placeholder={`Reply to @${replyingUserDetails?.username as string}`}
          showBubbleMenu={false}
          renderLocalStorageData={false}
          minHeight="max-h-[150px]"
          emptyEditor={emptyEditor}
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
