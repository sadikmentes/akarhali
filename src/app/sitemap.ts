import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/constants/site";
import { NAV_ITEMS } from "@/constants/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = NAV_ITEMS.map((item) => item.href);

  return routes.flatMap((route) => [
    {
      url: `${SITE_CONFIG.url}${route === "/" ? "" : route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1 : 0.7,
      alternates: {
        languages: {
          tr: `${SITE_CONFIG.url}${route === "/" ? "" : route}`,
        },
      },
    },
  ]);
}
