import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import { ArticleCard } from "~/component/card";
import { ArticleLoading } from "~/component/loading";

import { Clock, Filter, Flame } from "lucide-react";
import useFilter from "~/hooks/useFilter";
import type { DetailedTag } from "~/types";
import { api } from "~/utils/api";
import { TagPageHeader } from "../../header";
import FilterSection from "./FilterSection";

const MainTagBody: FC<{ tagDetails: DetailedTag }> = ({ tagDetails }) => {
  const tab = useRouter().query.tab as string | undefined;

  const { filter, setFilter } = useFilter();

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
  const { data: articlesData, isLoading } = api.posts.getArticlesUsingTag.useQuery(
    {
      name: tagDetails.name,
      type: (tab || "hot") as "hot" | "new",
      limit: 2,
      filter: {
        read_time: filter.data.read_time,
        tags: filter.data.tags,
      },
    },
    {
      enabled: filter.data.shouldApply,
      refetchOnWindowFocus: false,
    }
  );

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
  }, [tagDetails, user]);

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
        <div className="flex w-full flex-col items-end justify-between gap-2 pt-2">
          <div className="flex w-full items-end justify-between border-b border-border-light px-2 dark:border-border">
            <div className="flex w-full items-center gap-2">
              <Link href={`/tag/${tagDetails.slug}?tab=hot`}>
                <button
                  aria-label="icon"
                  role="button"
                  className={`${tab === undefined || tab === "hot"
                    ? "btn-tab-active"
                    : "btn-tab"
                    }`}
                >
                  <Flame
                    className={`h-4 w-4  ${tab === undefined || tab === "hot"
                      ? "fill-secondary"
                      : "stroke-gray-700 dark:stroke-text-secondary"
                      }`}
                  />
                  <span className={`text-sm font-semibold`}>Hot</span>
                </button>
              </Link>
              <Link href={`/tag/${tagDetails.slug}?tab=new`}>
                <button
                  aria-label="icon"
                  role="button"
                  className={`${tab === "new" ? "btn-tab-active" : "btn-tab"}`}
                >
                  <Clock
                    className={`h-4 w-4 fill-none ${tab === "new"
                      ? "stroke-secondary"
                      : "stroke-gray-700 dark:stroke-text-primary"
                      }`}
                  />
                  <span className={`text-sm font-semibold`}>New</span>
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
                      ? "fill-secondary stroke-secondary"
                      : ""
                      } stroke-gray-700 dark:stroke-text-secondary`}
                  />
                </button>
                <span
                  className={`${filter.data.read_time !== null ||
                    filter.data.tags.length > 0
                    ? "text-secondary"
                    : "text-gray-700 dark:text-text-primary"
                    }`}
                >
                  Filter
                </span>
              </div>
            </div>
          </div>

          {filter.status && (
            <FilterSection />
          )}
        </div>

        {isLoading ? (
          <div className="w-full">
            {Array(4)
              .fill("")
              .map((_, i) => {
                return (
                  <div
                    className="border-b border-border-light dark:border-border"
                    key={i}
                  >
                    <ArticleLoading />
                  </div>
                );
              })}
          </div>
        ) : (
          articlesData?.posts?.map((article) => (
            <div
              key={article.id}
              className="w-full border-b border-border-light last:border-0 dark:border-border"
            >
              <ArticleCard card={article} key={article.id} />
            </div>
          ))
        )}
        {
          isLoading && (
            <>
              <ArticleLoading />
              <ArticleLoading />
              <ArticleLoading />
              <ArticleLoading />
              <ArticleLoading />
              <ArticleLoading />
            </>
          )
        }
      </main>
    </section>
  );
};

export default MainTagBody;
