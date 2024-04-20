import { SITE } from "@config";
import { defineCollection, z } from "astro:content";

const totolTypeScriptBook = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      bookAuthor: z.string().default(SITE.bookAuthor),
      developer: z.string().default(SITE.developer),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
    }),
});

export const collections = { totolTypeScriptBook };
