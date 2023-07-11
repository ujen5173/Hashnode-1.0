import Link from "next/link";
import { type FC } from "react";
import { asideItems } from "~/utils/constants";

import { Discord, Instagram, Linkedin, Trending, Twitter } from "~/svgs";
import { api } from "~/utils/api";
import { type TrendingTagsTypes } from "~/utils/context";
import Navigation from "./Cards/Navigation";
import TrendingNavigation from "./Cards/TrendingNavigation";
import Divider from "./Divider";

const Aside = () => {
  const { data: tagsData, isLoading } = api.tags.getTredingTags.useQuery(
    {
      variant: "any",
      limit: 6,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="container-aside relative hidden min-h-screen py-4 lg:block">
      <aside className="sticky left-0 top-[5.5rem] h-fit w-full rounded-md border border-border-light bg-white py-2 dark:border-border dark:bg-primary">
        <Navigations />
        <Divider />
        <TrendingComponent
          trendingItems={{ data: tagsData, isLoading: isLoading }}
        />
        <SocialHandles />
        <div className="w-4/12 px-4">
          <Divider />
        </div>
        <div className="p-4">
          <span className="text-sm text-gray-700 dark:text-text-primary">
            @ {new Date().getFullYear()} Hashnode Clone
          </span>
        </div>
      </aside>
    </div>
  );
};

export default Aside;

const Navigations = () => {
  return (
    <div className="pb-3">
      {asideItems.map((item, index) => {
        return item.type !== "link" ? (
          <Navigation key={index} item={item} />
        ) : (
          <Link
            aria-label={`Go to ${item.name} Page`}
            href={item.href || ""}
            key={index}
          >
            <Navigation item={item} />
          </Link>
        );
      })}
    </div>
  );
};

const TrendingComponent: FC<{
  trendingItems: TrendingTagsTypes;
}> = ({ trendingItems }) => {
  return (
    <div className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="mb-2 text-sm font-semibold dark:text-text-primary ">
          Trending tags
        </h1>
        <span>
          <Trending className="h-4 w-4 fill-black dark:fill-text-primary" />
        </span>
      </div>

      {trendingItems.isLoading ? (
        <>
          <div className="my-2 h-6 w-full rounded-md bg-light-bg dark:bg-primary-light"></div>
          <div className="my-2 h-6 w-full rounded-md bg-light-bg dark:bg-primary-light"></div>
          <div className="my-2 h-6 w-full rounded-md bg-light-bg dark:bg-primary-light"></div>
        </>
      ) : trendingItems.data && trendingItems.data.length > 0 ? (
        trendingItems.data.map((item) => (
          <TrendingNavigation key={item.id} item={item} />
        ))
      ) : (
        <p className="text-sm text-gray-700 dark:text-text-primary">
          No trending tags
        </p>
      )}
    </div>
  );
};

const SocialHandles = () => {
  return (
    <div className="flex flex-wrap p-4">
      <a target="_blank" href="https://twitter.com">
        <button
          aria-label="social links"
          role="button"
          className="btn-social-icon flex h-10 w-10 items-center justify-center hover:bg-twitterColor"
        >
          <Twitter className="h-6 w-6 fill-gray-500 dark:fill-text-primary" />
        </button>
      </a>
      <a target="_blank" href="https://discord.com/app">
        <button
          aria-label="social links"
          role="button"
          className="btn-social-icon flex h-10 w-10 items-center justify-center hover:bg-discordColor"
        >
          <Discord className="h-6 w-6 fill-gray-500 dark:fill-text-primary" />
        </button>
      </a>
      <a target="_blank" href="https://linkedin.com">
        <button
          aria-label="social links"
          role="button"
          className="btn-social-icon flex h-10 w-10 items-center justify-center hover:bg-linkedinColor"
        >
          <Linkedin className="h-6 w-6 fill-gray-500 dark:fill-text-primary" />
        </button>
      </a>
      <a target="_blank" href="https://instagram.com">
        <button
          aria-label="social links"
          role="button"
          className="btn-social-icon flex h-10 w-10 items-center justify-center hover:bg-instaColor"
        >
          <Instagram className="h-6 w-6 fill-gray-500 dark:fill-text-primary" />
        </button>
      </a>
    </div>
  );
};
