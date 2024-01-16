import { useClickOutside } from "@mantine/hooks";
import { FileImage, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import slugify from "slugify";
import { utapi } from "uploadthing/server";
import Editor from "~/component/editor";
import { ImagePlaceholder, Input } from "~/component/miniComponent";
import { NewArticleModal } from "~/component/popup";
import { LoadingSpinner } from "~/svgs";
import { type DefaultEditorContent } from "~/types";
import { api } from "~/utils/api";
import { slugSetting } from "~/utils/constants";
import generateContent from "~/utils/contentGenerator";
import { convertToHTML, imageToBlogHandler } from "~/utils/miniFunctions";
import { useUploadThing } from "~/utils/uploadthing";

export interface ArticleData {
  title: string;
  subtitle: string;
  content: DefaultEditorContent;
  userId: string | null;
  cover_image: string | null;
  cover_image_key: string | null;
  tags: string[];
  slug: string;
  series: string | null;
  seoTitle: string;
  seoDescription: string;
  seoOgImage: string | null;
  seoOgImageKey: string | null;
  disabledComments: boolean;
}

export const defaultArticleData = {
  title: "",
  subtitle: "",
  userId: null,
  content: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "",
          },
        ],
      },
    ],
  },
  cover_image: null,
  cover_image_key: null,
  tags: [],
  slug: "",
  series: null,
  seoTitle: "",
  seoDescription: "",
  seoOgImage: null,
  seoOgImageKey: null,
  disabledComments: false,
};

