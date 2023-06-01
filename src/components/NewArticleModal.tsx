import Link from "next/link";
import React, { useContext, useEffect } from "react";
import { Times } from "~/svgs";
import { C } from "~/utils/context";
import { wait } from "~/utils/miniFunctions";
import ImagePlaceholder from "./ImagePlaceholder";
import type { ArticleData } from "./NewArticleBody";

const NewArticleModal = ({
  publishModal,
  setPublishModal,
  data,
  setData,
}: {
  publishModal: boolean;
  setPublishModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: ArticleData;
  setData: React.Dispatch<React.SetStateAction<ArticleData>>;
}) => {
  const { handleChange } = useContext(C);

  const [file, setFile] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    setUploading(true);
    const { files } = e.target;
    if (files) {
      const file = files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFile(URL.createObjectURL(file) || "");
      };
    }
    await wait(2); // api testing
    setUploading(false);
  };

  useEffect(() => {
    if (file) {
      setData((prev) => ({
        ...prev,
        seoOgImage: file,
      }));
    }
  }, [file]);

  return (
    <section
      className={`${
        !publishModal ? "translate-x-full" : "translate-x-0"
      } transition-ease scroll-area fixed right-0 top-0 h-screen w-full min-w-0 max-w-[550px] overflow-auto border-l border-border-light bg-light-bg px-4 duration-300 dark:border-border dark:bg-primary-light lg:min-w-[350px]`}
    >
      <div className="h-max ">
        <header className="sticky left-0 top-0 flex items-center justify-between border-b border-border-light bg-light-bg py-4 dark:border-border dark:bg-primary-light">
          <button
            onClick={() => void setPublishModal(false)}
            className="btn-subtle flex items-center justify-center gap-2"
          >
            <Times className="h-5 w-5 fill-gray-700 dark:fill-text-secondary" />
            <span className="text-gray-700 dark:text-white">Close</span>
          </button>
          <button className="btn-filled">Publish</button>
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
              <input
                type="text"
                className="input-secondary"
                placeholder="article-slug"
                id="slug"
                name="slug"
                value={data.slug}
                onChange={(e) => handleChange(e, setData)}
              />
            </div>
            <div className="mb-8">
              <label
                htmlFor="tags"
                className="mb-2 block text-base font-semibold text-gray-700 dark:text-text-secondary"
              >
                Article Tags
              </label>
              <input
                type="text"
                className="input-secondary"
                placeholder="Seperate tags with commas"
                id="tags"
                name="tags"
                value={data.tags}
                onChange={(e) => handleChange(e, setData)}
              />
            </div>
            <div className="mb-8">
              <ImagePlaceholder
                title="CUSTOM OG IMAGE"
                description="Upload an image to display when your article is embedded online or on social network feeds. Recommended dimensions: 1200px X 630px. If you don't have one, your cover image will be used instead."
                file={file}
                uploading={uploading}
                handleChange={handleImageChange}
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
                  onChange={(e) => {
                    setData((prev) => ({
                      ...prev,
                      disableComment: e.target.checked,
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
