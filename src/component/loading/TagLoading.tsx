import { type FC } from "react";

interface Props {
  variant?: "rounded" | "non-rounded";
}

const TagLoading: FC<Props> = ({ variant = "rounded" }) => {
  return (
    <div
      className={`loading flex h-16 w-full items-center gap-2 ${
        variant === "rounded" ? "rounded-md" : ""
      } border-b border-border-light p-2 dark:border-border`}
    >
      <div className="flex-1">
        <div className="loading mb-2 h-4 w-7/12 rounded-md bg-border-light dark:bg-border"></div>
        <div className="loading h-3 w-2/6 rounded-md bg-border-light dark:bg-border"></div>
      </div>
      <div className="loading h-12 w-12 rounded-md bg-border-light dark:bg-border" />
    </div>
  );
};

export default TagLoading;
