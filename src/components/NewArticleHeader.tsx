import Link from "next/link";
import React, { useContext } from "react";
import { Angleleft, Cloud, LogonoText, Sun } from "~/svgs";
import { C } from "~/utils/context";

const NewArticleHeader = ({
  setPublishModal,
}: {
  setPublishModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { handleTheme } = useContext(C);
  return (
    <header className="w-full border-b border-border-light bg-white dark:border-border dark:bg-primary">
      <div className="mx-auto flex w-full max-w-[1000px] items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => history.back()}
            className="btn-icon-large hidden lg:flex"
          >
            <Angleleft className="h-5 w-5 fill-gray-700 dark:fill-text-secondary" />
          </button>

          <div>
            <Link href={`/u/@user`} className="flex items-center gap-2">
              <LogonoText className="h-7 w-7" />
              <span className="text-lg font-semibold text-gray-700 dark:text-text-secondary">
                ujenbasi&apos;s Blog
              </span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 border-r border-border-light px-4 dark:border-border">
            <div className="hidden items-center gap-2 lg:flex">
              <Cloud className="h-6 w-6" />
              <span className="text-base text-green">Saved</span>
            </div>

            <button onClick={handleTheme} className="btn-icon-large flex">
              <Sun className="h-6 w-6 stroke-gray-700 dark:stroke-text-secondary" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-subtle hidden text-sm text-gray-700 dark:text-white lg:flex">
              Preview
            </button>

            <button
              onClick={() => void setPublishModal(true)}
              className="btn-filled"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewArticleHeader;
