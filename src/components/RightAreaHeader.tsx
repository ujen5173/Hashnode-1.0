import { useClickOutside } from "@mantine/hooks";
import Link from "next/link";
import { useContext, useState, type FC } from "react";
import { Notification as NotificationSVG, Pen, Sun, Updates } from "~/svgs";
import { C, type ContextValue } from "~/utils/context";
import Notification from "./Notification";

const RightArea: FC = () => {
  const { user, handleTheme } = useContext(C) as ContextValue;
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpened(false));

  return (
    <>
      {!!user && (
        <Link href={"/new"}>
          <button
            aria-label="icon"
            role="button"
            className="btn-filled hidden items-center justify-center gap-2 hover:bg-blue-500 sm:flex"
          >
            <Pen className="h-4 w-4 fill-white stroke-white" />
            <span>Write</span>
          </button>
        </Link>
      )}
      <Link href={"/new"}>
        <button
          aria-label="icon"
          role="button"
          className="btn-icon flex h-10 w-10 xl:hidden"
        >
          <Pen className="h-5 w-5 fill-gray-700 stroke-gray-700 dark:fill-text-primary dark:stroke-text-primary" />
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
      <div className="relative">
        <button
          onClick={() => setOpened((prev) => !prev)}
          aria-label="icon"
          role="button"
          className="btn-icon hidden h-10 w-10 sm:flex"
        >
          <NotificationSVG className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-primary" />
        </button>
        {opened && (
          <div
            ref={ref}
            className="absolute right-0 top-full z-50 mt-2 hidden sm:block"
          >
            <Notification />
          </div>
        )}
      </div>
    </>
  );
};

export default RightArea;
