import { People, Magic, Star, Filter } from "~/svgs";
import { type FC } from "react";
import type { FilterData } from "./MainBodyArticles";
import FilterSection from "./FilterSection";

interface MainBodyHeaderProps {
  filter: FilterData;
  setFilter: React.Dispatch<React.SetStateAction<FilterData>>;
  applyFilter: () => void;
}

const MainBodyHeader: FC<MainBodyHeaderProps> = ({
  filter,
  setFilter,
  applyFilter,
}) => {
  const clearFilter = () => {
    setFilter((prev) => ({
      ...prev,
      data: {
        read_time: null,
        tags: [],
      },
    }));
  };

  return (
    <>
      <header className="w-full overflow-auto border-b border-border-light pt-2 dark:border-border">
        <div className="flex w-full items-end justify-between gap-16 px-2">
          <div className="flex items-center gap-2">
            <button aria-label="icon" role="button" className="btn-tab">
              <Magic className="h-4 w-4 fill-gray-700 dark:fill-text-primary" />
              <span className="text-sm font-semibold">Personalized</span>
            </button>
            <button aria-label="icon" role="button" className="btn-tab">
              <People className="h-4 w-4 fill-none stroke-gray-700 dark:stroke-text-primary" />
              <span className="text-sm font-semibold">Following</span>
            </button>
            <button aria-label="icon" role="button" className="btn-tab">
              <Star className="h-4 w-4 fill-gray-700 dark:fill-text-primary" />
              <span className="text-sm font-semibold">Featured</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div
              onClick={() => {
                setFilter((prev) => ({
                  ...prev,
                  status: !prev.status,
                }));
              }}
              className="btn-tab cursor-pointer"
            >
              <button
                aria-label="icon"
                role="button"
                className="relative flex items-center justify-center"
              >
                <Filter
                  className={`h-4 w-4 ${
                    filter.data.read_time !== null ||
                    filter.data.tags.length > 0
                      ? "fill-secondary stroke-secondary"
                      : ""
                  } fill-gray-700 dark:fill-text-primary`}
                />
              </button>
              <span
                className={`${
                  filter.data.read_time !== null || filter.data.tags.length > 0
                    ? "text-secondary"
                    : "text-gray-700 dark:text-text-primary"
                }`}
              >
                Filter
              </span>
            </div>
          </div>
        </div>
      </header>

      {filter.status && (
        <FilterSection
          filter={filter}
          setFilter={setFilter}
          applyFilter={applyFilter}
          clearFilter={clearFilter}
        />
      )}
    </>
  );
};

export default MainBodyHeader;
