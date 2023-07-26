import Link from "next/link";
import { useRouter } from "next/router";
import { type FC } from "react";
import { v4 as uuid } from "uuid";
import { LogonoText, Pen } from "~/svgs";
import { type Activity } from "~/utils/microFunctions";

interface Props {
  index: number;
  item: Activity;
  activityLength: number;
}

const ActivityCard: FC<Props> = ({ index, item, activityLength }) => {
  const user = useRouter().query.username as string;

  return (
    <div
      key={uuid()}
      className={`${
        index === activityLength - 1 ? "" : "border-b"
      } w-full border-border-light py-2 dark:border-border`}
    >
      <div className="mb-2 flex items-center gap-2 last:mb-0">
        {item.activity_type === "JOINED" ? (
          <LogonoText className="h-4 w-4 fill-secondary" />
        ) : (
          <Pen className="h-4 w-4 fill-none stroke-gray-700 dark:stroke-text-secondary" />
        )}
        <span className="text-gray-700 dark:text-text-secondary">
          {item.activity_type === "JOINED"
            ? "Joined Hashnode"
            : "Wrote an article"}
        </span>
      </div>

      {item.activity_type !== "JOINED" && (
        <Link href={`/u/${user}/${item.slug}`} className="mb-2">
          <div>
            <span className="text-lg font-semibold text-gray-700 hover:text-gray-500 dark:text-text-secondary dark:hover:text-text-primary">
              {item.title}
            </span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default ActivityCard;
