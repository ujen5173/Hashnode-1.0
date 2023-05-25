import { type FC } from "react";
import Pen from "./../svgs/Pen";
import Updates from "./../svgs/Updates";
import Sun from "./../svgs/Sun";
import Notification from "./../svgs/Notification";

interface RightAreaProps {
  handleTheme: () => void;
}

const RightArea: FC<RightAreaProps> = ({ handleTheme }) => {
  return (
    <>
      <button
        aria-label="icon"
        role="button"
        className="btn-filled hidden items-center justify-center gap-2 hover:bg-blue-500 md:flex"
      >
        <Pen className="h-4 w-4 fill-white" />
        <span>Write</span>
      </button>
      <button
        aria-label="icon"
        role="button"
        className="btn-icon hidden h-10 w-10 xl:flex"
      >
        <Updates className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-primary" />
      </button>
      <button
        aria-label="icon"
        role="button"
        className="btn-icon flex h-10 w-10"
        onClick={handleTheme}
      >
        <Sun className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-primary" />
      </button>
      <button
        aria-label="icon"
        role="button"
        className="btn-icon hidden h-10 w-10 md:flex"
      >
        <Notification className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-primary" />
      </button>
    </>
  );
};

export default RightArea;
