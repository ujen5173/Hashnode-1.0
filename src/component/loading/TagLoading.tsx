import { type FC } from "react";

interface Props {
  variant?: "rounded" | "non-rounded";
}

const TagLoading: FC<Props> = ({ variant = "rounded" }) => {
  return (
    <div
      className={`loading flex h-16 w-full items-center gap-2 ${
        variant === "rounded" ? "rounded-md" : ""
      } border-b border-border-light bg-white p-2 dark:border-border dark:bg-primary`}
    >
      <div className="loading h-12 w-12 rounded-md bg-border-light dark:bg-primary" />
      <div className="flex-1">
        <div className="loading mb-2 h-4 w-7/12 rounded-md bg-border-light dark:bg-primary"></div>
        <div className="loading h-3 w-2/6 rounded-md bg-border-light dark:bg-primary"></div>
      </div>
    </div>
  );
};

export default TagLoading;
