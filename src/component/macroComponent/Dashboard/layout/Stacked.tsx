import Image from "next/image";
import Link from "next/link";
import { useContext, type FC } from "react";
import removeMd from "remove-markdown";
import { Book, Pen } from "~/svgs";
import { type DataType } from "~/types";
import { C, type ContextValue } from "~/utils/context";
import { formatDate, limitText } from "~/utils/miniFunctions";

const Stacked: FC<{
  data: DataType[] | undefined;
  isLoading: boolean;
  author: {
    name: string;
    username: string;
    profile: string;
    bio: string;
    handle: {
      about: string;
    };
  };
}> = ({ data, isLoading, author }) => {
  const { user, theme } = useContext(C) as ContextValue;
  return (
    <div className="w-full border-b border-border-light bg-light-bg dark:border-border dark:bg-primary">
      <div className="border-b border-border-light dark:border-border">
        <div className="mx-auto flex max-w-[1000px] flex-col items-center justify-center px-4 py-16">
          <div className="flex flex-col items-center justify-center gap-2">
            <Image
              src={author.profile || ""}
              width={120}
              height={120}
              alt="User Profile"
              className="h-18 w-18 rounded-full object-cover"
            />
            <h1 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-text-secondary">
              {author.name}
            </h1>
            <p className="text-base text-gray-500 dark:text-text-primary">
              {author.handle.about || "No bio added yet!"}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="border-light h-[50%] min-h-[24rem] rounded-md border border-border-light bg-gray-200 shadow-md dark:border-border dark:bg-primary-light"></div>
      ) : data && data.length > 0 ? (
        <div className="mx-auto max-w-[900px] px-4 py-8">
          {data.map((e) => (
            <div
              className="w-full border-b border-border-light p-4 last:border-none dark:border-border"
              key={e.id}
            >
              <main className="">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-[2]">
                    <Link href={`/u/@${e.user.username}/${e.slug}`}>
                      <h1 className="mb-2 text-3xl font-bold text-gray-700 dark:text-text-secondary">
                        {e.title}
                      </h1>
                    </Link>

                    <Link
                      href={`/u/@${e.user.username}/${e.slug}`}
                      className="mb-4 flex items-center gap-2"
                    >
                      <p className="text-sm font-medium text-gray-700 dark:text-text-primary">
                        {formatDate(e.createdAt)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Book className="h-4 w-4 fill-secondary" />
                        <p className="text-sm font-medium text-gray-700 dark:text-text-primary">
                          {e.read_time} min read
                        </p>
                      </div>
                    </Link>

                    <Link href={`/u/@${e.user.username}/${e.slug}`}>
                      <p
                        className={`${
                          e.cover_image
                            ? "max-height-4"
                            : "max-height-3 mb-0 w-full md:mb-3"
                        } break-words text-base text-gray-500 dark:text-text-primary`}
                      >
                        {limitText(removeMd(e.content), 150)}
                      </p>
                    </Link>
                  </div>

                  <Link
                    className="flex-1"
                    href={`/@${e.user.username}/${e.slug}`}
                  >
                    <div>
                      <Image
                        src={
                          e.cover_image || theme === "light"
                            ? "/imagePlaceholder-light.avif"
                            : "/imagePlaceholder-dark.avif"
                        }
                        alt={`${e.title} image not found!`}
                        width={500}
                        height={300}
                        className="w-full rounded-md border border-border-light bg-white object-cover text-gray-700 dark:border-border dark:bg-primary-light dark:text-text-secondary"
                      />
                    </div>
                  </Link>
                </div>
              </main>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full bg-light-bg px-4 py-8 dark:bg-primary">
          <div className="mx-auto w-full max-w-[35rem]">
            <Image
              src="/noArticlesUploaded.avif"
              alt="No Articles Uploaded By the Author"
              width={800}
              height={800}
              className="mx-auto w-full object-cover"
            />

            <div className="flex flex-col justify-center">
              <h1 className="mb-6 text-center text-2xl font-medium text-gray-700 dark:text-text-secondary">
                {user?.user.username === author.username ? "Your" : "Author"}{" "}
                blog is empty!{" "}
                {user?.user.username === author.username
                  ? "Write your first article"
                  : ""}
              </h1>

              {user?.user.username === author.username && (
                <Link href="/new" className="mx-auto block">
                  <button className="btn-filled">
                    <span className="flex items-center gap-2">
                      <Pen className="h-5 w-5 fill-none stroke-gray-100" />
                      <span className="tracking-wider">Write an article</span>
                    </span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stacked;
