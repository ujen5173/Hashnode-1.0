import React, { useState } from "react";
import {
  Add,
  Chain,
  Feed,
  Filter,
  Group,
  Pen,
  Twitter,
  Fire,
  Clock,
  Check,
} from "~/svgs";
import { tagArticles } from "~/utils/constants";
import ArticleCard from "./Cards/ArticleCard";
import type { FilterData } from "./MainBodyHeader";
import Select from "./Select";
import Tags from "./Tags";

const MainTagBody = () => {
  const [following, setFollowing] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterData>({
    status: false,
    data: {
      read_time: null,
      tags: [],
    },
  });

  const clearFilter = () => {
    setFilter({
      ...filter,
      data: {
        read_time: null,
        tags: [],
      },
    });
  };

  const applyFilter = () => {
    setFilter({
      ...filter,
      status: false,
    });
  };

  const followTag = (id: string) => {
    setFollowing((prev) => !prev);
  };

  return (
    <section className="container-main my-4 min-h-screen w-full">
      <header className="mb-4 flex flex-col items-center justify-center rounded-md border border-border-light bg-white px-6 py-11 dark:border-border dark:bg-primary">
        <h1 className="mb-2 text-3xl font-semibold text-gray-700 dark:text-text-secondary">
          Programming Blogs
        </h1>
        <p className="mb-8 text-xl text-gray-500 dark:text-text-primary">
          #programming-blogs
        </p>
        <div className="mb-8 flex flex-col items-center gap-4 md:flex-row">
          <button
            onClick={() => void followTag("asf54-6w8e4f6s-d4654sd6")}
            className="btn-outline flex w-full items-center justify-center gap-2 text-secondary md:w-max"
          >
            {following ? (
              <>
                <Check className="h-5 w-5 fill-secondary" />
                Following
              </>
            ) : (
              <>
                <Add className="h-5 w-5 fill-secondary" />
                Follow Tag
              </>
            )}
          </button>
          <button className="btn-filled flex w-full items-center gap-2 text-white md:w-max">
            <Pen className="h-5 w-5 fill-white" />
            Write An Article
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-4 text-gray-700 dark:text-text-secondary">
            <Group className="h-5 w-5 fill-gray-700 dark:fill-text-secondary" />
            <span>199k Followers</span>
          </div>
          <span className="text-gray-700 dark:text-text-secondary">·</span>
          <div className="flex items-center gap-4 text-gray-700 dark:text-text-secondary">
            <Feed className="h-5 w-5 fill-gray-700 dark:fill-text-secondary" />
            <span>1k Following</span>
          </div>
          <div className="flex items-center gap-4">
            <Twitter className="h-5 w-5 fill-gray-700 dark:fill-text-secondary" />
            <Chain className="h-5 w-5 fill-gray-700 dark:fill-text-secondary" />
          </div>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center rounded-md border border-border-light bg-white dark:border-border dark:bg-primary">
        <div className="flex w-full flex-col items-end justify-between gap-2  pt-2">
          <div className="flex w-full items-end justify-between border-b border-border-light px-2 dark:border-border">
            <div className="flex w-full items-center gap-2">
              <button aria-label="icon" role="button" className="btn-tab">
                <Fire className="h-4 w-4 fill-gray-700 dark:fill-text-primary" />
                <span className={`${""} text-sm font-semibold`}>Hot</span>
              </button>
              <button aria-label="icon" role="button" className="btn-tab">
                <Clock className="h-4 w-4 fill-none stroke-gray-700 dark:stroke-text-primary" />
                <span className={`${""} text-sm font-semibold`}>New</span>
              </button>
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
                    className={`h-4 w-4 ${
                      filter.data.read_time !== null ||
                      filter.data.tags.length > 0
                        ? "fill-secondary stroke-secondary"
                        : ""
                    } fill-gray-700 dark:fill-text-primary`}
                  />
                </button>
                <span
                  className={`${
                    filter.data.read_time !== null ||
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
            <section className="relative flex w-full flex-col justify-between gap-4 border-b border-border-light p-4 dark:border-border md:flex-row lg:flex-col xl:flex-row">
              <div className="flex w-full flex-col gap-4 sm:flex-row md:w-8/12 lg:w-full xl:w-8/12">
                <div className="w-full md:w-auto">
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
                <div className="w-full md:w-auto">
                  <label
                    className="mb-2 inline-block text-gray-700 dark:text-text-secondary"
                    htmlFor="read_time"
                  >
                    Tags
                  </label>
                  <Tags filter={filter} setFilter={setFilter} />
                </div>
              </div>
              <div className="mt-0 flex items-start gap-2 md:mt-8 lg:mt-0 xl:mt-8">
                <button onClick={applyFilter} className="btn-outline">
                  Apply
                </button>
                <button onClick={clearFilter} className="btn-subtle">
                  Clear Filter
                </button>
              </div>
            </section>
          )}
        </div>
        {tagArticles.map((article) => (
          <ArticleCard card={article} key={article.id} />
        ))}
      </main>
    </section>
  );
};

export default MainTagBody;
