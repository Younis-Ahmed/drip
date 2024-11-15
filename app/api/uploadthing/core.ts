import { createUploadthing, type FileRouter } from 'uploadthing/next';
// import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatarUploader: f({ image: { maxFileSize: '2MB' } })
    // This code runs on your server before upload
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .onUploadComplete(async ({ metadata, file }) => {
      //   // This code RUNS ON YOUR SERVER after upload
      //   console.log("Upload complete for userId:", metadata.userId);
      //   console.log("file url", file.url);
      //   // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      //   return { uploadedBy: metadata.userId };
    }),
  variantUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 10 } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log(file);
      console.log(metadata);
    },
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
