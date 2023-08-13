import { type Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useContext, type FC } from "react";
import { Pen } from "~/svgs";
import { C, type ContextValue } from "~/utils/context";

interface Props {
  user: Session | null;
  author: {
    name: string;
    profile: string;
    username: string;
    handle: {
      about: string;
    };
  };
}

const NoArticlesUploadedError: FC<Props> = ({ user, author }) => {
  const { theme } = useContext(C) as ContextValue;

  return (
    <div className="w-full border-t border-border-light bg-light-bg px-4 py-8 dark:border-border dark:bg-primary">
      <div className="mx-auto w-full max-w-[35rem]">
        <Image
          src={
            theme === "light"
              ? "/noArticlesUploaded-light.avif"
              : "/noArticlesUploaded-dark.avif"
          }
          alt="No Articles Uploaded By the Author"
          width={800}
          height={800}
          className="mx-auto w-full object-cover"
        />

        <div className="flex flex-col justify-center">
          <h1 className="mb-6 text-center text-2xl font-medium text-gray-700 dark:text-text-secondary">
            {user?.user.username === author.username
              ? "Your blog is empty! Write your first article"
              : "No articles to show"}
          </h1>

          {user?.user.username === author.username && (
            <Link href="/article/new" className="mx-auto block">
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
  );
};

export default NoArticlesUploadedError;
