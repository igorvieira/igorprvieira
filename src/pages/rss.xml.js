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
      "https://res.cloudinary.com/dje6m1lab/image/upload/fl_preserve_transparency/v1748400386/LGqg2kBR_400x400_dnljod.jpg",
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.slug}/`,
    })),
  });
}
