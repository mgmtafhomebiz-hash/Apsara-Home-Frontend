import Link from 'next/link'

const cards = [
  {
    title: 'Product Posting',
    value: 'Products',
    description: 'Add, update, and maintain your company listings.',
    href: '/supplier/products',
  },
  {
    title: 'Company Profile',
    value: 'Supplier',
    description: 'Manage your supplier/company information and presence.',
    href: '/supplier/company',
  },
  {
    title: 'Publishing Flow',
    value: 'Ready',
    description: 'Prepare images, specs, pricing, and stock before publishing.',
    href: '/supplier/products',
  },
]

const quickActions = [
  { label: 'Add Product', href: '/supplier/products' },
  { label: 'Manage Products', href: '/supplier/products' },
  { label: 'Supplier Details', href: '/supplier/company' },
]

export default function SupplierDashboardHome() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-cyan-100 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_36%),linear-gradient(135deg,_#ecfeff,_#ffffff_55%,_#f0fdfa)] p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-700">Supplier Dashboard</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Post and manage products for your company.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This dashboard is for supplier companies that upload products, maintain inventory details,
              and keep their catalog ready for selling inside AF Home.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="inline-flex items-center rounded-2xl border border-cyan-200 bg-white px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-50"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{card.title}</p>
            <p className="mt-3 text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{card.description}</p>
            <span className="mt-4 inline-flex text-sm font-semibold text-cyan-700">
              Open
            </span>
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">What Suppliers Usually Handle</h2>
          <div className="mt-4 space-y-3">
            {[
              'Create product listings for their own company catalog',
              'Update images, dimensions, warranty, and specifications',
              'Maintain SRP, dealer price, and member price',
              'Keep stock and variant information accurate',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-[11px] font-bold text-cyan-700">
                  ✓
                </span>
                <p className="text-sm text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Recommended Flow</h2>
          <div className="mt-4 space-y-3">
            {[
              'Set up supplier/company profile',
              'Add products with images and variants',
              'Review pricing and stock before publishing',
              'Coordinate with merchant/admin side for selling workflow',
            ].map((step, index) => (
              <div key={step} className="flex gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm text-slate-600">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
