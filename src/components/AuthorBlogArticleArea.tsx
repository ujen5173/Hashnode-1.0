import { type FC } from "react";
import AuthorBlogArticleCard from "./Cards/AuthorBlogArticleCard";

const AuthorBlogArticleArea: FC<{
  data:
    | {
        id: string;
        title: string;
        slug: string;
        read_time: number;
        user: {
          profile: string;
          username: string;
        };
        subtitle?: string | null;
        cover_image?: string | null;
      }[]
    | undefined; // undefined because this is api based data can can be undefined
}> = ({ data }) => {
  return (
    <>
      <div className="w-full border-b border-border-light bg-light-bg dark:border-border dark:bg-black">
        <div className="author-blog-grid mx-auto max-w-[1300px] px-4 py-8">
          {data && data[0] ? (
            <AuthorBlogArticleCard type="main" article={data[0]} />
          ) : null}

          {data
            ? data.length > 1 &&
              data?.slice(1, 3).map((article) => (
                <div className="child-block" key={article.id}>
                  <AuthorBlogArticleCard type="group" article={article} />
                </div>
              ))
            : null}
        </div>
      </div>
      {data
        ? data?.length > 2 && (
            <div className="border-b border-border-light bg-light-bg px-4 py-16 dark:border-border dark:bg-primary">
              <div className="mx-auto flex max-w-[1300px] items-center justify-center">
                <div className="flex w-full flex-wrap gap-6">
                  {data?.slice(3, data.length).map((article) => (
                    <AuthorBlogArticleCard
                      key={article.id}
                      type="non-grid"
                      width="w-full md:w-[calc(100%/2-1rem)] lg:w-[calc(100%/3-1rem)]"
                      article={article}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        : null}
    </>
  );
};

export default AuthorBlogArticleArea;
