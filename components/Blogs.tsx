'use client';

const blogCategories = ['Design Tips', 'Small Space', 'Style Guide', 'Buying Guide', 'Home Care']

const blogPosts = [
  {
    id: 1,
    title: '7 Living Room Layouts That Make Small Spaces Look Bigger',
    excerpt: 'Simple furniture placement rules to open up your floor plan and keep movement effortless.',
    category: 'Small Space',
    readTime: '6 min read',
    date: 'March 2026',
  },
  {
    id: 2,
    title: 'How To Match Wood Tones Without Making Your Room Look Busy',
    excerpt: 'A practical color-matching approach for cabinets, tables, and accent pieces.',
    category: 'Style Guide',
    readTime: '5 min read',
    date: 'February 2026',
  },
  {
    id: 3,
    title: 'Sofa Buying Checklist: Comfort, Fabric, and Long-Term Durability',
    excerpt: 'What to check before you buy so your sofa still feels right after years of use.',
    category: 'Buying Guide',
    readTime: '8 min read',
    date: 'February 2026',
  },
  {
    id: 4,
    title: 'Bedroom Refresh In One Weekend: Lighting, Textiles, and Storage',
    excerpt: 'Quick upgrades that make your bedroom feel calmer and more functional.',
    category: 'Design Tips',
    readTime: '7 min read',
    date: 'January 2026',
  },
  {
    id: 5,
    title: 'Kitchen Counter Styling That Stays Minimal and Useful',
    excerpt: 'Keep your counters clean while still making the space warm and inviting.',
    category: 'Home Care',
    readTime: '4 min read',
    date: 'January 2026',
  },
  {
    id: 6,
    title: 'Entryway Essentials: What Actually Helps Daily Flow',
    excerpt: 'A smarter setup for shoes, bags, and keys so your home feels organized at the door.',
    category: 'Design Tips',
    readTime: '5 min read',
    date: 'December 2025',
  },
]

const Blogs = () => {
  return (
    <main className="bg-slate-50">
      <section className="container mx-auto px-4 pt-10 pb-8 sm:pt-12 sm:pb-10">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 px-5 py-8 text-white sm:px-10 sm:py-12">
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-cyan-300/30 blur-2xl" />
          <div className="absolute -left-10 -bottom-12 h-48 w-48 rounded-full bg-orange-300/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-cyan-100">
              AF Home Journal
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
              Modern home ideas, made practical for real spaces.
            </h1>
            <p className="mt-3 text-sm text-slate-200 sm:text-base">
              Explore guides on furniture styling, layout planning, and everyday home upgrades that are easy to apply.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-6">
        <div className="flex flex-wrap gap-2">
          {blogCategories.map((category) => (
            <button
              key={category}
              type="button"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-cyan-500 hover:text-cyan-700"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-14">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <article
              key={post.id}
              className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
            >
              <div className={`h-40 w-full bg-gradient-to-br ${index % 3 === 0 ? 'from-orange-100 to-rose-100' : index % 3 === 1 ? 'from-cyan-100 to-blue-100' : 'from-emerald-100 to-lime-100'} sm:h-44`} />
              <div className="p-5">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-cyan-700">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <span>{post.date}</span>
                  <button type="button" className="font-semibold text-cyan-700 hover:text-cyan-800">
                    Read article
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Get fresh ideas every week</h3>
            <p className="mt-1 text-sm text-slate-600">New blog updates on home styling, shopping tips, and space planning.</p>
          </div>
          <button
            type="button"
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 sm:mt-0 sm:w-auto"
          >
            Subscribe
          </button>
        </div>
      </section>
    </main>
  )
}

export default Blogs
