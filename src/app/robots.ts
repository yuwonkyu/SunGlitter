import type { MetadataRoute } from "next";

const SITE_URL = "https://sun-glitter.vercel.app";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/yoonseulhouse-admin-jhj", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
};

export default robots;