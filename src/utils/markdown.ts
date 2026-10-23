import type { CollectionEntry } from "astro:content";

// Plain-markdown version of a post for LLM readers (llms-full.txt and /blog/<slug>.md)
export function postToMarkdown(post: CollectionEntry<"blog">, site: URL): string {
  const { title, description, pubDate, updatedDate } = post.data;
  const meta = [
    `Source: ${new URL(`blog/${post.id}/`, site)}`,
    `Author: Igor Vieira`,
    `Published: ${pubDate.toISOString().slice(0, 10)}`,
    updatedDate && `Updated: ${updatedDate.toISOString().slice(0, 10)}`,
  ].filter(Boolean);
  return `# ${title.trim()}\n\n${description.trim() ? `> ${description.trim()}\n\n` : ""}${meta.join("\n")}\n\n${post.body?.trim() ?? ""}\n`;
}

export const byNewest = (a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
