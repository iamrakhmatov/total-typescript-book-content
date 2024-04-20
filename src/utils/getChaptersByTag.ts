import type { CollectionEntry } from "astro:content";
import getSortedChapters from "./getSortedChapters";
import { slugifyAll } from "./slugify";

const getChaptersByTag = (
  chapters: CollectionEntry<"total-typescript-book">[],
  tag: string
) =>
  getSortedChapters(
    chapters.filter(post => slugifyAll(post.data.tags).includes(tag))
  );

export default getChaptersByTag;
