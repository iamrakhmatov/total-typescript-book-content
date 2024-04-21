import { AUTHOR, SITE } from "@config";
import { defineCollection, z } from "astro:content";

const totalTypeScriptBook = defineCollection({
  type: "content",
  schema: z.object({
    bookAuthor: z.string().default(AUTHOR.name),
    developer: z.string().default(SITE.developer),
    pubDatetime: z.date(),
    modDatetime: z.date().optional().nullable(),
    title: z.string(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).default(["others"]),
    description: z.string(),
    canonicalURL: z.string().optional(),
    chapterNumber: z.number(),
  }),
});

export const collections = { ["total-typescript-book"]: totalTypeScriptBook };
