import type { APIRoute } from "astro";

// AI search and assistant crawlers are welcome: being quoted in answers is the point of the blog
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
];

export const GET: APIRoute = ({ site }) =>
  new Response(
    `${AI_CRAWLERS.map((ua) => `User-agent: ${ua}\nAllow: /\n`).join("\n")}\nUser-agent: *\nAllow: /\n\nSitemap: ${new URL("sitemap-index.xml", site)}\n`,
  );
