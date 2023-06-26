import Link from "next/link";
import { useRouter } from "next/router";
import { LogonoText, Pen } from "~/svgs";
import { type Activity } from "~/utils/microFunctions";

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
  const user = useRouter().query.username as string;

  return (
    <div
      key={i}
      className={`${
        index === 0 && i === 0
          ? "border-b-1"
          : index === activityLength - 1 && i === subActivityLength - 1
          ? "border-t"
          : "border-y"
      }  w-full border-border-light py-3 dark:border-border`}
    >
      <div className="mb-2 flex items-center gap-2 last:mb-0">
        {item.activity_type === "JOINED" ? (
          <LogonoText className="h-4 w-4 fill-gray-700 dark:fill-text-secondary" />
        ) : (
          <Pen className="h-4 w-4 fill-gray-700 dark:fill-text-secondary" />
        )}
        <span className="text-gray-700 dark:text-text-secondary">
          {item.activity_type === "JOINED"
            ? "Joined Hashnode"
            : "Wrote an article"}
        </span>
      </div>

      {item.activity_type !== "JOINED" && (
        <Link
          href={`/u/@${user?.slice(1, user.length)}/${item.slug}`}
          className="mb-2"
          key={i}
        >
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
