import type { CollectionEntry } from "astro:content";
import chapterFilter from "./chaptersFilter";

const getSortedChapters = (
  chapters: CollectionEntry<"total-typescript-book">[]
) => {
  return chapters
    .filter(chapterFilter)
    .sort((a, b) => a.data.chapterNumber - b.data.chapterNumber);
};

export default getSortedChapters;
