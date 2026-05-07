import Link from 'next/link';
import blogsData from '../../local_data/covgen-blogs.json';

export const metadata = {
  title: 'Blog — Cover Letter Tips, Guides & Career Advice | CovGen',
  description:
    'Read expert guides on writing cover letters, beating ATS systems, and landing interviews faster. CovGen blog — career advice backed by AI.',
  keywords: [
    'cover letter blog',
    'career advice',
    'cover letter tips 2026',
    'ATS cover letter guide',
    'CovGen blog',
  ],
  openGraph: {
    title: 'CovGen Blog — Cover Letter Tips & Career Guides',
    description:
      'Expert guides on writing cover letters that get you hired. Powered by CovGen AI.',
    type: 'website',
  },
};

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

function getExcerpt(content) {
  const intro = content.find((block) => block.type === 'intro');
  if (!intro) return '';
  const text = intro.html.replace(/<[^>]*>/g, '');
  return text.length > 180 ? text.substring(0, 180) + '…' : text;
}

const categoryColors = [
  { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
  { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
  { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
];

export default function BlogsPage() {
  const blogs = blogsData.blogs;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-32 pb-20">
        {/* Decorative Orbs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-200/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-purple-200/20 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-sm font-medium text-blue-600 mb-6">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            CovGen Blog
          </span>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Cover Letter Tips &{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Career Guides
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Expert advice on writing cover letters that get you hired — backed by AI insights and real hiring data.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-6xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => {
            const colors = categoryColors[index % categoryColors.length];
            const readTime = getReadingTime(blog.content);
            const excerpt = getExcerpt(blog.content);

            return (
              <Link
                href={`/blogs/${blog.slug}`}
                key={blog.slug}
                className="group block"
              >
                <article className="h-full bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.12)] transition-all duration-500 overflow-hidden hover:-translate-y-1">
                  {/* Card Top Gradient Strip */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${
                    index === 0
                      ? 'from-blue-500 to-cyan-400'
                      : index === 1
                      ? 'from-purple-500 to-pink-400'
                      : 'from-emerald-500 to-teal-400'
                  }`} />

                  <div className="p-7">
                    {/* Tag */}
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text} border ${colors.border} mb-4`}
                    >
                      {blog.seo.focus_keyword}
                    </span>

                    {/* Title */}
                    <h2
                      className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors duration-300 line-clamp-2"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {blog.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-3">
                      {excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white uppercase">CG</span>
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          {formatDate(blog.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {readTime} min read
                      </div>
                    </div>

                    {/* Read More Arrow */}
                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                      Read Article
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 mt-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 p-10 sm:p-14 text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA3KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNnKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50" />
          <div className="relative z-10">
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Ready to Write Your Cover Letter?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Stop spending hours on cover letters. Let CovGen&apos;s AI generate a tailored, ATS-optimized letter in seconds.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base"
            >
              Try CovGen Free
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
