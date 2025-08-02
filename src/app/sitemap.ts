import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://smtp.cban.top";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  ];

  // Provider pages
  const providers = ["gmail", "outlook", "yahoo", "sendgrid", "mailgun"];
  const providerPages = providers.map((provider) => ({
    url: `${baseUrl}/smtp-test/${provider}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Guide pages
  const guides = [
    "smtp-authentication",
    "smtp-ports",
    "smtp-encryption",
    "troubleshooting",
  ];
  const guidePages = guides.map((guide) => ({
    url: `${baseUrl}/smtp-guide/${guide}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...providerPages, ...guidePages];
}
