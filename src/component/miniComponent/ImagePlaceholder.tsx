import Image from "next/image";
import React, { type FC } from "react";
import Upload from "~/svgs/Upload";

interface Props {
  title?: string;
  description?: string;
  customTypes?: string;
  recommendedText?: string;
  minHeight?: string;
  file: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const ImagePlaceholder: FC<Props> = ({
  title,
  description,
  customTypes,
  recommendedText,
  minHeight = "12rem",
  file,
  handleChange,
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
          {file ? (
            <Image
              width={1600}
              height={840}
              src={file} // it will convert base64 to url
              alt="preview"
              className="h-full w-full rounded-md object-cover"
            />
          ) : (
            <>
              <div className={`flex items-center justify-center gap-2`}>
                <Upload className="h-5 w-5 fill-gray-700 dark:fill-text-secondary" />
                <span className="text-gray-700 dark:text-text-secondary">
                  Upload Image
                </span>
              </div>

              <p className="text-gray-700 dark:text-text-secondary">
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
