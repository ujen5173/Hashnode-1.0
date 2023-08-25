import Link from "next/link";
import { type FC } from "react";
import { Trending } from "~/svgs";
import { api } from "~/utils/api";
import { asideItems, HashnodeSocials } from "~/utils/constants";
import { type TrendingTagsTypes } from "~/utils/context";
import { TrendingNavigation } from "../card";
import { TrendingTextLoading } from "../loading";
import { Divider } from "../miniComponent";
import AsideNavigation from "./AsideNavigation";

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
    <div className="container-aside relative hidden min-h-[100dvh] py-4 lg:block">
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
    <div className="pb-2">
      {asideItems.map((item, index) => {
        return item.type !== "link" ? (
          <AsideNavigation key={index} item={item} />
        ) : (
          <Link
            aria-label={`Go to ${item.name} Page`}
            href={item.href}
            key={index}
          >
            <AsideNavigation item={item} />
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
    <div className="px-4 py-3">
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
          <TrendingTextLoading />
          <TrendingTextLoading />
          <TrendingTextLoading />
          <TrendingTextLoading />
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
    <ul className="flex flex-wrap gap-2 px-4 pb-4">
      {HashnodeSocials.map((item, index) => (
        <li key={index}>
          <a
            target="_blank"
            aria-label={`Follow us on ${item.name}`}
            title={`Follow us on ${item.name}`}
            className={`btn-social-icon flex h-8 w-8 transition-colors items-center justify-center ${item.name === "Twitter"
              ? "hover:bg-[#1da1f2]"
              : item.name === "Discord"
                ? "hover:bg-[#7289da]"
                : item.name === "Github"
                  ? "hover:bg-[#2c3646]"
                  : item.name === "Hashnode"
                    ? "hover:bg-[#2c3646]"
                    : ""
              }`}
            href={`${item.link}`}
          >
            {item.icon}
          </a>
        </li>
      ))}
    </ul>
  );
};
