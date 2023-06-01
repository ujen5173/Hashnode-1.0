import { useClickOutside } from "@mantine/hooks";
import Link from "next/link";
import { useContext, useState, type FC } from "react";
import { Pen, Updates, Sun, Notification as NotificationSVG } from "~/svgs";
import { C } from "~/utils/context";
import Notification from "./Notification";

const RightArea: FC = () => {
  const { handleTheme } = useContext(C);
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpened(false));
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
      <div className="relative">
        <button
          onClick={() => setOpened((prev) => !prev)}
          aria-label="icon"
          role="button"
          className="btn-icon hidden h-10 w-10 md:flex"
        >
          <NotificationSVG className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-primary" />
        </button>
        {opened && (
          <div ref={ref} className="absolute right-0 top-full mt-2">
            <Notification />
          </div>
        )}
      </div>
    </>
  );
};

export default RightArea;
