import { Tooltip } from "@mantine/core";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { type FC } from "react";
import { FilterTimeOption } from "~/hooks/useFilter";
import { api } from "~/utils/api";
import { asideItems, HashnodeSocials } from "~/utils/constants";
import { type TrendingTagsTypes } from "~/utils/context";
import Divider from "../Divider";
import TrendingTextLoading from "../loading/TrendingText";

const LeftAside = () => {
  const { data: tagsData, isLoading } = api.tags.getTrendingTags.useQuery(
    {
      variant: FilterTimeOption.any,
      limit: 6,
    },
    {
      refetchOnWindowFocus: false,
      retry: 0,
    },
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

export default LeftAside;

const Navigations = () => {
  return (
    <div className="pb-2">
      {asideItems.map((item) => (
        <Tooltip key={item.name} label={item.name} position="right" withArrow>
          <Link aria-label={item.name} href={item.href}>
            <div className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 focus:bg-red dark:bg-primary dark:hover:bg-primary-light">
              <div className="flex items-center justify-center">
                {item.icon}
              </div>
              <div className="font-semibold text-gray-700 dark:text-text-secondary">
                {item.name}
              </div>
            </div>
          </Link>
        </Tooltip>
      ))}
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
          <TrendingUp className="h-4 w-4 stroke-black dark:stroke-text-primary" />
        </span>
      </div>

      {trendingItems.isLoading ? (
        Array(4)
          .fill("")
          .map((_, i) => <TrendingTextLoading key={i} />)
      ) : trendingItems.data && trendingItems.data.length > 0 ? (
        trendingItems.data.map((item) => (
          <Link
            key={item.id}
            aria-label={`${item.name} ${item.articlesCount}`}
            href={`/tag/${item.slug}`}
            title={item.name}
          >
            <div className="flex cursor-pointer select-none items-center justify-between rounded-md p-1 text-sm hover:bg-gray-100 dark:bg-primary dark:hover:bg-primary-light">
              <span className="text-limit-horizontal text-sm font-medium text-gray-500 dark:text-text-secondary">
                {item.name}
              </span>

              <div className="rounded-full border bg-light-bg px-2 py-[3px] text-xs font-bold text-gray-500 dark:border-border dark:bg-primary-light dark:text-text-secondary">
                {item.articlesCount}+
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="flex h-24 items-center justify-center">
          <p className="text-sm text-gray-700 dark:text-text-primary">
            No trending tags
          </p>
        </div>
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
            className={`btn-social-icon flex h-8 w-8 items-center justify-center transition-colors ${
              item.name === "Twitter"
                ? "hover:bg-[#1da1f2]"
                : item.name === "Discord"
                  ? "hover:bg-[#7289da]"
                  : item.name === "Github"
                    ? "github hover:bg-[#2c3646]"
                    : item.name === "Hashnode"
                      ? "hover:bg-secondary"
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
