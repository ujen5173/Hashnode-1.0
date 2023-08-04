import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useContext, type FC } from "react";
import { Angleleft, Cloud, LogonoText, Sun } from "~/svgs";
import LoadingSpinner from "~/svgs/LoadingSpinner";
import { C, type ContextValue } from "~/utils/context";

interface Props {
  publishing: boolean;
  savedState: boolean;
  setPublishModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewArticleHeader: FC<Props> = ({
  savedState,
  setPublishModal,
  publishing,
}) => {
  const { handleTheme } = useContext(C) as ContextValue;
  const { data: user } = useSession()

  return (
    <header className="w-full border-b border-border-light bg-white dark:border-border dark:bg-primary">
      <div className="mx-auto flex w-full max-w-[1000px] items-center justify-between px-4 py-3">
        <div className="flex items-center justify-start gap-2">
          <Link href="/">
            <button
              aria-label="icon"
              role="button"
              className="btn-icon flex h-10 w-10"
            >
              <Angleleft className="h-4 w-4 fill-gray-700 dark:fill-text-secondary" />
            </button>
          </Link>

          <div>
            <Link
              href={`/u/@${user?.user.username as string}`}
              className="flex items-center gap-2"
            >
              <LogonoText className="h-7 fill-secondary" />
              <span className="hidden text-sm font-semibold text-gray-700 dark:text-text-secondary sm:block md:text-lg">
                {user?.user.username}&apos;s Blog
              </span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4 border-r border-border-light px-4 dark:border-border">
            <div className="hidden items-center gap-2 sm:flex">
              {savedState ? (
                <div className="flex items-center justify-center gap-2">
                  <Cloud className="h-6 w-6" />
                  <span className="text-base text-green">Saved</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner className="h-6 w-6 fill-none stroke-gray-500" />
                  <span className="text-base text-gray-500">Saving...</span>
                </div>
              )}
            </div>

            <button onClick={handleTheme} className="btn-icon-large flex">
              <Sun className="h-6 w-6 stroke-gray-700 dark:stroke-text-secondary" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="gradient-button hidden items-center justify-center gap-1 lg:flex">
              <UpgradeRocket />
              <span className="gradient-text font-semibold">Upgrade</span>
            </button>

            <button
              disabled={publishing}
              onClick={() => void setPublishModal(true)}
              className={`${publishing ? "opacity-50" : ""} btn-filled`}
            >
              {publishing ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewArticleHeader;

const UpgradeRocket = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={18}
      height={18}
      viewBox="0 0 18 18"
    >
      <path
        d="M8.82678 11.25L6.74988 9.17313M8.82678 11.25C9.79381 10.8822 10.7215 10.4184 11.596 9.86543M8.82678 11.25V14.7115C8.82678 14.7115 10.9244 14.3308 11.596 13.3269C12.3437 12.2054 11.596 9.86543 11.596 9.86543M6.74988 9.17313C7.11828 8.21736 7.58217 7.3012 8.13448 6.43855C8.94113 5.14879 10.0643 4.08684 11.3973 3.35373C12.7302 2.62061 14.2286 2.24071 15.7498 2.25014C15.7498 4.13319 15.2098 7.44238 11.596 9.86543M6.74988 9.17313H3.28839C3.28839 9.17313 3.66915 7.07546 4.67299 6.40393C5.79451 5.65625 8.13448 6.40393 8.13448 6.40393M11.876 6.54812C11.7589 6.66527 11.5689 6.66527 11.4517 6.54812C11.3346 6.43096 11.3346 6.24101 11.4517 6.12385M11.876 6.54812C11.9932 6.43096 11.9932 6.24101 11.876 6.12385C11.7589 6.0067 11.5689 6.00669 11.4517 6.12385M11.876 6.54812L11.4517 6.12385M3.63454 12.2885C2.59609 13.1608 2.24994 15.75 2.24994 15.75C2.24994 15.75 4.83914 15.4038 5.71143 14.3654C6.20297 13.7838 6.19604 12.8908 5.64913 12.3508C5.38003 12.0939 5.02557 11.9455 4.65376 11.934C4.28195 11.9225 3.91899 12.0488 3.63454 12.2885Z"
        stroke='url("#paint0_linear_3307_76245")'
        strokeWidth="1.5px"
        strokeLinecap="round"
        strokeLinejoin="round"
        fillOpacity="0"
        fill="#000000"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_3307_76245"
          x1="12.6913"
          y1="-0.260518"
          x2="3.47622"
          y2="16.9608"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3466F6"></stop>
          <stop offset="0.0001" stopColor="#3466F6"></stop>
          <stop offset="1" stopColor="#7C3AED"></stop>
        </linearGradient>
        <linearGradient
          id="paint0_linear_3307_76245"
          x1="12.6913"
          y1="-0.260518"
          x2="3.47622"
          y2="16.9608"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3466F6"></stop>
          <stop offset="0.0001" stopColor="#3466F6"></stop>
          <stop offset="1" stopColor="#7C3AED"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};
