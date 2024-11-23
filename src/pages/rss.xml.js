import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_DESCRIPTION } from "../consts";

export async function get(context) {
  const posts = await getCollection("blog");
  return rss({
    title: "🍋 Igor Vieira",
    description: `${SITE_DESCRIPTION}`,
    site: context.site,
    image:
      "https://pbs.twimg.com/profile_images/1849870538954637314/1TNGSEAI_400x400.png",
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.slug}/`,
    })),
  });
}
