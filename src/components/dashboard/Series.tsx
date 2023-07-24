import Image from "next/image";
import Link from "next/link";
import { useContext, type FC } from "react";
import { Redirect } from "~/svgs";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";

const Series = () => {
  const { user } = useContext(C) as ContextValue;

  const { data } = api.series.getSeriesOfAuthor.useQuery(
    {
      username: user?.user.username as string,
    },
    {
      enabled: !!user?.user,
    }
  );

  console.log({ data });

  return (
    <section className="relative w-full p-8">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-4xl font-semibold text-gray-700 dark:text-text-secondary">
          Series
        </h1>
        <Link href={`/${user?.user.id as string}/dashboard/series/create`}>
          <button className="btn-outline">
            <span className="text-secondary">Create new Series</span>
          </button>
        </Link>
      </header>

      <main>
        {data && data.length > 0 ? (
          <div className="">
            {data.map((item) => (
              <SeriesCard item={item} key={item.id} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <Image
              src="/NoDataUploaded.png"
              alt="Empty"
              width={1230}
              height={800}
              className="mx-auto w-64 object-cover"
            />
            <h1 className="text-2xl font-semibold text-gray-700 dark:text-text-secondary">
              You haven&apos;t created a series yet.
            </h1>
          </div>
        )}
      </main>
    </section>
  );
};
export default Series;

const SeriesCard: FC<{
  item: {
    id: string;
    title: string;
  };
}> = ({ item }) => {
  return (
    <div
      key={item.id}
      className="flex items-center justify-between border-b border-border-light py-4 dark:border-border"
    >
      <h1 className="text-xl font-bold text-gray-700 dark:text-text-secondary">
        {item.title}
      </h1>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 rounded-md px-3 py-1 hover:bg-gray-200 dark:hover:bg-primary-light">
          <Redirect className="h-4 w-4 fill-gray-500 dark:fill-text-primary" />
          <span className="font-medium text-gray-500 dark:text-text-primary">
            View Series
          </span>
        </button>
        <button className="rounded-md px-3 py-1 hover:bg-gray-200 dark:hover:bg-primary-light">
          <span className="font-medium text-gray-500 dark:text-text-primary">
            Edit Series
          </span>
        </button>
        <button className="rounded-md px-3 py-1 font-medium text-gray-500 hover:bg-gray-200 hover:text-[#dc2626!important] dark:text-text-primary dark:hover:bg-primary-light">
          Delete
        </button>
      </div>
    </div>
  );
};
