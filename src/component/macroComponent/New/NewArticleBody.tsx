import { useClickOutside } from "@mantine/hooks";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import Image from "next/image";
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import slugify from "slugify";
import { useDebouncedCallback } from "use-debounce";
import Editor from "~/component/editor";
import { ImagePlaceholder, Input } from "~/component/miniComponent";
import { NewArticleModal } from "~/component/popup";
import { Times } from "~/svgs";
import ImagePreview from "~/svgs/ImagePreview";
import LoadingSpinner from "~/svgs/LoadingSpinner";
import { type DefaultEditorContent } from "~/types";
import { api } from "~/utils/api";
import { slugSetting } from "~/utils/constants";
import { C, type ContextValue } from "~/utils/context";
import { convertToHTML, imageToBlogHandler } from "~/utils/miniFunctions";
import { useUploadThing } from "~/utils/uploadthing";

export interface ArticleData {
  title: string;
  subtitle: string | null;
  content: DefaultEditorContent;
  cover_image: string | null;
  cover_imageKey: string | null;
  tags: string[];
  slug: string;
  series: string | null;
  seoTitle: string;
  seoDescription: string;
  seoOgImage: string | null;
  seoOgImageKey: string | null;
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
    const [subtitle, setSubTitle] = useState<string>("");
    const router = useRouter();

    const { data: articleData, error } = api.posts.getArticleToEdit.useQuery({
      slug: (router?.query?.params as string[])[1] as string,
    }, {
      enabled: !!(router?.query?.params?.includes("edit")),
      refetchOnWindowFocus: false,
      retry: false
    });

    useEffect(() => {
      if (error) {
        if (error instanceof TRPCClientError || error instanceof TRPCError) {
          toast.error(error.message)
          void router.push("/")
        } else {
          toast.error("Something went wrong getting article")
          void router.push("/")
        }
      }
    }, [error]);


    const [data, setData] = useState<ArticleData>({
      title: "",
      subtitle: "",
      content: {
        type: "doc",
        content: [{
          type: "paragraph",
          text: "",
        }]
      },
      cover_image: null,
      series: null,
      tags: [],
      cover_imageKey: null,
      slug: "",
      seoTitle: "",
      seoDescription: "",
      seoOgImage: null,
      seoOgImageKey: null,
      disabledComments: false,
    });

    useEffect(() => {
      if (articleData) {
        setData({ ...articleData, content: convertToHTML(articleData.content) as DefaultEditorContent });
      }
    }, [articleData])


    const saveData = (): void => {
      if (router?.query?.params?.includes("edit")) return;

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

    const [fileModal, setFileModal] = React.useState(false); // open and close file upload modal
    const ref = useClickOutside<HTMLDivElement>(() => setFileModal(false));

    const { startUpload, isUploading } = useUploadThing("imageUploader");

    const deleteImage = (key: string | undefined): void => {
      if (!key) return;
      //! Missing UPLOADTHING_SECRET env variable bug occured!!!
      // await utapi.deleteFiles(key);
      if (key === "seoOgImageKey") {
        setData({
          ...data,
          seoOgImage: null,
          seoOgImageKey: null,
        });
      } else {
        setData({
          ...data,
          cover_image: null,
          cover_imageKey: null,
        });
      }
    };

    return (
      <main className="relative min-h-[100dvh] w-full overflow-hidden border-b border-border-light bg-white dark:border-border dark:bg-primary">
        <div className="mx-auto w-full max-w-[1000px] px-4 py-6">
          <div className="relative mb-5 flex items-center gap-2">
            {isUploading ? (
              <span className="flex items-center gap-2 px-4 py-2">
                <LoadingSpinner className="h-5 w-5 fill-none stroke-gray-500 dark:stroke-text-primary" />

                <span className="text-gray-500 dark:text-text-primary">
                  {"Uploading..."}
                </span>
              </span>
            ) : (
              <>
                <button
                  onClick={() => setFileModal((prev) => !prev)}
                  className="btn-subtle flex items-center justify-center gap-2"
                >
                  <ImagePreview className="h-5 w-5 fill-none stroke-gray-500 dark:stroke-text-primary" />
                  <span className="text-gray-500 dark:text-text-primary">
                    {"Add Cover"}
                  </span>
                </button>

                {fileModal && (
                  <div
                    ref={ref}
                    className="absolute left-0 top-full z-30 mt-2 w-full sm:w-96"
                  >
                    <ImagePlaceholder
                      minHeight={"10rem"}
                      recommendedText="Recommended dimension is 1600 x 840"
                      handleChange={async (event) => {
                        // here we are handling the image upload and preview.
                        setFileModal(false);
                        const file = event?.target?.files?.[0];
                        if (!file) return;
                        const image = await imageToBlogHandler(file);
                        if (!image) return;
                        if (isUploading) {
                          toast.error("Already uploading");
                          return;
                        }
                        const uploaded = await startUpload([image]);
                        if (!uploaded) {
                          toast.error("Error uploading image");
                          return;
                        }
                        setData((prev) => ({
                          ...prev,
                          cover_image: uploaded[0]?.fileUrl || null,
                          cover_imageKey: uploaded[0]?.fileKey || null,
                        }));
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {data.cover_image && (
            <div className="relative mb-5 w-full rounded-md border border-border-light dark:border-border">
              <button
                onClick={() => void deleteImage("cover_imageKey")}
                className="absolute right-4 top-4 rounded-md border border-border-light bg-white bg-opacity-60 px-3 py-2"
              >
                <Times className="h-5 w-5 fill-gray-700 stroke-none" />
              </button>

              <Image
                src={data.cover_image}
                alt="cover"
                width={1600}
                height={840}
                className={`${isUploading ? "loading" : ""
                  } max-h-[30rem] w-full rounded-lg object-cover`}
              />
            </div>
          )}

          <section className="px-2">
            <div className="relative">
              <Input
                value={data.title}
                onChange={(e) => {
                  handleChange(e, setData);
                  setData((prev) => ({
                    ...prev,
                    slug: slugify(e.target.value, slugSetting),
                  }));
                }}
                placeholder="Article Title"
                input_type="text"
                variant="TRANSPARENT"
                name="title"
                fontSize="3xl"
                type="INPUT"
                required={true}
                autoFocus={true}
              />
            </div>
            <Input
              value={subtitle}
              onChange={(e) => {
                setSubTitle(e.target.value);
              }}
              placeholder="Article Subtitle (optional)"
              input_type="text"
              variant="TRANSPARENT"
              name="subtitle"
              fontSize="2xl"
              type="INPUT"
              required={true}
            />

            <div className="relative">
              <Editor
                value={data.content}
                onChange={(e) => {
                  setData((prev) => ({
                    ...prev,
                    content: e,
                  }));
                }}
              />
            </div>
          </section>
        </div>

        {publishModal && (
          <div
            className="fixed inset-0 bg-transparent backdrop-blur-[2px]"
            onClick={() => setPublishModal((prev) => !prev)}
          />
        )}

        <NewArticleModal
          publishModal={publishModal}
          setPublishModal={setPublishModal}
          data={data}
          setData={setData}
          publishing={publishing}
          setPublishing={setPublishing}
          query={query}
          setQuery={setQuery}
          subtitle={subtitle}
        />
      </main>
    );
  };

export default NewArticleBody;
