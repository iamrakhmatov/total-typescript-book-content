import type { CollectionEntry } from "astro:content";
import chapterFilter from "./chaptersFilter";

type Collection = CollectionEntry<"total-typescript-book">;
type SortBy = Extract<
  keyof Collection["data"],
  "chapterNumber" | "modDatetime"
>;
const getSortedChapters = (
  chapters: Collection[],
  sortBy: SortBy = "chapterNumber"
) => {
  return chapters.filter(chapterFilter).sort((a, b) => {
    if (sortBy === "modDatetime") {
      return (
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
      );
    } else {
      return a.data.chapterNumber - b.data.chapterNumber;
    }
  });
};

export default getSortedChapters;
