import Link from "next/link";
import { useContext, type FC } from "react";
import { Ai, Search } from "~/svgs";
import { C, type ContextValue } from "~/utils/context";

const SearchArea: FC = () => {
  const { setSearchOpen } = useContext(C) as ContextValue;

  return (
    <>
      <div className="hidden items-center gap-2 xl:flex">
        <Link href="/">
          <button
            aria-label="Go to my feed"
            role="button"
            className="btn-outline"
          >
            My Feed
          </button>
        </Link>

        <button
          aria-label="Unlock the power of AI"
          role="button"
          className="btn-subtle flex items-center justify-center gap-4"
        >
          <span>Rix</span>
          <Ai className="h-4 w-4" />
        </button>
      </div>

      <div className="relative hidden flex-1 lg:block">
        <div onClick={() => setSearchOpen(true)} className="relative z-30">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search className="h-4 w-4 stroke-gray-700 dark:stroke-text-primary" />
          </div>

          <div
            className={`h-10 w-full rounded-full border border-border-light px-10 py-2 text-gray-700 dark:border-border dark:text-text-primary`}
          >
            Search for Javascript...
          </div>

          <div className="absolute right-4 top-1/2 flex -translate-y-1/2 gap-2">
            <span className="rounded-md border border-border-light bg-gray-200 px-2 py-1 text-xs text-gray-700 dark:border-border dark:bg-primary-light dark:text-text-primary">
              CTRL + K
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
export default SearchArea;
