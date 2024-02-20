import { TRPCClientError } from "@trpc/client";
import { Filter, Flame } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useEffect, useMemo, useRef, useState, type FC } from "react";
import { toast } from "react-toastify";
import { ManageData } from "~/component";
import { ArticleLoading } from "~/component/loading";
import useOnScreen from "~/hooks/useOnScreen";
import type { ArticleCard, DetailedTag } from "~/types";
import { api } from "~/utils/api";
import { C } from "~/utils/context";
import { TagPageHeader } from "../../header";
import FilterSection from "./FilterSection";

const MainTagBody: FC<{ tagDetails: DetailedTag }> = ({ tagDetails }) => {
  const { filter, setFilter } = useContext(C)!;

  const [following, setFollowing] = useState<{
    status: boolean;
    followersCount: string;
    updated: boolean,
  }>({
    status: false,
    followersCount: "0",
    updated: false,
  });

  const { mutate: followToggle } = api.tags.followTag.useMutation();
  const { data: user } = useSession();
  const { data: articlesData, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = api.posts.getArticlesUsingTag.useInfiniteQuery(
    {
      name: tagDetails.name,
      limit: 4,
      filter: {
        read_time: filter.data.read_time,
        tags: filter.data.tags,
      },
    },
    {
      enabled: !!filter.data.shouldApply,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      retry: 0,
    }
  );

  const articles = useMemo(() => articlesData?.pages.flatMap((page) => page.posts), [articlesData])

  const bottomRef = useRef<HTMLDivElement>(null);

  const reachedBottom = useOnScreen(bottomRef);

  useEffect(() => {
    if (reachedBottom && hasNextPage) {
      void fetchNextPage();
    }
  }, [reachedBottom]);


  useEffect(() => {
    if (tagDetails && user && following.updated === false) {
      if (tagDetails.isFollowing) {
        setFollowing(prev => ({
          status: true,
          followersCount: JSON.stringify(tagDetails.followersCount),
          updated: prev.updated,
        }));
      } else {
        setFollowing(prev => ({
          status: false,
          followersCount: JSON.stringify(tagDetails.followersCount),
          updated: prev.updated,
        }));
      }
    }
  }, [tagDetails, following.updated, user]);

  const followTag = (name: string): void => {
    try {
      if (!user) {
        toast.error("You need to be logged in to follow tags");
        return;
      }
      setFollowing({
        status: !following.status,
        followersCount: following.status
          ? JSON.stringify(parseInt(following.followersCount) - 1)
          : JSON.stringify(parseInt(following.followersCount) + 1),
        updated: true
      });
      followToggle({
        name: name,
      });
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      }
    }
  };

  return (
    <section className="container-main my-4 min-h-[100dvh] w-full">
      <TagPageHeader
        tagDetails={tagDetails}
        following={following}
        followTag={followTag}
      />

      <main className="flex flex-col items-center justify-center overflow-hidden rounded-md border border-border-light bg-white dark:border-border dark:bg-primary">
        <header className="w-full overflow-auto border-b border-border-light pt-2 dark:border-border">
          <div className="flex w-full items-end justify-between gap-16 px-2">
            <div className="flex items-center gap-2">
              <Link href={`/tag/${tagDetails.slug}?tab=hot`}>
                <button
                  aria-label="icon"
                  role="button"
                  className={`btn-tab-active`}
                >
                  <Flame
                    className={`h-4 w-4 fill-secondary`}
                  />
                  <span className={`text-sm font-semibold`}>Hot</span>
                </button>
              </Link>
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
                    className={`h-4 w-4 ${filter.data.read_time !== null ||
                      filter.data.tags.length > 0
                      ? "fill-none stroke-secondary"
                      : "stroke-gray-700 dark:stroke-text-secondary"
                      }`}
                  />
                </button>

                <span
                  className={`${filter.data.read_time !== null || filter.data.tags.length > 0
                    ? "text-secondary"
                    : "text-gray-700 dark:text-text-secondary"
                    }`}
                >
                  Filter
                </span>
              </div>
            </div>
          </div>
        </header>

        {filter.status && (
          <FilterSection />
        )}

        {
          <ManageData
            loading={<ArticleLoading />}
            type="ARTICLE"
            articleData={{
              isLoading: isLoading,
              data: articles as ArticleCard[] | undefined
            }}
          />
        }
        {
          isFetchingNextPage && (
            <>
              <ArticleLoading />
              <ArticleLoading />
              <ArticleLoading />
              <ArticleLoading />
            </>
          )
        }
        <div ref={bottomRef} />
      </main>
    </section>
  );
};

export default MainTagBody;
