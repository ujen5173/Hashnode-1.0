import { useState } from "react";
import type { FilterData } from "~/types";

export const DEFAULT_FILTER_DATA = {
  status: false,
  data: {
    read_time: null,
    tags: [],
    shouldApply: true,
  },
};

export const READ_TIME_OPTIONS = [
  { label: "Under 5 min", value: "UNDER_5" },
  { label: "5 min", value: "5" },
  { label: "Over 5 min", value: "OVER_5" },
];

export const READ_TIME_DEFAULT_TEXTS = {
  UNDER_5: "Under 5 min",
  "5": "5 min",
  OVER_5: "Over 5 min",
};

export const FILTER_TIME_OPTIONS = {
  any: "ANY",
  week: "WEEK",
  month: "MONTH",
  year: "YEAR",
};

export const FILTER_TIME_OPTIONS_LABEL = {
  any: "Any",
  week: "This week",
  month: "This month",
  year: "This year",
};

export enum FilterTimeOption {
  any = "ANY",
  week = "WEEK",
  month = "MONTH",
  year = "YEAR",
}

const useFilter = () => {
  const [filter, setFilter] = useState<FilterData>(DEFAULT_FILTER_DATA);
  const [timeFilter, setTimeFilter] = useState<FilterTimeOption>(
    FilterTimeOption.any
  );

  const filterActions = {
    applyFilter: () => {
      setFilter((prev) => ({
        status: false,
        data: {
          ...prev.data,
          shouldApply: true,
        },
      }));
    },
    clearFilter: () => {
      setFilter(DEFAULT_FILTER_DATA);
    },
  };

  return {
    filter,
    setFilter,
    filterActions,
    timeFilter,
    setTimeFilter,
  };
};

export default useFilter;