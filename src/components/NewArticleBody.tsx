import { useClickOutside } from "@mantine/hooks";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import slugify from "slugify";
import ImagePreview from "~/svgs/ImagePreview";
import { C, type ContextValue } from "~/utils/context";
import { handleImageChange } from "~/utils/miniFunctions";
import ImagePlaceholder from "./ImagePlaceholder";
import NewArticleModal from "./NewArticleModal";

export interface ArticleData {
  title: string;
  subtitle?: string;
  content: string;
  cover_image?: string;
  tags: string[];
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  seoOgImage?: string;
  disabledComments: boolean;
}

const NewArticleBody = ({
  setPublishModal,
  publishModal,
  publishing,
  setPublishing,
}: {
  publishModal: boolean;
  setPublishModal: React.Dispatch<React.SetStateAction<boolean>>;
  publishing: boolean;
  setPublishing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { handleChange } = useContext(C) as ContextValue;
  const [data, setData] = useState<ArticleData>({
    title: "",
    subtitle: "",
    content: "",
    cover_image: undefined,
    tags: [],
    slug: "",
    seoTitle: "",
    seoDescription: "",
    seoOgImage: "",
    disabledComments: false,
  });

  const [file, setFile] = React.useState<string | null>(null);
  const [fileModal, setFileModal] = React.useState<boolean>(false); // open and close file upload modal
  const ref = useClickOutside<HTMLDivElement>(() => setFileModal(false));

  useEffect(() => {
    // useEffect to fill up the cover image
    if (file) {
      setData((prev) => ({
        ...prev,
        cover_image: file,
      }));
    }
  }, [file]);

  const handleImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const fileData = await handleImageChange(file);
      console.log({ fileData });
      setFile(fileData);
      setFileModal(false);
    } catch (error) {
      // Handle any errors that occurred during the handling of the image
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden border-b border-border-light bg-white dark:border-border dark:bg-primary">
      <div className="mx-auto w-full max-w-[1000px] px-4 py-6">
        <div className="relative mb-5 flex items-center gap-2">
          <button
            onClick={() => setFileModal((prev) => !prev)}
            className="btn-subtle flex items-center justify-center gap-2"
          >
            <ImagePreview className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-secondary" />
            <span>{"Add Cover"}</span>
          </button>

          {fileModal && (
            <div
              ref={ref}
              className="absolute left-0 top-full mt-2 w-full sm:w-96"
            >
              <ImagePlaceholder
                file={file}
                minHeight={"10rem"}
                handleChange={async (event) => await handleImage(event)}
                recommendedText="Recommended dimension is 1600 x 840"
              />
            </div>
          )}
        </div>

        {file && (
          <>
            <div className="mb-5 w-full rounded-md border border-border-light dark:border-border">
              <Image
                src={file ? file : "/images/placeholder.png"}
                alt="cover"
                width={1600}
                height={840}
                className="max-h-[30rem] w-full rounded-md object-cover"
              />
            </div>
          </>
        )}

        <section className="px-2">
          <div className="relative">
            <input
              type="text"
              id="title"
              name="title"
              autoComplete="off"
              autoCorrect="off"
              value={data.title}
              onChange={(e) => {
                handleChange(e, setData);
                setData((prev) => ({
                  ...prev,
                  slug: slugify(e.target.value, {
                    replacement: "-",
                    remove: undefined,
                    lower: true,
                    strict: true,
                    locale: "vi",
                    trim: true,
                  }),
                }));
              }}
              placeholder="Article Title..."
              className="mb-4 w-full bg-transparent py-2 text-4xl font-bold text-gray-700 outline-none dark:text-text-secondary"
            />
          </div>
          <input
            type="text"
            id="subtitle"
            name="subtitle"
            value={data.subtitle}
            onChange={(e) => handleChange(e, setData)}
            placeholder="Article Subtitle..."
            autoComplete="off"
            autoCorrect="off"
            className="mb-4 w-full bg-transparent py-2 text-xl font-semibold text-gray-700 outline-none dark:text-text-secondary"
          />
          <div className="relative">
            <textarea
              id="content"
              name="content"
              value={data.content}
              onChange={(e) => {
                handleChange(e, setData);
              }}
              placeholder="Start writing your story..."
              autoComplete="off"
              autoCorrect="off"
              className="min-h-[70vh] w-full bg-transparent py-2 text-gray-700 outline-none dark:text-text-secondary"
            />
          </div>
        </section>
      </div>

      {publishModal && (
        <div
          className="fixed inset-0 bg-transparent backdrop-blur-[2px]"
          onClick={() => setPublishModal((prev) => !prev)}
        ></div>
      )}

      <NewArticleModal
        publishModal={publishModal}
        setPublishModal={setPublishModal}
        data={data}
        setData={setData}
        publishing={publishing}
        setPublishing={setPublishing}
      />
    </main>
  );
};

export default NewArticleBody;
