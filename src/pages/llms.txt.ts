import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";
import { byNewest } from "../utils/markdown";

// Summary for LLM-based search (llmstxt.org): who the author is and links to every post
export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection("blog")).sort(byNewest);
  const list = posts
    .map((p) => `- [${p.data.title.trim()}](${new URL(`blog/${p.id}.md`, site)})${p.data.description.trim() ? `: ${p.data.description.trim()}` : ""}`)
    .join("\n");
  const body = `# ${SITE_TITLE}

> ${SITE_DESCRIPTION}

Igor Vieira is a software engineer from Brazil writing about product engineering, Rust, TypeScript, frontend architecture and building products with AI.

- X: https://x.com/igorprvieira
- LinkedIn: https://www.linkedin.com/in/igor-vieira-6b05a185/
- GitHub: https://github.com/igorvieira
- About: ${new URL("about/", site)}
- RSS: ${new URL("rss.xml", site)}
- Full text of every post: ${new URL("llms-full.txt", site)}

## Posts

${list}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
