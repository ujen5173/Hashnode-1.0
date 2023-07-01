import { TRPCClientError } from "@trpc/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";
import { Hashtag, Times } from "~/svgs";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import { handleImageChange } from "~/utils/miniFunctions";
import ImagePlaceholder from "./ImagePlaceholder";
import Input from "./Input";
import TagLoading from "./Loading/TagLoading";
import type { ArticleData } from "./NewArticleBody";

const NewArticleModal = ({
  publishModal,
  setPublishModal,
  data,
  setData,
  publishing,
  setPublishing,
}: {
  publishModal: boolean;
  setPublishModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: ArticleData;
  setData: React.Dispatch<React.SetStateAction<ArticleData>>;

  publishing: boolean;
  setPublishing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user, handleChange } = useContext(C) as ContextValue;

  const [file, setFile] = React.useState<string | null>(null);
  const router = useRouter();

  const handleImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const fileData = await handleImageChange(file);
      setFile(fileData);
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (file) {
      setData((prev) => ({
        ...prev,
        seoOgImage: file,
      }));
    }
  }, [file]);

  const { mutateAsync } = api.posts.new.useMutation();

  const handlePublish = async () => {
    if (!data.title || !data.content) {
      alert("Please fill up the title and content");
      return;
    }

    if (data.title.length < 5) {
      toast.error("Title should be at least 5 characters long");
      return;
    }
    if (data.content.length < 25) {
      toast.error("Content should be at least 25 characters long");
      return;
    }

    setPublishing(true);

    try {
      const res = await mutateAsync(data);
      if (res.success) {
        setPublishModal(false);
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
      className={`${
        !publishModal ? "translate-x-full" : "translate-x-0"
      } transition-ease scroll-area fixed right-0 top-0 z-50 h-screen w-full min-w-0 max-w-[550px] overflow-auto border-l border-border-light bg-light-bg px-4 duration-300 dark:border-border dark:bg-primary-light lg:min-w-[350px]`}
    >
      <div className="h-max">
        <header className="sticky left-0 top-0 flex items-center justify-between border-b border-border-light bg-light-bg py-4 dark:border-border dark:bg-primary-light">
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
            {publishing ? "Publishing..." : "Publish"}
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
              <div className="relative flex items-stretch gap-2 rounded-md border border-border-light px-4 dark:border-border ">
                <div className="flex select-none items-center justify-center border-r border-border-light pr-3 dark:border-border">
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
                  onChange={(e) => handleChange(e, setData)}
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
              <SelectTags setData={setData} tags={data.tags} />

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
              <ImagePlaceholder
                title="CUSTOM OG IMAGE"
                description="Upload an image to display when your article is embedded online or on social network feeds. Recommended dimensions: 1200px X 630px. If you don't have one, your cover image will be used instead."
                file={file}
                handleChange={async (event) => await handleImage(event)}
                recommendedText="Recommended dimension is 1600 x 840"
              />
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
            <div className="mb-8">
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

const SelectTags: FC<{
  tags: string[];
  setData: React.Dispatch<React.SetStateAction<ArticleData>>;
}> = ({ tags: t, setData }) => {
  console.log({ t });
  const [tags, setTags] = useState<
    { id: string; name: string; logo?: string }[]
  >([]);
  const [refetching, setRefetching] = useState(true);
  const [query, setQuery] = useState("");

  const [opened, setOpened] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);

  const { refetch } = api.tags.searchTags.useQuery(
    {
      query,
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  async function search(
    criteria: string
  ): Promise<{ id: string; name: string; logo?: string }[]> {
    let response;
    if (criteria.trim().length > 0) {
      setRefetching(true);
      response = await refetch();
      setRefetching(false);
      if (response.data) {
        return response.data as { id: string; name: string; logo?: string }[];
      } else {
        return [];
      }
    }

    return [];
  }

  const debounced = useDebouncedCallback(async (value: string) => {
    const response = await search(value);
    const newData = response.filter((tag) => !t.includes(tag.name));
    setTags(newData);
  }, 500);

  return (
    <div className="relative">
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          autoComplete="off"
          autoCorrect="off"
          type="text"
          className="input-secondary"
          ref={input}
          placeholder="Seperate tags with commas"
          id="tags"
          name="tags"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            void debounced(e.target.value);
            setRefetching(true);
          }}
        />
      </form>

      {(opened || query !== "") && (
        <div
          ref={ref}
          className="scroll-area absolute left-0 top-full z-50 flex max-h-[250px] min-h-[250px] w-full flex-col items-center justify-start overflow-auto rounded-md border border-border-light bg-light-bg shadow-md dark:border-border dark:bg-primary"
        >
          {refetching ? (
            <>
              <TagLoading variant="non-rounded" />
              <TagLoading variant="non-rounded" />
              <TagLoading variant="non-rounded" />
              <TagLoading variant="non-rounded" />
            </>
          ) : tags.length > 0 ? (
            tags.map((tag, index) => (
              <div
                className="flex w-full cursor-pointer items-center gap-2 border-b border-border-light px-2 py-2 text-lg text-gray-500 last:border-none dark:border-border dark:text-text-primary"
                onClick={() => {
                  setData((prev) => ({
                    ...prev,
                    tags: Array.from(new Set([...prev.tags, tag.name])),
                  }));
                  input.current?.focus();

                  setOpened(false);
                  setQuery("");
                }}
                key={index}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white dark:bg-primary-light">
                  {tag.logo ? (
                    <Image
                      src={tag.logo}
                      alt={tag.name}
                      width={70}
                      height={70}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-200 dark:bg-primary-light">
                      <Hashtag className="mx-auto my-3 h-6 w-6 fill-none stroke-gray-500" />
                    </div>
                  )}
                </div>

                <span>{tag.name}</span>
              </div>
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <p className="text-gray-500 dark:text-text-primary">
                No tags found
              </p>
              <button className="btn-filled">Create One</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const NewTagModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 z-40 bg-black bg-opacity-40 backdrop-blur"></div>
      <div className="relative z-50 w-full min-w-[350px] max-w-[550px] overflow-hidden rounded-md border border-border-light bg-light-bg dark:border-border dark:bg-primary">
        <div className="border-b border-border-light p-4 dark:border-border">
          <h1 className="text-lg font-semibold text-gray-700 dark:text-text-secondary">
            Create New Tag
          </h1>
        </div>

        <div className="p-4">
          <Input
            label="Tag Name"
            type="INPUT"
            variant="FILLED"
            placeholder="Python"
            input_type="text"
            disabled={false}
            required={true}
            value={""}
            name="name"
            onChange={() => {
              console.log("hi");
            }}
          />
          <Input
            type="TEXTAREA"
            input_type="text"
            placeholder="Description"
            variant="FILLED"
            onChange={() => {
              console.log("hi");
            }}
            value={""}
            disabled={false}
            required={true}
            label="Tag Description"
            name="description"
          />
          <Input
            type="IMAGE"
            input_type="image"
            placeholder=""
            variant="FILLED"
            onChange={() => {
              console.log("hi");
            }}
            value={""}
            disabled={false}
            required={true}
            label="Tag Logo"
            name="logo"
          />
          <button className="btn-filled">Create</button>
        </div>
      </div>
    </div>
  );
};
