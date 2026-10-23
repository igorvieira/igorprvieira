import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";
import { postToMarkdown, byNewest } from "../utils/markdown";

// Every post in full, for LLMs that ingest a whole site at once (llmstxt.org)
export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection("blog")).sort(byNewest);
  const body = `# ${SITE_TITLE}\n\n> ${SITE_DESCRIPTION}\n\n${posts.map((p) => postToMarkdown(p, site!)).join("\n---\n\n")}`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
