import React, { useEffect } from "react";
import { recentActivity } from "~/utils/constants";
import { refactorActivityHelper } from "~/utils/microFunctions";
import ActivityCard from "./Cards/ActivityCard";

export interface Activity {
  date: string;
  activity_type: string;
  activity_content: string | null;
}

const UserRecentActivities = () => {
  const [refactoredActivity, setRefactoredActivity] = React.useState<
    Array<[string, Activity[]]>
  >([]);

  function refactorActivity(activity: Activity[]): void {
    const res = refactorActivityHelper(activity);
    setRefactoredActivity(Array.from(res));
  }

  useEffect(() => {
    refactorActivity(recentActivity);
  }, []);

  return (
    <div className="my-6 w-full rounded-md border border-border-light px-6 py-3 dark:border-border md:px-12 md:py-6">
      <header className="mb-0 w-full py-3 lg:mb-6">
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-text-secondary">
          Recent Activity
        </h1>
      </header>
      <section>
        {refactoredActivity.map((activity, index) => (
          <div
            className="my-8 flex w-full flex-col gap-2 lg:my-0 lg:flex-row lg:gap-6"
            key={index}
          >
            <div className="activity_date">
              <span className="text-center text-sm text-gray-700 dark:text-text-secondary">
                {activity[0]}
              </span>
              {activity[1][0]?.activity_type !== "Joined Hashnode" && (
                <div className="lg:activity_date_dots hidden"></div>
              )}
            </div>
            <div className="flex-1">
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
        ))}
      </section>
    </div>
  );
};

export default UserRecentActivities;
