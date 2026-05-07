import blogsData from "../local_data/covgen-blogs.json";

export default function sitemap() {
  const baseUrl = "https://covgen-ai.vercel.app";

  const staticPages = [
    "",
    "/blogs",
    "/about",
    "/contact",
    "/pricing",
    "/privacy-policy",
    "/terms-and-conditions",
    "/refund-policy",
    "/auth",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const blogPages = blogsData.blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.date),
  }));

  return [...staticPages, ...blogPages];
}
