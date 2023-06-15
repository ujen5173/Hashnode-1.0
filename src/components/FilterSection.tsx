import React, { type FC } from "react";
import type { FilterData } from "./MainBodyArticles";
import Select from "./Select";
import Tags from "./Tags";

const FilterSection: FC<{
  filter: FilterData;
  setFilter: React.Dispatch<React.SetStateAction<FilterData>>;
  applyFilter: () => void;
  clearFilter: () => void;
}> = ({ filter, setFilter, applyFilter, clearFilter }) => {
  return (
    <section className="relative flex w-full flex-col justify-between gap-4 border-b border-border-light p-4 dark:border-border sm:flex-row sm:gap-12">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row">
        <div className="flex-1">
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
        <div className="flex-1">
          <label
            className="mb-2 inline-block text-gray-700 dark:text-text-secondary"
            htmlFor="read_time"
          >
            Tags
          </label>
          <Tags filter={filter} setFilter={setFilter} />
        </div>
      </div>
      <div className="mt-0 flex w-max flex-wrap items-start gap-2 sm:mt-8">
        <button
          onClick={() => void applyFilter()}
          className="btn-outline w-full"
        >
          Apply
        </button>
        <button onClick={clearFilter} className="btn-subtle w-full">
          Clear Filter
        </button>
      </div>
    </section>
  );
};

export default FilterSection;
