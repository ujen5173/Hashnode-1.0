import { useRouter } from 'next/router';
import React, { useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import slugify from "slugify";
import Editor from "~/component/editor";
import { Input } from "~/component/miniComponent";
import { NewArticleModal } from '~/component/popup';
import { type DefaultEditorContent } from "~/types";
import { api } from "~/utils/api";
import { slugSetting } from "~/utils/constants";
import { convertToHTML } from "~/utils/miniFunctions";

export interface ArticleData {
  title: string;
  subtitle: string;
  content: DefaultEditorContent;
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
}

const NewArticleBody: FC<{
  publishModal: boolean;
  setPublishModal: React.Dispatch<React.SetStateAction<boolean>>;
  publishing: boolean;
  setPublishing: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  setPublishModal,
  publishModal,
  publishing,
  setPublishing,
}) => {
    const router = useRouter();

    const [hydrate, setHydrate] = useState(false);
    const [edit, setEdit] = useState(false);
    const [query, setQuery] = useState("");

    const [data, setData] = useState<ArticleData>(defaultArticleData);

    const { data: editData, isSuccess, error } = api.posts.getArticleToEdit.useQuery(
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
        setData({ ...rest, subtitle: subtitle || "", content: convertToHTML(editData.content) as DefaultEditorContent });
      }
    }, [error, editData]);

    const [requestedTags, setRequestedTags] = useState<string[]>([]);

    const { data: tagsData } = api.tags.getSingle.useQuery({
      slug: requestedTags,
    }, {
      enabled: !!requestedTags.length,
      retry: 0,
      refetchOnWindowFocus: false,
    });

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
    return (
      <main className="relative min-h-[100dvh] w-full overflow-hidden border-b border-border-light bg-white dark:border-border dark:bg-primary">
        <div className="mx-auto w-full max-w-[1000px] px-4 py-6">
          {/* <div className="relative mb-5 flex items-center gap-2">
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
                          ...data, cover_image: uploaded[0]?.fileUrl || null,
                          cover_image_Key: uploaded[0]?.fileKey || null,
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
                onClick={() => void deleteImage("cover_image_Key")}
                className="absolute right-4 top-4 rounded-md border border-border-light bg-white bg-opacity-60 px-3 py-2"
              >
                <X className="h-5 w-5 stroke-gray-700 fill-none" />
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
          )} */}

          <section className="px-2">
            <div className="relative">
              <Input
                value={data.title}
                onChange={(e) => {
                  const { name, value } = e.target;
                  const newData = {
                    ...data, [name]: value,
                    slug: slugify(value, slugSetting)
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

            <div className="relative">
              <Editor data={data} setData={setData} editData={isSuccess} />
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
        />
      </main>
    );
  };

export default NewArticleBody;
