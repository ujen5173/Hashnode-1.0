import Link from "next/link";
import React from "react";
import { asideItems, trendingItems } from "~/utils/constants";
import Trending from "./../svgs/Trending";
import Twitter from "./../svgs/Twitter";
import Discord from "./../svgs/Discord";
import Linkedin from "./../svgs/Linkedin";
import Instagram from "./../svgs/Instagram";
import Navigation from "./Cards/Navigation";
import TrendingNavigation from "./Cards/TrendingNavigation";
import Divider from "./Divider";

const Aside = () => {
  return (
    <div className="relative hidden min-h-screen flex-[1.30] py-4 lg:block">
      <aside className="sticky left-0 top-4 h-fit w-full rounded-md border border-border-light bg-white py-2 dark:border-border dark:bg-primary">
        <Navigations />
        <Divider />
        <TrendingComponent />
        <Divider />
        <SocialHandles />
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

const TrendingComponent = () => {
  return (
    <div className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-sm font-semibold dark:text-text-primary ">
          Trending tags
        </h1>
        <span>
          <Trending className="h-4 w-4 dark:text-text-primary" />
        </span>
      </div>
      {trendingItems.map((item, index) => (
        <TrendingNavigation key={index} item={item} />
      ))}
    </div>
  );
};

const SocialHandles = () => {
  return (
    <div className="flex flex-wrap gap-4 p-2">
      <button
        aria-label="social links"
        role="button"
        className="btn-icon flex h-10 w-10 items-center justify-center"
      >
        <Twitter className="h-6 w-6 fill-text-primary" />
      </button>
      <button
        aria-label="social links"
        role="button"
        className="btn-icon flex h-10 w-10 items-center justify-center"
      >
        <Discord className="h-6 w-6 fill-text-primary" />
      </button>
      <button
        aria-label="social links"
        role="button"
        className="btn-icon flex h-10 w-10 items-center justify-center"
      >
        <Linkedin className="h-6 w-6 fill-text-primary" />
      </button>
      <button
        aria-label="social links"
        role="button"
        className="btn-icon flex h-10 w-10 items-center justify-center"
      >
        <Instagram className="h-6 w-6 fill-text-primary" />
      </button>
    </div>
  );
};
