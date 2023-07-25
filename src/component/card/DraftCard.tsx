import { type FC } from "react";

interface Props {
  draft: { title: string; updatedAt: Date; id: string };
}

const DraftCard: FC<Props> = ({ draft }) => {
  return (
    <div className="my-2">
      <h1 className="text-lg font-bold text-blue-400">{draft.title}</h1>
      <h1 className="flex gap-1 text-sm font-medium text-gray-700 dark:text-text-secondary">
        <span>Edited:</span>
        <span>{new Date(draft.updatedAt).toDateString()}</span>
      </h1>
    </div>
  );
};

export default DraftCard;
