import Link from "next/link";
import React from "react";
import LogonoText from "~/svgs/LogonoText";
import Pen from "~/svgs/Pen";
import type { Activity } from "../UserRecentActivities";

const ActivityCard = ({
  index,
  i,
  item,
  activityLength,
  subActivityLength,
}: {
  index: number;
  i: number;
  item: Activity;
  activityLength: number;
  subActivityLength: number;
}) => {
  return (
    <div
      key={i}
      className={`${
        index === 0 && i === 0
          ? "border-b"
          : index === activityLength - 1 && i === subActivityLength - 1
          ? "border-t"
          : "border-y"
      }  w-full border-border-light py-3 dark:border-border`}
    >
      <div className="mb-2 flex items-center gap-2">
        {item.activity_type === "Joined Hashnode" ? (
          <LogonoText className="h-4 w-4 fill-gray-700 dark:fill-text-secondary" />
        ) : (
          <Pen className="h-4 w-4 fill-gray-700 dark:fill-text-secondary" />
        )}
        <span className="text-gray-700 dark:text-text-secondary">
          {item.activity_type}
        </span>
      </div>
      
      {item.activity_content && (
        <Link href={item.slug} className="mb-2" key={i}>
          <div>
            <span className="text-lg font-semibold text-gray-700 hover:text-gray-500 dark:text-text-secondary dark:hover:text-text-primary">
              {item.activity_content}
            </span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default ActivityCard;
