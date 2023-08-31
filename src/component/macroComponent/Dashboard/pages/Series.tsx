import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { toast } from "react-toastify";
import { Redirect } from "~/svgs";
import { api } from "~/utils/api";

const Series = () => {
  const { data: user } = useSession();

  const { data, isLoading } = api.series.getSeriesOfAuthor.useQuery(
    {
      username: user?.user.username as string,
    },
    {
      enabled: !!user?.user,
    }
  );

  const { mutateAsync } = api.series.deleteSeries.useMutation();

  const deleteSeries = async (id: string) => {
    const con = confirm("Are you sure you want to delete this series?");
    if (!con) return;
    const res = await mutateAsync({
      id,
    });

    if (res) {
      toast.success("Series deleted successfully");
    } else {
      toast.error("Something went wrong");
    }
  };


  return (
    <section className="relative w-full">
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
        {isLoading ? (
          <>
            <SeriesLoading />
            <SeriesLoading />
            <SeriesLoading />
            <SeriesLoading />
          </>
        ) : data && data.length > 0 ? (
          <div className="">
            {data.map((item) => (
              <SeriesCard author={user?.user.handle?.handle as string} item={item} key={item.id} deleteSeries={deleteSeries} />
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
    slug: string;
  };
  author: string;
  deleteSeries: (id: string) => Promise<void>;
}> = ({ item, author, deleteSeries }) => {
  return (
    <div
      key={item.id}
      className="flex items-center justify-between border-b border-border-light py-4 dark:border-border"
    >
      <div className="flex-1">
        <h1 className="text-xl font-bold text-gray-700 dark:text-text-secondary">
          {item.title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Link href={`/dev/@${author}/series/${item.slug}`} className="inline-flex items-center gap-2 rounded-md px-3 py-1 hover:bg-gray-200 dark:hover:bg-primary-light">
          <Redirect className="h-4 w-4 fill-gray-500 dark:fill-text-primary" />

          <span className="font-medium text-gray-500 dark:text-text-primary">
            View Series
          </span>
        </Link>

        <button className="rounded-md px-3 py-1 hover:bg-gray-200 dark:hover:bg-primary-light">
          <span className="font-medium text-gray-500 dark:text-text-primary">
            Edit Series
          </span>
        </button>

        <button onClick={() => void deleteSeries(item.id)} className="rounded-md px-3 py-1 font-medium text-gray-500 hover:bg-gray-200 hover:text-[#dc2626!important] dark:text-text-primary dark:hover:bg-primary-light">
          Delete
        </button>
      </div>
    </div>
  );
};

const SeriesLoading = () => {
  return (
    <div className="flex items-center justify-between border-b border-border-light py-4 dark:border-border">
      <div className="loading w-96 h-4 rounded-md bg-border-light dark:bg-border"></div>
      <div className="flex items-center gap-2">
        <div className="loading w-20 h-4 rounded-md bg-border-light dark:bg-border"></div>
        <div className="loading w-20 h-4 rounded-md bg-border-light dark:bg-border"></div>
        <div className="loading w-20 h-4 rounded-md bg-border-light dark:bg-border"></div>
      </div>
    </div>
  )
}
