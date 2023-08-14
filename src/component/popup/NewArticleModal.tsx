import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, type FC } from "react";
import { toast } from "react-toastify";
import slugify from "slugify";
import { Times } from "~/svgs";
import { type ArticleCard } from "~/types";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import { formattedContent } from "~/utils/miniFunctions";
import { type ArticleData } from "../macroComponent/New/NewArticleBody";
import { SelectSeries, SelectTags } from "../miniComponent";

interface Props {
  publishModal: boolean;
  setPublishModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: ArticleData;
  setData: React.Dispatch<React.SetStateAction<ArticleData>>;
  publishing: boolean;
  setPublishing: React.Dispatch<React.SetStateAction<boolean>>;

  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;

  subtitle: string
}

const NewArticleModal: FC<Props> = ({
  publishModal,
  setPublishModal,
  data,
  setData,
  publishing,
  setPublishing,

  query,
  setQuery,
  subtitle,
}) => {
  const { handleChange } = useContext(C) as ContextValue;
  const { data: user } = useSession()

  const router = useRouter();

  const [requestedTags, setRequestedTags] = React.useState<string[]>([]);

  //TODO: this code is running at page load to fetch only tags from url.
  const { refetch } = api.tags.getSingle.useQuery(
    {
      slug: requestedTags,
    },
    {
      refetchOnMount: false,
      enabled: !!(requestedTags.length > 0),
      refetchOnWindowFocus: false,
      retry: false
    }
  );

  useEffect(() => {
    if (router?.query?.params?.includes("edit")) return;
    //? Getting tag from server if it is in the url or localstorage saved tags.
    const tagsFromUrl = new URLSearchParams(window.location.search).get("tag");
    if (tagsFromUrl) setRequestedTags(tagsFromUrl.split(" "));


    const article = localStorage.getItem("savedData");
    if (article && !router?.query?.params?.includes("edit")) {
      const parsedArticle = JSON.parse(article) as ArticleCard;
      if (parsedArticle.tags.length > 0) {
        setRequestedTags(parsedArticle.tags.map((e) => e.slug));
      }
    }

    const storedData = localStorage.getItem("savedData");
    if (storedData) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tags, ...res } = JSON.parse(storedData) as ArticleData;
      setData((prev) => ({ ...prev, ...res }));
      if (tags.length === 0) return;
      const checkTags = async () => {
        const { data } = await refetch();

        if (!data) return;
        setData((prev) => ({
          ...prev,
          tags: [...prev.tags, ...data.map((e) => e.name)],
        }));
      };

      void checkTags();
    }
  }, []);

  useEffect(() => {
    //* checking if the tags exist or not from server.
    //* only valid tags are added to the tags array.
    void (async () => {
      if (requestedTags.length === 0) return;
      const { data } = await refetch();

      if (!data) return;
      setData((prev) => ({
        ...prev,
        tags: [...prev.tags, ...data.map((e) => e.name)],
      }));
    })();
  }, [requestedTags]);

  const { mutateAsync } = api.posts.new.useMutation();

  const handlePublish = async () => {
    const content = formattedContent(data.content);

    if (!data.title || !content) {
      toast.error("Please fill up the title and content");
      return;
    }

    if (data.title.length < 5) {
      toast.error("Title should be at least 5 characters long");
      return;
    }

    setPublishing(true);
    try {
      const res = await mutateAsync({ ...data, subtitle, content, edit: router?.query?.params?.includes("edit") || false });
      if (res.success && res.redirectLink) {
        setPublishModal(false);
        if (!router?.query?.params?.includes("edit")) {
          localStorage.removeItem("savedData");
        }
        await router.push(res.redirectLink);
        toast.success("Article published successfully");
      }
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      }
    }

    setPublishing(false);
  };

  return (
    <section
      className={`${!publishModal ? "translate-x-full" : "translate-x-0"
        } transition-ease scroll-area fixed right-0 top-0 z-50 h-screen w-full min-w-0 max-w-[550px] overflow-auto border-l border-border-light bg-light-bg px-4 duration-300 dark:border-border dark:bg-primary-light lg:min-w-[350px]`}
    >
      <div className="h-max">
        <header className="sticky left-0 top-0 z-30 flex items-center justify-between border-b border-border-light bg-light-bg py-4 dark:border-border dark:bg-primary-light">
          <button
            onClick={() => void setPublishModal(false)}
            className="btn-subtle flex items-center justify-center gap-2"
          >
            <Times className="h-5 w-5 fill-gray-700 dark:fill-text-secondary" />
            <span className="text-gray-700 dark:text-white">Close</span>
          </button>

          <button
            disabled={publishing}
            onClick={() => void handlePublish()}
            className={`${publishing ? "opacity-50" : ""} btn-filled`}
          >
            {
              router?.query?.params?.includes("edit") ? (
                publishing ? "Updating..." : "Update"
              ) : (
                publishing ? "Publishing..." : "Publish"
              )
            }
          </button>
        </header>

        <main className="px-2 py-4 pt-4">
          <p className="mb-8 text-gray-600 dark:text-text-primary">
            Read Hashnode Clone&apos;s{" "}
            <Link
              href="/docs/code-of-conduct"
              className="text-secondary underline"
            >
              Code of Conduct
            </Link>{" "}
            before publishing the article.
          </p>

          <div className="w-full">
            <div className="mb-8">
              <label
                htmlFor="slug"
                className="mb-2 block text-base font-semibold text-gray-700 dark:text-text-secondary"
              >
                Article Slug
              </label>

              <div className="relative flex items-stretch gap-2 rounded-md border border-border-light dark:border-border md:px-4 ">
                <div className="hidden select-none items-center justify-center border-r border-border-light pr-3 dark:border-border md:flex">
                  <span className="text-gray-500 dark:text-text-primary">
                    /u/@{user?.user.username}/
                  </span>
                </div>

                <input
                  autoComplete="off"
                  autoCorrect="off"
                  type="text"
                  className="input-outline"
                  style={{ border: "0" }}
                  placeholder="article-slug"
                  id="slug"
                  name="slug"
                  value={data.slug}
                  onChange={(e) => {
                    setData((prev) => ({
                      ...prev,
                      slug: slugify(e.target.value, {
                        lower: true,
                        replacement: "-",
                        strict: true,
                        trim: false,
                        locale: "en",
                      }),
                    }));
                  }}
                />
              </div>
            </div>

            <div className="mb-8">
              <label
                htmlFor="tags"
                className="mb-2 block text-base font-semibold text-gray-700 dark:text-text-secondary"
              >
                Article Tags
              </label>

              <SelectTags
                setData={setData}
                tags={data.tags}
                query={query}
                setQuery={setQuery}
              />

              <div className="mt-2 flex flex-wrap gap-2">
                {data.tags.map((tag, index) => (
                  <div
                    className="flex items-center gap-2 rounded-md border border-border-light bg-light-bg px-2 py-1 text-lg text-gray-500 dark:border-border dark:bg-primary-light dark:text-text-primary"
                    key={index}
                  >
                    <span>{tag}</span>

                    <div
                      onClick={() => {
                        setData((prev) => ({
                          ...prev,
                          tags: prev.tags.filter((t) => t !== tag),
                        }));
                      }}
                    >
                      <Times className="h-5 w-5 fill-red" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label
                htmlFor="tags"
                className="mb-2 block text-base font-semibold text-gray-700 dark:text-text-secondary"
              >
                Select Article Series
              </label>

              <SelectSeries setData={setData} series={data.series} />

              {data.series && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 rounded-md border border-border-light bg-light-bg px-2 py-1 text-lg text-gray-500 dark:border-border dark:bg-primary-light dark:text-text-primary">
                    <span>{data.series}</span>

                    <button
                      onClick={() => {
                        setData((prev) => ({
                          ...prev,
                          series: null,
                        }));
                      }}
                    >
                      <Times className="h-5 w-5 fill-red" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-8">
              <label
                htmlFor="seoTitle"
                className="mb-2 block text-base font-semibold text-gray-700 dark:text-text-secondary"
              >
                SEO TITLE (OPTIONAL)
              </label>

              <p className="mb-4 text-sm text-gray-500 dark:text-text-primary">
                The &quot;SEO Title&quot; will be shown in place of your Title
                on search engine results pages, such as a Google search. SEO
                titles between 40 and 50 characters with commonly searched words
                have the best click-through-rates.
              </p>

              <input
                autoComplete="off"
                autoCorrect="off"
                type="text"
                className="input-secondary"
                placeholder="Enter meta title"
                id="seoTitle"
                name="seoTitle"
                value={data.seoTitle}
                onChange={(e) => handleChange(e, setData)}
              />
            </div>

            <div className="mb-8">
              <label
                htmlFor="tags"
                className="mb-2 block text-base font-semibold text-gray-700 dark:text-text-secondary"
              >
                SEO DESCRIPTION (OPTIONAL)
              </label>

              <p className="mb-4 text-sm text-gray-500 dark:text-text-primary">
                The SEO Description will be used in place of your Subtitle on
                search engine results pages. Good SEO descriptions utilize
                keywords, summarize the article and are between 140-156
                characters long.
              </p>

              <textarea
                className="input-secondary min-h-[12rem]"
                placeholder="Enter meta description..."
                id="seoDescription"
                name="seoDescription"
                value={data.seoDescription}
                onChange={(e) => handleChange(e, setData)}
              />
            </div>

            <div>
              <label
                htmlFor="tags"
                className="mb-2 block text-base font-semibold text-gray-700 dark:text-text-secondary"
              >
                DISABLE COMMENTS?
              </label>

              <p className="mb-4 text-sm text-gray-500 dark:text-text-primary">
                This will hide the comments section below your article.
              </p>

              <div className="flex items-center gap-2">
                <input
                  autoComplete="off"
                  autoCorrect="off"
                  onChange={(e) => {
                    setData((prev) => ({
                      ...prev,
                      disabledComments: e.target.checked,
                    }));
                  }}
                  id="disableComment"
                  type="checkbox"
                />

                <label
                  htmlFor="disableComment"
                  className="text-gray-500 dark:text-text-primary"
                >
                  Yes
                </label>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default NewArticleModal;
