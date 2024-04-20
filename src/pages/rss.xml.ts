import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import getSortedChapters from "@utils/getSortedChapters";
import { SITE } from "@config";

export async function GET() {
  const posts = await getCollection("total-typescript-book");
  const sortedPosts = getSortedChapters(posts);
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(({ data, slug }) => ({
      link: `posts/${slug}/`,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
