import Search from "~/svgs/Search";
import Ai from "~/svgs/Ai";

const SearchArea = () => {
  return (
    <>
      <div className="hidden items-center gap-2 xl:flex">
        <button
          aria-label="Go to my feed"
          role="button"
          className="btn-outline"
        >
          My Feed
        </button>
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
        <span className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="h-4 w-4 stroke-gray-700 dark:stroke-text-primary" />
        </span>
        <input
          type="text"
          placeholder="Search Hashnode"
          className="input-primary w-full"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md border border-border-light bg-gray-200 px-2 py-1 text-gray-700 dark:border-border dark:bg-primary-light dark:text-text-primary">
          /
        </span>
      </div>
    </>
  );
};
export default SearchArea;
