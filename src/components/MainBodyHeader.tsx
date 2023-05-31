import { People, Magic, Star, Filter } from "~/svgs";
import { useState } from "react";
import Select from "./Select";
import Tags from "./Tags";

export interface FilterData {
  status: boolean;
  data: {
    read_time: number | null;
    tags: Tag[];
  };
}

export interface Tag {
  id: string;
  name: string;
}

const MainBodyHeader = () => {
  const [filter, setFilter] = useState<FilterData>({
    status: false,
    data: {
      read_time: null,
      tags: [],
    },
  });

  const clearFilter = () => {
    setFilter({
      ...filter,
      data: {
        read_time: null,
        tags: [],
      },
    });
  };

  const applyFilter = () => {
    setFilter({
      ...filter,
      status: false,
    });
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
        <section className="relative flex w-full justify-between gap-12 border-b border-border-light p-4 dark:border-border">
          <div className="flex w-8/12 gap-4">
            <div>
              <label
                className="mb-2 inline-block text-gray-700 dark:text-text-secondary"
                htmlFor="read_time"
              >
                Read Time
              </label>
              <Select
                defaultText={"Select read time"}
                options={["Under 5 min", "5 min", "Over 5 min"]}
              />
            </div>
            <div>
              <label
                className="mb-2 inline-block text-gray-700 dark:text-text-secondary"
                htmlFor="read_time"
              >
                Tags
              </label>
              <Tags filter={filter} setFilter={setFilter} />
            </div>
          </div>
          <div className="mt-8 flex items-start gap-2">
            <button onClick={applyFilter} className="btn-outline">
              Apply
            </button>
            <button onClick={clearFilter} className="btn-subtle">
              Clear Filter
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default MainBodyHeader;
