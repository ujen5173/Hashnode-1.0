import { useClickOutside } from "@mantine/hooks";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import slugify from "slugify";
import ImagePreview from "~/svgs/ImagePreview";
import { C } from "~/utils/context";
import { wait } from "~/utils/miniFunctions";
import ImagePlaceholder from "./ImagePlaceholder";
import NewArticleModal from "./NewArticleModal";

export interface ArticleData {
  title: string;
  subtitle?: string;
  content: string;
  cover?: string;
  tags: string[];
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  seoOgImage?: string;
  disableComment: boolean;
}

const NewArticleBody = ({
  setPublishModal,
  publishModal,
}: {
  publishModal: boolean;
  setPublishModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { handleChange } = useContext(C);
  const [data, setData] = useState<ArticleData>({
    title: "",
    subtitle: "",
    content: "",
    cover: "",
    tags: [],
    slug: "",
    seoTitle: "",
    seoDescription: "",
    seoOgImage: "",
    disableComment: false,
  });

  const [file, setFile] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState<boolean>(false); // upload loading
  const [fileModal, setFileModal] = React.useState<boolean>(false); // open and close file upload modal
  const ref = useClickOutside<HTMLDivElement>(() => setFileModal(false));

  useEffect(() => {
    if (file) {
      setData((prev) => ({
        ...prev,
        cover: file,
      }));
    }
  }, [file]);

  console.log(data);

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
    setFileModal(false);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden border-b border-border-light bg-white dark:border-border dark:bg-primary">
      <div className="mx-auto w-full max-w-[1000px] px-4 py-6">
        <div className="relative mb-5 flex items-center gap-2">
          <button
            onClick={() => setFileModal((prev) => !prev)}
            disabled={uploading}
            className="btn-subtle flex items-center justify-center gap-2"
          >
            <ImagePreview className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-secondary" />
            <span>{uploading ? "Uploading..." : "Add Cover"}</span>
          </button>

          {fileModal && (
            <div
              ref={ref}
              className="absolute left-0 top-full mt-2 w-full sm:w-96"
            >
              <ImagePlaceholder
                file={file}
                minHeight={"10rem"}
                uploading={uploading}
                handleChange={handleImageChange}
                recommendedText="Recommended dimension is 1600 x 840"
              />
            </div>
          )}
        </div>

        {file && !uploading && (
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

          <textarea
            id="content"
            name="content"
            value={data.content}
            onChange={(e) => handleChange(e, setData)}
            placeholder="Start writing your story..."
            autoComplete="off"
            autoCorrect="off"
            className="min-h-[70vh] w-full bg-transparent py-2 text-gray-700 outline-none dark:text-text-secondary"
          />
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
      />
    </main>
  );
};

export default NewArticleBody;
