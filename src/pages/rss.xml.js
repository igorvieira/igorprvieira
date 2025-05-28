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
      "https://asset.cloudinary.com/dje6m1lab/3de130278029a8c490d538952cf5bcd7",
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.slug}/`,
    })),
  });
}
