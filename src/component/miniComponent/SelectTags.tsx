import { Hash } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type FC } from "react";
import slugify from "slugify";
import { useDebouncedCallback } from "use-debounce";
import { api } from "~/utils/api";
import { slugSetting } from "~/utils/constants";
import { TagLoading } from "../loading";
import { type ArticleData } from "../macroComponent/New/NewArticleBody";

interface Props {
  tags: string[];
  data: ArticleData;
  setData: (data: ArticleData) => void;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

interface Tag {
  name: string;
  logo: string | null;
  slug: string;
  articlesCount: number;
}

const SelectTags: FC<Props> = ({
  tags: t,
  data,
  setData,
  query,
  setQuery,
}) => {
  const [tags, setTags] = useState<Tag[]>([]);

  const [opened, setOpened] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { refetch, isFetching: fetchingTags } = api.tags.searchTags.useQuery(
    {
      query,
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      retry: 0
    }
  );

  useEffect(() => {
    setIsFetching(fetchingTags);
  }, [fetchingTags]);

  async function search(criteria: string): Promise<Tag[]> {
    let response;
    if (criteria.trim().length > 0) {
      response = await refetch();

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
    const newData = response.filter((tag) => !t.includes(tag.name));

    // add the tag user want if it doesn't exist
    if (value.trim().length > 0 && !newData.some((e) => e.name === value)) {
      newData.unshift({
        name: value,
        logo: null,
        slug: slugify(value, slugSetting),
        articlesCount: 0,
      });
    }

    setTags(newData);
  }, 200);

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
            setIsFetching(true);
            void debounced(e.target.value);
          }}
        />
      </form>

      {(opened || query !== "") && (
        <div
          ref={ref}
          className="scroll-area absolute left-0 top-full z-20 flex max-h-[250px] min-h-[250px] w-full flex-col items-center justify-start overflow-auto rounded-md border border-border-light bg-light-bg shadow-md dark:border-border dark:bg-primary"
        >
          {
            isFetching ? (
              <>
                <TagLoading />
                <TagLoading />
                <TagLoading />
                <TagLoading />
                <TagLoading />
              </>
            ) : tags.map((tag) => (
              <div
                className="flex w-full cursor-pointer items-center gap-2  border-b border-border-light px-4 py-2 text-lg text-gray-500 last:border-none hover:bg-light-bg dark:border-border dark:text-text-primary dark:hover:bg-primary-light"
                key={tag.slug}
                onClick={() => {
                  setData({
                    ...data,
                    tags: Array.from(new Set([...data.tags, tag.name])),
                  });
                  input.current?.focus();

                  setOpened(false);
                  setQuery("");
                }}
              >
                <div className="flex-1">
                  <p className="text-base text-gray-700 dark:text-text-secondary">
                    {tag.name}
                  </p>

                  <p className="mb-1 text-sm font-semibold text-gray-500 dark:text-text-primary">
                    #{tag.slug}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-text-primary">
                    {Intl.NumberFormat("en-US", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(tag.articlesCount)}
                    &nbsp;posts
                  </p>
                </div>

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
                      <Hash className="mx-auto my-3 h-6 w-6 fill-none stroke-gray-500" />
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SelectTags;
