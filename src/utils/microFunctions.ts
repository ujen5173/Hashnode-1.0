export interface Activity {
  id: string;
  title: string;
  slug: string;
  activity_type: "ARTICLE" | "JOINED";
  createdAt: Date;
}

export function refactorActivityHelper(
  activity: Activity[]
): Map<string, Activity[]> {
  const res = new Map<string, Activity[]>();

  for (const value of activity) {
    const { createdAt } = value;
    const formatedDate = new Date(createdAt).toLocaleDateString("en-US", {
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
