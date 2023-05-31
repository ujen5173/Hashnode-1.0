import Link from "next/link";
import { useContext, type FC } from "react";
import { Pen, Updates, Sun, Notification } from "~/svgs";
import { C } from "~/utils/context";

const RightArea: FC = () => {
  const { handleTheme } = useContext(C);

  return (
    <>
      <Link href={"/new"}>
        <button
          aria-label="icon"
          role="button"
          className="btn-filled hidden items-center justify-center gap-2 hover:bg-blue-500 md:flex"
        >
          <Pen className="h-4 w-4 fill-white" />
          <span>Write</span>
        </button>
      </Link>
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
