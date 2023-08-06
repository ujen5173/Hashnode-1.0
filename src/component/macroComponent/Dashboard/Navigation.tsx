import { useClickOutside } from "@mantine/hooks";
import Link from "next/link";
import { type ParsedUrlQuery } from "querystring";
import { useState, type FC } from "react";
import { Hamburger } from "~/svgs";
import { dashboardNavigations } from "~/utils/constants";

const Navigation: FC<{
  paths: ParsedUrlQuery;
  userId: string | undefined;
}> = ({ paths, userId }) => {
  const [opened, setOpened] = useState(false);
  const [control, setControl] = useState<HTMLDivElement | null>(null);
  const [dropdown, setDropdown] = useState<HTMLDivElement | null>(null);

  useClickOutside<HTMLDivElement>(() => setOpened(false), null, [
    control,
    dropdown,
  ]);

  return (
    <div className="w-full select-none md:w-[18rem]">
      <div
        onClick={() => setOpened((prev) => !prev)}
        ref={setControl}
        className="flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md border border-border-light bg-white px-4 py-2 dark:border-border dark:bg-primary md:hidden"
      >
        <Hamburger className="h-4 w-4 fill-gray-700 dark:fill-text-primary" />
        <span className="text-gray-700 dark:text-text-primary font-medium">Dashboard Menu</span>
      </div>

      {opened && (
        <div
          className="mt-2 overflow-hidden rounded-md border border-border-light bg-white dark:border-border dark:bg-primary"
          ref={setDropdown}
        >
          <NavigationList userId={userId} paths={paths} />
        </div>
      )}

      <div className="hidden overflow-hidden rounded-md border border-border-light bg-white dark:border-border dark:bg-primary md:block">
        <NavigationList userId={userId} paths={paths} />
      </div>
    </div>
  );
};

export default Navigation;

const NavigationList: FC<{
  paths: ParsedUrlQuery;
  userId: string | undefined;
}> = ({ paths, userId }) => {
  return (
    <>
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
            className={`${index === 2 ||
              index === 5 ||
              index === 11 ||
              index === 13 ||
              index === 15
              ? "mb-2 border-b border-border-light dark:border-border"
              : ""
              }`}
          >
            <Link href={`/${userId as string}${dashboard.link}`}>
              <div
                className={`flex w-full cursor-pointer items-center gap-2 px-4 py-3 md:px-6 md:py-4 ${index === 2 ||
                  index === 5 ||
                  index === 11 ||
                  index === 13 ||
                  index === 15
                  ? "mb-2"
                  : ""
                  } ${state
                    ? "bg-secondary"
                    : "hover:bg-gray-200 dark:hover:bg-primary-light"
                  }`}
              >
                {dashboard.icon(state)}

                <span
                  className={`text-sm font-medium md:text-base md:font-semibold ${state
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
    </>
  );
};
