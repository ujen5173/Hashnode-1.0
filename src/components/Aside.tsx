import Link from "next/link";
import React from "react";
import { asideItems, trendingItems } from "~/utils/constants";

import Navigation from "./Cards/Navigation";
import TrendingNavigation from "./Cards/TrendingNavigation";
import Divider from "./Divider";
import { Trending, Twitter, Discord, Linkedin, Instagram } from "~/svgs";

const Aside = () => {
  return (
    <div className="container-aside relative hidden min-h-screen py-4 lg:block">
      <aside className="sticky left-0 top-4 h-fit w-full rounded-md border border-border-light bg-white py-2 dark:border-border dark:bg-primary">
        <Navigations />
        <Divider />
        <TrendingComponent />
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

const TrendingComponent = () => {
  return (
    <div className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-sm font-semibold dark:text-text-primary ">
          Trending tags
        </h1>
        <span>
          <Trending className="h-4 w-4 fill-black dark:fill-text-primary" />
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
    <div className="flex flex-wrap p-4">
      <a href="https://twitter.com">
        <button
          aria-label="social links"
          role="button"
          className="btn-social-icon flex h-10 w-10 items-center justify-center hover:bg-twitterColor"
        >
          <Twitter className="h-6 w-6 fill-text-primary" />
        </button>
      </a>
      <a href="https://discord.com/app">
        <button
          aria-label="social links"
          role="button"
          className="btn-social-icon flex h-10 w-10 items-center justify-center hover:bg-discordColor"
        >
          <Discord className="h-6 w-6 fill-text-primary" />
        </button>
      </a>
      <a href="https://linkedin.com">
        <button
          aria-label="social links"
          role="button"
          className="btn-social-icon flex h-10 w-10 items-center justify-center hover:bg-linkedinColor"
        >
          <Linkedin className="h-6 w-6 fill-text-primary" />
        </button>
      </a>
      <a href="https://instagram.com">
        <button
          aria-label="social links"
          role="button"
          className="btn-social-icon flex h-10 w-10 items-center justify-center hover:bg-instaColor"
        >
          <Instagram className="h-6 w-6 fill-text-primary" />
        </button>
      </a>
    </div>
  );
};
