import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { postToMarkdown } from "../../utils/markdown";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export const GET: APIRoute<{ post: CollectionEntry<"blog"> }> = ({ props, site }) =>
  new Response(postToMarkdown(props.post, site!), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
