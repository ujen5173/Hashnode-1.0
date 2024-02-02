import { Clock, Filter, Users, Wand2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, type FC } from "react";
import { C } from "~/utils/context";
import { FilterSection } from "../macroComponent/Tag";

const MainBodyHeader: FC = () => {
  const { tab } = useRouter().query;
  const { data: user } = useSession();
  const { filter, setFilter } = useContext(C)!;

  return (
    <>
      <header className="w-full overflow-auto border-b border-border-light pt-2 dark:border-border">
        <div className="flex w-full items-end justify-between gap-16 px-2">
          <div className="flex items-center gap-2">
            <Link href="/?tab=personalized">
              <button
                aria-label="Personalized"
                role="button"
                className={`${tab === undefined || tab === "personalized"
                  ? "btn-tab-active"
                  : "btn-tab"
                  }`}
              >
                <Wand2
                  className={`h-4 w-4  ${tab === undefined || tab === "personalized"
                    ? "fill-secondary"
                    : "stroke-gray-700 dark:stroke-text-secondary"
                    }`}
                />

                <span className="text-sm font-semibold">Personalized</span>
              </button>
            </Link>

            {user?.user && (
              <Link href="/?tab=following">
                <button
                  aria-label="Following"
                  role="button"
                  className={`${tab === "following" ? "btn-tab-active" : "btn-tab"
                    }`}
                >
                  <Users
                    className={`h-4 w-4 fill-none ${tab === "following"
                      ? "stroke-secondary"
                      : "stroke-gray-700 dark:stroke-text-secondary"
                      }`}
                  />

                  <span className="text-sm font-semibold">Following</span>
                </button>
              </Link>
            )}

            <Link href="/?tab=latest">
              <button
                aria-label="Latest"
                role="button"
                className={`${tab === "latest" ? "btn-tab-active" : "btn-tab"}`}
              >
                <Clock
                  className={`h-4 w-4 fill-none ${tab === "latest"
                    ? "stroke-secondary"
                    : "stroke-gray-700 dark:stroke-text-secondary"
                    }`}
                />

                <span className="text-sm font-semibold">Latest</span>
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
                aria-label="Filter"
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
    </>
  );
};

export default MainBodyHeader;
