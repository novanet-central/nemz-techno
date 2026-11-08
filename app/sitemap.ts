import type { MetadataRoute } from "next";
import { getPublishedBlogPostPreviews } from "@/app/lib/blog";
import { getBlogPostPath } from "@/app/lib/blog-shared";
import { absoluteUrl } from "@/app/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const analyses = await getPublishedBlogPostPreviews();
  const latestPublication = analyses[0]?.updatedAt;

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latestPublication,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/elemzesek"),
      lastModified: latestPublication,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/rolunk"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...analyses.map((analysis) => ({
      url: absoluteUrl(getBlogPostPath(analysis)),
      lastModified: analysis.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
