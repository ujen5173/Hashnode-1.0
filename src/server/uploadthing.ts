import { createUploadthing } from "uploadthing/next-legacy";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "8MB" } }).onUploadComplete(() => {
    console.log("Upload Complete");
  }),
};

export type OurFileRouter = typeof ourFileRouter;
