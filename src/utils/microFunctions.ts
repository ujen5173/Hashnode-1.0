import type { Activity } from "~/components/UserRecentActivities";

export function refactorActivityHelper(
  activity: Activity[]
): Map<string, Activity[]> {
  const res = new Map<string, Activity[]>();

  for (const value of activity) {
    const { date } = value;
    const formatedDate = new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const activities = res.get(formatedDate) || [];
    activities.push(value);
    res.set(formatedDate, activities);
  }

  return res;
}
