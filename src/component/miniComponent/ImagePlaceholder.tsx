import Image from "next/image";
import React, { type FC } from "react";
import LoadingSpinner from "~/svgs/LoadingSpinner";
import Upload from "~/svgs/Upload";

interface Props {
  title?: string;
  description?: string;
  customTypes?: string;
  recommendedText?: string;
  minHeight?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  image?: string;
  showImage?: boolean;
  isUploading?: boolean;
}

const ImagePlaceholder: FC<Props> = ({
  title,
  description,
  customTypes,
  recommendedText,
  minHeight = "12rem",
  handleChange,
  image,
  showImage = false,
  isUploading = false,
}) => {
  return (
    <>
      <input
        type="file"
        onChange={(e) => void handleChange(e)}
        accept={customTypes}
        id="image"
        hidden
      />

      <label htmlFor="image" className="mb-6 cursor-pointer">
        {title && (
          <h1 className="mb-2 block text-base font-semibold text-gray-700 dark:text-text-secondary">
            {title}
          </h1>
        )}

        {description && (
          <p className="mb-4 text-sm text-gray-500 dark:text-text-primary">
            {description}
          </p>
        )}

        <div
          style={{
            minHeight: minHeight,
          }}
          className={`relative flex w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-lg border-2 border-dashed border-border-light bg-light-bg dark:border-border dark:bg-primary-light`}
        >
          {showImage && image && !isUploading ? (
            <Image
              width={1600}
              height={840}
              src={image} // it will convert base64 to url
              alt="preview"
              className={`${
                isUploading ? "loading" : ""
              } h-full w-full rounded-md bg-border-light object-cover dark:bg-border`}
            />
          ) : isUploading ? (
            <div className={`flex items-center justify-center gap-2`}>
              <LoadingSpinner className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-secondary" />

              <span className="text-gray-700 dark:text-text-secondary">
                Uploading
              </span>
            </div>
          ) : (
            <>
              <div className={`flex items-center justify-center gap-2`}>
                <Upload className="h-5 w-5 fill-gray-700 dark:fill-text-secondary" />
                <span className="text-gray-700 dark:text-text-secondary">
                  Upload Image
                </span>
              </div>

              <p className="text-center text-gray-700 dark:text-text-secondary">
                {recommendedText}
              </p>
            </>
          )}
        </div>
      </label>
    </>
  );
};

export default ImagePlaceholder;
