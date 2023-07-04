import { useClickOutside } from "@mantine/hooks";
import { TRPCClientError } from "@trpc/client";
import Image from "next/image";
import React, { useContext, useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import slugify from "slugify";
import { useDebouncedCallback } from "use-debounce";
import ImagePreview from "~/svgs/ImagePreview";
import { type ArticleCard } from "~/types";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import { handleImageChange } from "~/utils/miniFunctions";
import ImagePlaceholder from "./ImagePlaceholder";
import NewArticleModal from "./NewArticleModal";
import NewTagModal from "./NewTagModal";

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

const NewArticleBody: FC<{
  publishModal: boolean;
  setPublishModal: React.Dispatch<React.SetStateAction<boolean>>;
  publishing: boolean;
  setPublishing: React.Dispatch<React.SetStateAction<boolean>>;
  setSavedState: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  setPublishModal,
  publishModal,
  publishing,
  setPublishing,
  setSavedState,
}) => {
  const { handleChange } = useContext(C) as ContextValue;
  const [query, setQuery] = useState("");
  const [createTagState, setCreateTagState] = useState(false);

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

  const [requestedTags, setRequestedTags] = React.useState<string[]>([]);

  //TODO: this code is running at page load.
  const { refetch } = api.tags.getSingle.useQuery(
    {
      slug: requestedTags, // not working as it needs window object.
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  useEffect(() => {
    //* just for settings tags from url so that i can check if the tags exist or not.
    const article = localStorage.getItem("savedData");
    if (article) {
      const parsedArticle = JSON.parse(article) as ArticleCard;
      if (parsedArticle.tags.length > 0) {
        setRequestedTags(parsedArticle.tags.map((e) => e.slug));
      }
    }
  }, []);

  useEffect(() => {
    // Get Stored data.
    (() => {
      const storedData = localStorage.getItem("savedData");
      if (storedData) {
        const { tags, ...res } = JSON.parse(storedData) as ArticleData;
        setData((prev) => ({ ...prev, ...res }));
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
    })();
  }, []);

  const saveData = (): void => {
    setSavedState(false);
    localStorage.setItem("savedData", JSON.stringify(data));
    setTimeout(() => {
      setSavedState(true); // for fake saving loading 😂😂
    }, 500);
  };

  const debounced = useDebouncedCallback(() => {
    void saveData();
    return;
  }, 500);

  useEffect(() => {
    void debounced();
  }, [data]);

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
      setFile(fileData);
      setFileModal(false);
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      }
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
              className="absolute left-0 top-full z-30 mt-2 w-full bg-light-bg dark:bg-primary-light sm:w-96"
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
            className="mb-10 w-full bg-transparent py-2 text-xl font-semibold text-gray-700 outline-none dark:text-text-secondary"
          />
          <div className="relative">
            {/* <Editor
              onChange={(data: string) =>
                setData((prev) => ({ ...prev, content: data }))
              }
            /> */}
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
        setCreateTagState={setCreateTagState}
        setPublishing={setPublishing}
        query={query}
        setQuery={setQuery}
      />

      {createTagState && (
        <NewTagModal query={query} setCreateTagState={setCreateTagState} />
      )}
    </main>
  );
};

export default NewArticleBody;
