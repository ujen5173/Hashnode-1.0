import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { Hashtag } from "~/svgs";
import { type Tag } from "~/utils/context";

interface Props {
  tag: Tag;
  type: "This week" | "Any" | "This month" | "This year";
}

const TagCard: FC<Props> = ({ tag, type }) => {
  return (
    <Link href={`/tag/${tag.slug}`}>
      <div
        title={`#${tag.name}`}
        className="flex gap-3 rounded-md border  border-border-light bg-light-bg p-2 dark:border-border dark:bg-primary-light"
      >
        {tag.logo ? (
          <Image
            src={tag.logo}
            alt={tag.name}
            width={70}
            height={70}
            className="h-12 w-12 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-200 dark:bg-primary">
            <Hashtag className="mx-auto my-3 h-6 w-6 fill-none stroke-gray-500" />
          </div>
        )}

        <div>
          <h1 className="max-height-one text-base font-medium text-gray-700 dark:text-text-secondary">
            {tag.name}
          </h1>

          <p className="text-sm font-normal text-gray-700 dark:text-text-primary">
            {tag.articlesCount} articles
            {type?.toLowerCase() === "any" ? "" : " " + type?.toLowerCase()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default TagCard;
