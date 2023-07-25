import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import { ActivityCard } from "~/component/card";
import { api } from "~/utils/api";

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
          <div className="flex w-full gap-2 lg:gap-6" key={index}>
            <div className="activity_date">
              <span className="text-center text-sm font-medium text-gray-700 dark:text-text-secondary">
                {activity[0]}
              </span>
              {activity[1][0]?.activity_type !== "JOINED" && (
                <div className="activity_date_dots"></div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-center">
              {activity[1].map((item) => {
                return (
                  <ActivityCard
                    index={index}
                    item={item}
                    key={uuid()}
                    activityLength={refactoredActivity.length}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default UserRecentActivities;
