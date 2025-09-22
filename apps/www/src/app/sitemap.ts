import type { MetadataRoute } from "next";
import { createClient } from "./lib/supabase/server";
import { blogPosts } from "./data/blog-posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  // Fetch listings with error handling
  let { data: listings, error } = await supabase
    .from("listings")
    .select("short_id, updated_at")
    .order("updated_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching listings for sitemap:", error);
    listings = [];
  }

  const staticPages = [
    {
      url: "https://www.manazl.com",
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: "https://www.manazl.com/about",
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: "https://www.manazl.com/contact",
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    
    {
      url: "https://www.manazl.com/blog",
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];

  const listingPages = listings?.map((listing) => ({
    url: `https://www.manazl.com/listing/${listing.short_id}`,
    lastModified: listing.updated_at || new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogPostPages = blogPosts.map((post) => ({
    url: `https://www.manazl.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...(listingPages || []),
    ...blogPostPages,
  ];
}