const NewArticleBody: FC<{
  publishModal: boolean;
  setPublishModal: React.Dispatch<React.SetStateAction<boolean>>;
  publishing: boolean;
  setPublishing: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setPublishModal, publishModal, publishing, setPublishing }) => {
  const router = useRouter();

  const [hydrate, setHydrate] = useState(false);
  const [contentRendered, setContentRendered] = useState(false);
  const [edit, setEdit] = useState(false);
  const [query, setQuery] = useState("");
  const [prev_slug, setPrev_slug] = useState<string | null>(null);
  const [generatingContent, setGeneratingContent] = useState({
    title: false,
    subtitle: false,
    content: false,
  });

  const [data, setData] = useState<ArticleData>(defaultArticleData);

  const {
    data: editData,
    isSuccess,
    error,
  } = api.posts.getArticleToEdit.useQuery(
    { slug: router?.query?.params?.[1] as string },
    {
      enabled: !!(hydrate && edit),
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }

    if (editData) {
      const { subtitle, ...rest } = editData;
      setPrev_slug(editData.slug);
      setData({
        ...rest,
        subtitle: subtitle || "",
        content: convertToHTML(editData.content) as DefaultEditorContent,
      });
    }
  }, [error, editData]);

  const [requestedTags, setRequestedTags] = useState<string[]>([]);

  const { data: tagsData } = api.tags.getSingle.useQuery(
    {
      slug: requestedTags,
    },
    {
      enabled: !!requestedTags.length,
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (tagsData) {
      setData({ ...data, tags: tagsData.map((tag) => tag.name) });
    }
  }, [tagsData]);

  useEffect(() => {
    if (router?.query.params?.includes("edit")) {
      setEdit(true);
    }

    setHydrate(true);
    const tagsFromUrl = new URLSearchParams(window.location.search).get("tag");
    if (tagsFromUrl) setRequestedTags(tagsFromUrl.split(" "));
  }, [router]);

  const [fileModal, setFileModal] = React.useState(false); // open and close file upload modal
  const ref = useClickOutside<HTMLDivElement>(() => setFileModal(false));

  const { startUpload, isUploading } = useUploadThing("imageUploader");

  const deleteImage = async (key: string | undefined): Promise<void> => {
    if (!key) return;
    //! Missing UPLOADTHING_SECRET env variable bug occured!!!
    await utapi.deleteFiles(key);
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
        cover_image_key: null,
      });
    }
  };

  const generateContents = {
    title: async () => {
      setGeneratingContent((prev) => ({ ...prev, title: true }));
      const title = await generateContent({ type: "TITLE" });
      setGeneratingContent((prev) => ({ ...prev, title: false }));
      setData({ ...data, title, slug: slugify(title, slugSetting) });
    },
    subtitle: async () => {
      setGeneratingContent((prev) => ({ ...prev, subtitle: true }));
      const subtitle = await generateContent({
        type: "SUBTITLE",
        subject: data.title ?? undefined,
      });
      setGeneratingContent((prev) => ({ ...prev, subtitle: false }));
      setData({ ...data, subtitle });
    },
    content: async () => {
      setGeneratingContent((prev) => ({ ...prev, content: true }));
      const content = await generateContent({
        type: "CONTENT",
        subject: data.title ?? undefined,
      });
      setGeneratingContent((prev) => ({ ...prev, content: false }));
      const formattedContent = convertToHTML(content) as DefaultEditorContent;
      setData({ ...data, content: formattedContent });
      setContentRendered((prev) => !prev);
    },
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
                <FileImage className="h-5 w-5 fill-none stroke-gray-500 dark:stroke-text-primary" />
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
                      const newData = {
                        ...data,
                        cover_image: uploaded[0]?.fileUrl || null,
                        cover_image_key: uploaded[0]?.fileKey || null,
                      };
                      setData(newData);
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
              onClick={() => void deleteImage("cover_image_key")}
              className="absolute right-4 top-4 rounded-md border border-border-light bg-white bg-opacity-60 px-3 py-2"
            >
              <X className="h-5 w-5 fill-none stroke-gray-700" />
            </button>

            <Image
              src={data.cover_image}
              alt="cover"
              width={1600}
              height={840}
              className={`${
                isUploading ? "loading" : ""
              } max-h-[30rem] w-full rounded-lg object-cover`}
            />
          </div>
        )}

        <section className="px-2">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => void generateContents.title()}
              className="rounded-md bg-blue-500 p-2"
            >
              {generatingContent.title ? (
                <LoadingSpinner className="h-5 w-5 fill-none stroke-white" />
              ) : (
                <Sparkles className="h-5 w-5 stroke-slate-200" />
              )}
            </button>
            <div className="flex-1">
              <Input
                value={data.title}
                onChange={(e) => {
                  const { name, value } = e.target;
                  const newData = {
                    ...data,
                    [name]: value,
                  };
                  setData(newData);
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
          </div>
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => void generateContents.subtitle()}
              className="rounded-md bg-blue-500 p-2"
            >
              {generatingContent.subtitle ? (
                <LoadingSpinner className="h-5 w-5 fill-none stroke-white" />
              ) : (
                <Sparkles className="h-5 w-5 stroke-slate-200" />
              )}{" "}
            </button>
            <div className="flex-1">
              <Input
                value={data.subtitle}
                onChange={(e) => {
                  setData({ ...data, subtitle: e.target.value });
                }}
                placeholder="Article Subtitle (optional)"
                input_type="text"
                variant="TRANSPARENT"
                name="subtitle"
                fontSize="2xl"
                type="INPUT"
                required={true}
              />
            </div>
          </div>
          <div className="relative flex items-center justify-between">
            <button
              onClick={() => void generateContents.content()}
              className="absolute right-0 top-0 z-50 rounded-md bg-blue-500 p-2"
            >
              {generatingContent.content ? (
                <LoadingSpinner className="h-5 w-5 fill-none stroke-white" />
              ) : (
                <Sparkles className="h-5 w-5 stroke-slate-200" />
              )}{" "}
            </button>
            <Editor
              contentRendered={contentRendered}
              data={data}
              setData={setData}
              editData={isSuccess}
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
        requestedTags={requestedTags}
        setRequestedTags={setRequestedTags}
        prev_slug={prev_slug}
      />
    </main>
  );
};

export default NewArticleBody;
