import { z } from "zod";

export const posts = {
  new: z.object({
    title: z.string(),
    subtitle: z.string(),
    content: z.string(),
    tags: z.array(z.string()),
    seoTitle: z.string(),
    seoDescription: z.string(),
    seoOgImage: z.string(),
    cover_image: z.string(),
    disableComment: z.boolean(),
  }),
};
