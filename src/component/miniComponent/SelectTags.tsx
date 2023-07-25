import Image from "next/image";
import { useEffect, useRef, useState, type FC } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Hashtag } from "~/svgs";
import { api } from "~/utils/api";
import { TagLoading } from "../loading";
import { type ArticleData } from "../macroComponent/New/NewArticleBody";

interface Props {
  tags: string[];
  setData: React.Dispatch<React.SetStateAction<ArticleData>>;
  createTagState: boolean;
  setCreateTagState: React.Dispatch<React.SetStateAction<boolean>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SelectTags: FC<Props> = ({
  tags: t,
  setData,
  createTagState,
  setCreateTagState,
  query,
  setQuery,
}) => {
  const [tags, setTags] = useState<
    { id: string; name: string; logo: string | null }[]
  >([]);

  const [refetching, setRefetching] = useState(true);
  const [opened, setOpened] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);

  const { refetch } = api.tags.searchTags.useQuery(
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
  ): Promise<{ id: string; name: string; logo: string | null }[]> {
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

  useEffect(() => {
    // This will refetch the tags when the new tag model is closed to insure that the new tag is created
    if (!createTagState && query.length > 0) {
      void (async () => {
        const response = await search(query);
        const newData = response.filter((tag) => !t.includes(tag.name));
        setTags(newData);
      })();
    }
  }, [createTagState]);

  const debounced = useDebouncedCallback(async (value: string) => {
    const response = await search(value);
    const newData = response.filter((tag) => !t.includes(tag.name));
    setTags(newData);
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
          placeholder="Seperate tags with commas"
          id="tags"
          name="tags"
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
          ) : tags.length > 0 ? (
            tags.map((tag, index) => (
              <div
                className="flex w-full cursor-pointer items-center gap-2 border-b border-border-light px-2 py-2 text-lg text-gray-500 last:border-none dark:border-border dark:text-text-primary"
                onClick={() => {
                  setData((prev) => ({
                    ...prev,
                    tags: Array.from(new Set([...prev.tags, tag.name])),
                  }));
                  input.current?.focus();

                  setOpened(false);
                  setQuery("");
                }}
                key={index}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white dark:bg-primary-light">
                  {tag.logo ? (
                    <Image
                      src={tag.logo}
                      alt={tag.name}
                      width={70}
                      height={70}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-200 dark:bg-primary-light">
                      <Hashtag className="mx-auto my-3 h-6 w-6 fill-none stroke-gray-500" />
                    </div>
                  )}
                </div>

                <span>{tag.name}</span>
              </div>
            ))
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2">
              <p className="text-gray-500 dark:text-text-primary">
                No tags found
              </p>
              <button
                aria-label="Create New Tag"
                onClick={() => setCreateTagState(true)}
                className="btn-filled"
              >
                Create One
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectTags;
