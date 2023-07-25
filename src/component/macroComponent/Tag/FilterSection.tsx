import React, { type FC } from "react";
import { Select } from "~/component/miniComponent";
import { type FilterData } from "~/types";
import Tag from "./Tag";

interface Props {
  filter: FilterData;
  setFilter: React.Dispatch<React.SetStateAction<FilterData>>;
  applyFilter: () => void;
  clearFilter: () => void;
}

const FilterSection: FC<Props> = ({
  filter,
  setFilter,
  applyFilter,
  clearFilter,
}) => {
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
            defaultText={filter.data.read_time || "Select"}
            options={[
              { label: "Under 5 min", value: "under_5" },
              { label: "5 min", value: "5" },
              { label: "Over 5 min", value: "over_5" },
            ]}
            onChange={(value) =>
              setFilter((prev) => ({
                ...prev,
                data: {
                  ...prev.data,
                  read_time: value.label as
                    | "Over 5 min"
                    | "Under 5 min"
                    | "5 min",
                },
              }))
            }
          />
        </div>

        <div className="flex-1">
          <label
            className="mb-2 inline-block text-gray-700 dark:text-text-secondary"
            htmlFor="read_time"
          >
            Tags
          </label>

          <Tag filter={filter} setFilter={setFilter} />
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
