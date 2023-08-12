// TODO: REMOVE SERIES POPUP WHEN CLICKED OUTSIDE. THIS ISSUE IS ALSO IN TAGS SECTION.

import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useRef, useState, type FC } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Series } from "~/svgs";
import { api } from "~/utils/api";
import { TagLoading } from "../loading";
import { type ArticleData } from "../macroComponent/New/NewArticleBody";

const SelectSeries: FC<{
  series: string | null;
  setData: React.Dispatch<React.SetStateAction<ArticleData>>;
}> = ({ series: ser, setData }) => {
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState<
    {
      id: string;
      title: string;
    }[]
  >([]);

  const [refetching, setRefetching] = useState(true);
  const [opened, setOpened] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const { data: user } = useSession();

  const { refetch } = api.series.searchSeries.useQuery(
    {
      query,
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  async function search(
    criteria: string
  ): Promise<{ id: string; title: string }[]> {
    let response;
    if (criteria.trim().length > 0) {
      setRefetching(true);
      response = await refetch();
      setRefetching(false);
      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    }

    return [];
  }

  const debounced = useDebouncedCallback(async (value: string) => {
    const response = await search(value);
    const newData = response.filter(
      (s) => s.title.toLowerCase() !== ser?.toLowerCase()
    );

    setSeries(newData);
  }, 500);

  return (
    <div className="relative">
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          autoComplete="off"
          autoCorrect="off"
          type="text"
          className="input-secondary"
          ref={input}
          placeholder="Series"
          id="series"
          name="series"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            void debounced(e.target.value);
            setRefetching(true);
          }}
        />
      </form>

      {(opened || query !== "") && (
        <div
          ref={ref}
          className="scroll-area absolute left-0 top-full z-20 flex max-h-[250px] min-h-[250px] w-full flex-col items-center justify-start overflow-auto rounded-md border border-border-light bg-light-bg shadow-md dark:border-border dark:bg-primary"
        >
          {refetching ? (
            <>
              <TagLoading variant="non-rounded" />
              <TagLoading variant="non-rounded" />
              <TagLoading variant="non-rounded" />
              <TagLoading variant="non-rounded" />
            </>
          ) : series.length > 0 ? (
            series.map((s, index) => (
              <div
                className="flex w-full cursor-pointer items-center gap-2  border-b border-border-light px-4 py-2 text-lg text-gray-500 last:border-none hover:bg-light-bg dark:border-border dark:text-text-primary dark:hover:bg-primary-light"
                onClick={() => {
                  setData((prev) => ({
                    ...prev,
                    series: s.title,
                  }));
                  input.current?.focus();

                  setOpened(false);
                  setQuery("");
                  setData((prev) => ({
                    ...prev,
                    series: s.title,
                  }));
                }}
                key={index}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-200 dark:bg-primary-light">
                  <Series className="mx-auto my-3 h-6 w-6 fill-secondary" />
                </div>

                <span>{s.title}</span>
              </div>
            ))
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2">
              <p className="text-gray-500 dark:text-text-primary">
                No series found
              </p>

              <Link
                href={`/${user?.user.id as string}/dashboard/series/create`}
              >
                <button aria-label="Create New Tag" className="btn-filled">
                  Create One
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectSeries;
