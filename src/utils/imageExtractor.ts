/**
 * Extracts the first image from markdown content
 * Supports both markdown syntax ![alt](url) and HTML <img> tags
 */
export function extractFirstImage(markdown: string): string | null {
  // Try to find markdown image syntax first: ![alt](url)
  const markdownImageRegex = /!\[.*?\]\((.*?)\)/;
  const markdownMatch = markdown.match(markdownImageRegex);

  if (markdownMatch && markdownMatch[1]) {
    return markdownMatch[1];
  }

  // Try to find HTML img tag: <img src="url" />
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/i;
  const htmlMatch = markdown.match(htmlImageRegex);

  if (htmlMatch && htmlMatch[1]) {
    return htmlMatch[1];
  }

  return null;
}

/**
 * Gets the hero image for a post
 * Priority: heroImage from frontmatter > first image from content > placeholder
 */
export function getPostHeroImage(
  heroImage: string | undefined,
  content: string,
  placeholder: string = "/placeholder-blog.png"
): string {
  if (heroImage) {
    return heroImage;
  }

  const extractedImage = extractFirstImage(content);
  if (extractedImage) {
    return extractedImage;
  }

  return placeholder;
}

/**
 * Estimates reading time based on word count
 * Average reading speed: 200 words per minute
 */
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

/**
 * Generates a proper absolute URL for images
 */
export function getAbsoluteImageUrl(imageUrl: string, siteUrl: string): string {
  // If already absolute URL, return as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // If relative URL, make it absolute
  const baseUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  const imagePath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;

  return `${baseUrl}${imagePath}`;
}
