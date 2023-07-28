import React, { type FC, type KeyboardEvent } from "react";
import { v4 as uuid } from "uuid";
import { Search, Times } from "~/svgs";
import { type FilterData } from "~/types";

interface Props {
  filter: FilterData;
  setFilter: React.Dispatch<React.SetStateAction<FilterData>>;
}

const Tag: FC<Props> = ({ filter, setFilter }) => {
  const handleChange = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.target as HTMLInputElement).value.trim() === "") return;

    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const inputValue = (e.target as HTMLInputElement).value;

      setFilter((prevFilter) => ({
        ...prevFilter,
        data: {
          ...prevFilter.data,
          tags: [
            ...prevFilter.data.tags,
            {
              id: uuid(),
              name: inputValue,
            },
          ],
        },
      }));

      (e.target as HTMLInputElement).value = "";
    }
  };

  return (
    <div className="min-w-[180px]">
      <div className="relative mb-2">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search className="h-5 w-5 stroke-gray-700 dark:stroke-border-light" />
        </div>
        <input
          placeholder="Tab to select"
          onKeyDownCapture={handleChange}
          className="flex w-full items-center justify-between rounded-md border border-border-light bg-light-bg px-10 py-2 text-base text-gray-700 outline-none transition-[ring] duration-100 focus:bg-light-bg focus:ring-1 focus:ring-secondary dark:border-border dark:bg-transparent dark:text-text-primary hover:dark:border-border dark:focus:bg-primary-light"
        />
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {filter.data.tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center justify-center rounded-md border border-border-light bg-light-bg px-2 py-1 text-sm text-gray-700 dark:border-border dark:bg-primary-light dark:text-text-primary"
          >
            <span>{tag.name}</span>
            <button
              aria-label="icon"
              role="button"
              onClick={() => {
                setFilter((prev) => ({
                  ...prev,
                  data: {
                    ...prev.data,
                    tags: prev.data.tags.filter((t) => t.id !== tag.id),
                  },
                }));
              }}
              className="ml-2 flex items-center justify-center"
            >
              <Times className="h-4 w-4 fill-gray-700 dark:fill-text-primary" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tag;
