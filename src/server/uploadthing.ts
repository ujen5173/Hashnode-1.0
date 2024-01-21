import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "8MB" } }).onUploadComplete(() => {
    console.log("Upload Complete");
  }),
};

export type OurFileRouter = typeof ourFileRouter;
