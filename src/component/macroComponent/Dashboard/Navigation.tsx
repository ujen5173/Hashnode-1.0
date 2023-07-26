import Link from "next/link";
import { type ParsedUrlQuery } from "querystring";
import { type FC } from "react";
import { dashboardNavigations } from "~/utils/constants";

const Navigation: FC<{
  paths: ParsedUrlQuery;
  userId: string | undefined;
}> = ({ paths, userId }) => {
  return (
    <div className="w-[18rem] overflow-hidden rounded-md border border-border-light bg-white dark:border-border dark:bg-primary">
      {dashboardNavigations.map((dashboard, index) => {
        const state = paths.dashboard
          ? paths.dashboard[0] === dashboard.name.toLowerCase()
            ? true
            : false
          : dashboard.name === "General"
          ? true
          : false;

        return (
          <div
            key={dashboard.id}
            // the className logic is just to add margings in divider navigations.
            // You can see the navigations is divided into 3 parts. so to add margin in between them, I have added this logic
            className={`
            ${
              index === 2 ||
              index === 5 ||
              index === 11 ||
              index === 13 ||
              index === 15
                ? "mb-2 border-b border-border-light dark:border-border"
                : ""
            }
            `}
          >
            <Link href={`/${userId as string}${dashboard.link}`}>
              <div
                className={`flex w-full cursor-pointer items-center gap-2 px-6 py-4  ${
                  index === 2 ||
                  index === 5 ||
                  index === 11 ||
                  index === 13 ||
                  index === 15
                    ? "mb-2"
                    : ""
                } ${
                  state
                    ? "bg-secondary"
                    : "hover:bg-gray-200 dark:hover:bg-primary-light"
                }`}
              >
                {dashboard.icon(state)}

                <span
                  className={`text-base font-semibold ${
                    state
                      ? "text-white"
                      : "text-gray-700 dark:text-text-secondary"
                  }`}
                >
                  {dashboard.name}
                </span>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Navigation;
