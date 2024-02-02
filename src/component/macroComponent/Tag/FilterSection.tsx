import { useContext } from "react";
import { Select } from "~/component/miniComponent";
import { READ_TIME_DEFAULT_TEXTS, READ_TIME_OPTIONS } from "~/hooks/useFilter";
import { C } from "~/utils/context";
import Tag from "./Tag";

const FilterSection = () => {
  const {
    filter,
    setFilter,
    filterActions
  } = useContext(C)!;

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
            defaultText={filter.data.read_time ? READ_TIME_DEFAULT_TEXTS[filter.data.read_time] : "Select"}
            options={READ_TIME_OPTIONS}
            onChange={(value) => {
              setFilter((prev) => ({
                ...prev,
                data: {
                  ...prev.data,
                  read_time: value.value as 'UNDER_5' | '5' | 'OVER_5',
                  shouldApply: false,
                },
              }))
            }
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
          onClick={filterActions.applyFilter}
          className="btn-outline w-full"
        >
          Apply
        </button>
        <button onClick={filterActions.clearFilter} className="btn-subtle w-full">
          Clear Filter
        </button>
      </div>
    </section>
  );
};

export default FilterSection;
