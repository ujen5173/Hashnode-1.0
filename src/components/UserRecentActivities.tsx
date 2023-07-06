import { useRouter } from "next/router";
import { api } from "~/utils/api";
import ActivityCard from "./Cards/ActivityCard";

const UserRecentActivities = () => {
  const username = useRouter().query.username as string;
  const { data: refactoredActivity } = api.posts.getRecentActivity.useQuery(
    {
      username,
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!username,
    }
  );

  return (
    <div className="my-6 w-full rounded-md border border-border-light px-6 py-3 dark:border-border md:px-12 md:py-6">
      <header className="mb-0 w-full py-3 lg:mb-3">
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-text-secondary">
          Recent Activity
        </h1>
      </header>

      <section>
        {refactoredActivity?.map((activity, index) => (
          <div
            className="my-3 flex w-full flex-col gap-0 lg:my-0 lg:flex-row lg:gap-2 lg:gap-6"
            key={index}
          >
            <div className="py-0 md:py-2">
              <p className="text-center text-sm font-medium text-gray-700 dark:text-text-secondary">
                {activity[0]}
              </p>
            </div>

            <div className="flex w-full gap-2">
              <div className="activity_date">
                {activity[1][0]?.activity_type !== "JOINED" && (
                  <div className="activity_date_dots hidden sm:block"></div>
                )}
              </div>
              <div className="flex-1 px-4 lg:px-0 lg:px-6">
                {activity[1].map((item, i) => {
                  return (
                    <ActivityCard
                      index={index}
                      i={i}
                      item={item}
                      key={i}
                      subActivityLength={activity[1].length}
                      activityLength={refactoredActivity.length}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default UserRecentActivities;
