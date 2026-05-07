import Link from 'next/link';
import { notFound } from 'next/navigation';
import blogsData from '../../../local_data/covgen-blogs.json';

// Generate static params for all blog slugs
export async function generateStaticParams() {
  return blogsData.blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

// Dynamic SEO metadata per blog
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = blogsData.blogs.find((b) => b.slug === slug);
  if (!blog) return {};

  return {
    title: blog.seo.meta_title,
    description: blog.seo.meta_description,
    keywords: [blog.seo.focus_keyword, ...blog.seo.secondary_keywords],
    openGraph: {
      title: blog.seo.meta_title,
      description: blog.seo.meta_description,
      type: 'article',
      publishedTime: blog.date,
      authors: [blog.author],
    },
  };
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getReadingTime(content) {
  const text = content
    .map((block) => block.html)
    .join(' ')
    .replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 250));
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const blog = blogsData.blogs.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  const readTime = getReadingTime(blog.content);

  // Build table of contents from sections
  const toc = blog.content
    .filter((block) => block.type === 'section' && block.heading)
    .map((block, i) => ({
      id: `section-${i}`,
      heading: block.heading,
    }));

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hero / Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50/30 pt-32 pb-16">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-200/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-purple-200/15 blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-blue-600 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-slate-600 font-medium truncate max-w-[200px]">{blog.seo.focus_keyword}</span>
          </nav>

          {/* Tag */}
          <span className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-5">
            {blog.seo.focus_keyword}
          </span>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {blog.title}
          </h1>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-[11px] font-bold text-white uppercase">CG</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">CovGen</span>
                <span className="text-slate-300 mx-1.5">·</span>
                <span>{formatDate(blog.date)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {readTime} min read
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 mt-12">
        {/* Table of Contents */}
        {toc.length > 2 && (
          <nav className="mb-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h3
              className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Table of Contents
            </h3>
            <ol className="space-y-2">
              {toc.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="flex items-start gap-3 text-sm text-slate-500 hover:text-blue-600 transition-colors duration-200 py-1"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-md bg-blue-50 text-blue-500 text-xs font-bold flex items-center justify-center border border-blue-100">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{item.heading}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Blog Content */}
        <article className="prose-article">
          {blog.content.map((block, index) => {
            const sectionIndex = blog.content
              .slice(0, index)
              .filter((b) => b.type === 'section' && b.heading).length;

            if (block.type === 'intro') {
              return (
                <div
                  key={index}
                  className="text-lg text-slate-600 leading-relaxed mb-10 blog-content"
                  dangerouslySetInnerHTML={{ __html: block.html }}
                />
              );
            }

            if (block.type === 'section') {
              return (
                <section key={index} className="mb-10" id={`section-${sectionIndex}`}>
                  <h2
                    className="text-2xl font-bold text-slate-900 mb-4 scroll-mt-24"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {block.heading}
                  </h2>
                  <div
                    className="text-slate-600 leading-relaxed blog-content"
                    dangerouslySetInnerHTML={{ __html: block.html }}
                  />
                </section>
              );
            }

            if (block.type === 'conclusion') {
              return (
                <section
                  key={index}
                  className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100/50"
                >
                  <h2
                    className="text-xl font-bold text-slate-900 mb-4"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Wrapping Up
                  </h2>
                  <div
                    className="text-slate-600 leading-relaxed blog-content"
                    dangerouslySetInnerHTML={{ __html: block.html }}
                  />
                </section>
              );
            }

            return null;
          })}
        </article>

        {/* Tags */}
        <div className="mt-14 pt-8 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Related Topics</h4>
          <div className="flex flex-wrap gap-2">
            {blog.seo.secondary_keywords.map((kw) => (
              <span
                key={kw}
                className="px-3 py-1.5 text-xs font-medium bg-slate-50 text-slate-500 rounded-full border border-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-colors duration-200"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Card */}
        <div className="mt-14 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-8 sm:p-10 text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA3KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNnKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50" />
          <div className="relative z-10">
            <h3
              className="text-2xl font-bold text-white mb-3"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Generate Your Cover Letter Now
            </h3>
            <p className="text-blue-100 mb-6 max-w-md mx-auto">
              Paste a job description and get a tailored, ATS-optimized cover letter in under 60 seconds.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Try CovGen Free
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-10 text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to All Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
