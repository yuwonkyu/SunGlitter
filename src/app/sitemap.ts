import type { MetadataRoute } from "next";

const SITE_URL = "https://sun-glitter.vercel.app";

const sitemap = (): MetadataRoute.Sitemap => {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/reserve-guide`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/schedule`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
};

export default sitemap;