import blogsData from "../local_data/covgen-blogs.json";

export default function sitemap() {
  const baseUrl = "https://covgen.samsdev.xyz";

  // Static public pages
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
    changeFrequency: route === "" || route === "/blogs" ? "daily" : "monthly",
    priority: route === "" ? 1 : route === "/blogs" ? 0.9 : 0.7,
  }));

  // Dynamic blog pages
  const blogPages = blogsData.blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.date),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages];
}
