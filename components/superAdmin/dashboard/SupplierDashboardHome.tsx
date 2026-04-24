'use client'

import type { ElementType } from 'react'
import Link from 'next/link'
import { useMemo } from 'react'
import { useSession } from 'next-auth/react'
import {
  ArrowRight,
  BadgeCheck,
  Box,
  Building2,
  Clock3,
  Layers3,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Users,
} from 'lucide-react'
import { Product, useGetProductsQuery } from '@/store/api/productsApi'
import { useGetPublicProductBrandsQuery } from '@/store/api/productBrandsApi'
import { useGetSupplierCategoriesQuery, useGetSupplierUsersQuery, useGetSuppliersQuery } from '@/store/api/suppliersApi'

export default function SupplierDashboardHome() {
  const { data: session, status } = useSession()
  const supplierId = Number(session?.user?.supplierId ?? 0)
  const supplierName = session?.user?.supplierName || session?.user?.name || 'Supplier'
  const isMainSupplier = Boolean(session?.user?.isMainSupplier)

  const { data: suppliersData } = useGetSuppliersQuery(undefined, { skip: status !== 'authenticated' })
  const fallbackSupplier = useMemo(() => (suppliersData?.suppliers ?? [])[0], [suppliersData?.suppliers])
  const effectiveSupplierId = supplierId > 0 ? supplierId : Number(fallbackSupplier?.id ?? 0)
  const skip = status !== 'authenticated' || effectiveSupplierId <= 0

  const supplier = useMemo(
    () => (suppliersData?.suppliers ?? []).find((item) => item.id === effectiveSupplierId),
    [effectiveSupplierId, suppliersData?.suppliers],
  )

  const { data: brandsData } = useGetPublicProductBrandsQuery()
  const brandType = useMemo(() => {
    const brands = brandsData?.brands ?? []
    if (brands.length === 0) return 0

    const candidates = [supplierName, supplier?.company, supplier?.name]
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => value.toLowerCase().replace(/[^a-z0-9]/g, ''))

    if (candidates.length === 0) return 0

    const exactMatch = brands.find((brand) => {
      const brandKey = String(brand.name ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
      return brandKey !== '' && candidates.some((candidate) => candidate === brandKey)
    })

    if (exactMatch?.id) {
      return Number(exactMatch.id)
    }

    let bestId = 0
    let bestScore = 0
    let bestLen = 0

    brands.forEach((brand) => {
      const brandKey = String(brand.name ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
      if (!brandKey) return

      candidates.forEach((candidate) => {
        if (!candidate) return

        let score = 0
        if (candidate === brandKey) score = 3
        else if (candidate.includes(brandKey)) score = 2
        else if (brandKey.includes(candidate)) score = 1

        if (score > 0) {
          const len = brandKey.length
          if (score > bestScore || (score === bestScore && len > bestLen)) {
            bestScore = score
            bestLen = len
            bestId = Number(brand.id ?? 0)
          }
        }
      })
    })

    return bestId
  }, [brandsData?.brands, supplier?.company, supplier?.name, supplierName])

  const productQueryBase = useMemo(
    () => ({
      supplierId: effectiveSupplierId,
      ...(brandType > 0 ? { brandType } : {}),
    }),
    [brandType, effectiveSupplierId],
  )

  const { data: productsData } = useGetProductsQuery({ ...productQueryBase, perPage: 5 }, { skip, refetchOnMountOrArgChange: true })
  const { data: activeProductsData } = useGetProductsQuery(
    { ...productQueryBase, perPage: 1, status: '1' },
    { skip, refetchOnMountOrArgChange: true },
  )
  const { data: inactiveProductsData } = useGetProductsQuery(
    { ...productQueryBase, perPage: 1, status: '0' },
    { skip, refetchOnMountOrArgChange: true },
  )
  const { data: inventoryData } = useGetProductsQuery({ ...productQueryBase, perPage: 100 }, { skip, refetchOnMountOrArgChange: true })

  const brandOnlySkip = skip || brandType <= 0
  const { data: brandProductsData } = useGetProductsQuery({ brandType, perPage: 5 }, { skip: brandOnlySkip, refetchOnMountOrArgChange: true })
  const { data: brandActiveProductsData } = useGetProductsQuery(
    { brandType, perPage: 1, status: '1' },
    { skip: brandOnlySkip, refetchOnMountOrArgChange: true },
  )
  const { data: brandInactiveProductsData } = useGetProductsQuery(
    { brandType, perPage: 1, status: '0' },
    { skip: brandOnlySkip, refetchOnMountOrArgChange: true },
  )
  const { data: brandInventoryData } = useGetProductsQuery(
    { brandType, perPage: 100 },
    { skip: brandOnlySkip, refetchOnMountOrArgChange: true },
  )
  const { data: supplierCategoriesData } = useGetSupplierCategoriesQuery(effectiveSupplierId, { skip })
  const { data: supplierUsersData } = useGetSupplierUsersQuery(effectiveSupplierId, { skip })

  const useBrandFallback = useMemo(() => {
    if (brandType <= 0) return false
    const primaryTotal = productsData?.meta?.total ?? 0
    return primaryTotal <= 0
  }, [brandType, productsData?.meta?.total])

  const effectiveProductsData = useBrandFallback ? brandProductsData : productsData
  const effectiveActiveProductsData = useBrandFallback ? brandActiveProductsData : activeProductsData
  const effectiveInactiveProductsData = useBrandFallback ? brandInactiveProductsData : inactiveProductsData
  const effectiveInventoryData = useBrandFallback ? brandInventoryData : inventoryData

  const recentProducts = useMemo(() => effectiveProductsData?.products ?? [], [effectiveProductsData?.products])
  const lowStockCount = useMemo(
    () => (effectiveInventoryData?.products ?? []).filter((product) => Number(product.qty ?? 0) > 0 && Number(product.qty ?? 0) <= 5).length,
    [effectiveInventoryData?.products],
  )
  const mainSupplierUser = useMemo(
    () => (supplierUsersData?.users ?? []).find((user) => user.is_main_supplier),
    [supplierUsersData?.users],
  )
  const subSupplierCount = useMemo(
    () => (supplierUsersData?.users ?? []).filter((user) => !user.is_main_supplier).length,
    [supplierUsersData?.users],
  )

  const cards = [
    {
      title: 'Total Products',
      value: String(effectiveProductsData?.meta?.total ?? 0),
      description: 'Current catalog items under your supplier account.',
      href: '/supplier/products',
      icon: Layers3,
      accent: 'cyan',
    },
    {
      title: 'Active Products',
      value: String(effectiveActiveProductsData?.meta?.total ?? 0),
      description: 'Products currently active in your supplier catalog.',
      href: '/supplier/products',
      icon: TrendingUp,
      accent: 'emerald',
    },
    {
      title: 'Inactive Products',
      value: String(effectiveInactiveProductsData?.meta?.total ?? 0),
      description: 'Products that still need attention before going live.',
      href: '/supplier/products',
      icon: Clock3,
      accent: 'slate',
    },
    {
      title: 'Low Stock',
      value: String(lowStockCount),
      description: 'Products with quantity from 1 to 5 in the current supplier catalog.',
      href: '/supplier/products',
      icon: Box,
      accent: 'amber',
    },
    {
      title: 'Allowed Categories',
      value: String(supplierCategoriesData?.categories?.length ?? 0),
      description: 'Categories you are allowed to use for product posting.',
      href: '/supplier/categories',
      icon: ShieldCheck,
      accent: 'violet',
    },
    {
      title: 'Supplier Users',
      value: String(supplierUsersData?.users?.length ?? 0),
      description: 'Separate supplier portal logins currently active for your team.',
      href: '/supplier/users',
      icon: Users,
      accent: 'indigo',
    },
  ] as const

  const quickActions = [
    { label: 'Add Product', href: '/supplier/products', icon: Layers3 },
    { label: 'View Categories', href: '/supplier/categories', icon: ShieldCheck },
    { label: 'Manage Users', href: '/supplier/users', icon: Users },
    { label: 'Company Profile', href: '/supplier/company', icon: Building2 },
  ] as const

  const categoryPreview = supplierCategoriesData?.categories.slice(0, 6) ?? []

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.86),rgba(239,248,255,0.96)_38%,rgba(232,250,247,0.88))] p-6 shadow-[0_30px_80px_-40px_rgba(14,116,144,0.35)] dark:border-white/8 dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.10),transparent_28%),linear-gradient(135deg,rgba(7,14,25,0.92),rgba(10,19,34,0.94)_48%,rgba(9,28,31,0.9))]">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-500/10" />
          <div className="absolute bottom-0 right-8 h-56 w-56 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-500/10" />
        </div>

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/70 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-700 dark:border-cyan-400/20 dark:bg-white/[0.05] dark:text-cyan-300">
              <BadgeCheck className="h-3.5 w-3.5" />
              Supplier Dashboard
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-4xl">
              Welcome back, {supplierName}.
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-cyan-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-cyan-700 dark:border-cyan-400/20 dark:bg-white/[0.06] dark:text-cyan-200">
                {isMainSupplier ? 'Main Supplier' : 'Sub Supplier'}
              </span>
              <span className="inline-flex rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">
                {supplier?.status === 1 ? 'Company Active' : 'Company Inactive'}
              </span>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Use this workspace to manage your company catalog, control supplier team access,
              and review the categories assigned to your products.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon

              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group inline-flex min-w-[180px] items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50/80 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-100 dark:hover:border-cyan-400/20 dark:hover:bg-cyan-500/10"
                >
                  <span className="inline-flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    {action.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-cyan-700 dark:group-hover:text-cyan-300" />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <MetricCard
            key={card.title}
            title={card.title}
            value={card.value}
            description={card.description}
            href={card.href}
            icon={card.icon}
            accent={card.accent}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard
          title="Supplier Snapshot"
          subtitle="Core company details and workspace ownership."
          icon={Building2}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <SnapshotCard label="Company" value={supplier?.company || supplier?.name || 'Not linked'} icon={Building2} />
            <SnapshotCard label="Contact" value={supplier?.contact || 'Not provided'} icon={UserRound} />
            <SnapshotCard label="Email" value={supplier?.email || 'Not provided'} icon={BadgeCheck} />
            <SnapshotCard label="Status" value={supplier?.status === 1 ? 'Active' : 'Inactive'} icon={ShieldCheck} />
            <SnapshotCard label="Main Supplier" value={mainSupplierUser?.fullname || mainSupplierUser?.username || 'Not assigned'} icon={Users} />
            <SnapshotCard label="Sub Suppliers" value={String(subSupplierCount)} icon={Layers3} />
          </div>
        </SurfaceCard>

        <SurfaceCard
          title="Quick Guidance"
          subtitle="Keep your team aligned before posting new items."
          badge={isMainSupplier ? 'Owner Access' : 'Staff Access'}
        >
          <div className="space-y-3">
            {[
              isMainSupplier
                ? 'Invite separate supplier users instead of sharing one supplier login'
                : 'Only the main supplier can invite new supplier users for this company',
              'Review your allowed categories before posting products',
              'Check low stock items so your catalog stays accurate',
              'Keep company profile and supplier contacts up to date',
            ].map((step, index) => (
              <div key={step} className="flex gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-white/8 dark:bg-white/[0.03]">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-xs font-bold text-white dark:bg-cyan-500/15 dark:text-cyan-200">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm text-slate-600 dark:text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard
          title="Recent Products"
          subtitle="Latest products from your supplier catalog."
          actionHref="/supplier/products"
          actionLabel="Manage"
        >
          {recentProducts.length === 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300">
              No products yet. Start by adding your first supplier product.
            </div>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <RecentProductRow key={product.id} product={product} />
              ))}
            </div>
          )}
        </SurfaceCard>

        <SurfaceCard
          title="Assigned Categories"
          subtitle="Preview of categories you can use for product posting."
          actionHref="/supplier/categories"
          actionLabel="View all"
        >
          {(supplierCategoriesData?.categories?.length ?? 0) === 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300">
              No categories assigned yet. Ask the admin team to assign categories to your supplier.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {categoryPreview.map((category) => (
                  <span
                    key={category.id}
                    className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-300"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/8 dark:bg-white/[0.03]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  Category Access Rule
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Only assigned categories can be used when adding or editing supplier products.
                  If you need another category, request it from the admin team first.
                </p>
              </div>
            </div>
          )}
        </SurfaceCard>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SurfaceCard
          title="Inventory Attention"
          subtitle="Products that may need an update before customers see issues."
          actionHref="/supplier/products"
          actionLabel="Review"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <InventoryStatusCard
              label="Low Stock"
              value={String(lowStockCount)}
              tone={lowStockCount > 0 ? 'amber' : 'emerald'}
              description={lowStockCount > 0 ? 'Needs restock or quantity review' : 'No low stock alerts right now'}
            />
            <InventoryStatusCard
              label="Inactive Products"
              value={String(effectiveInactiveProductsData?.meta?.total ?? 0)}
              tone={(effectiveInactiveProductsData?.meta?.total ?? 0) > 0 ? 'slate' : 'emerald'}
              description={
                (effectiveInactiveProductsData?.meta?.total ?? 0) > 0
                  ? 'Products not currently live'
                  : 'All tracked products are active'
              }
            />
          </div>
        </SurfaceCard>

        <SurfaceCard
          title="Team Access"
          subtitle="Quick view of who owns and uses this supplier workspace."
          actionHref="/supplier/users"
          actionLabel="Open users"
        >
          <div className="space-y-3">
            <TeamAccessRow
              label="Main Supplier"
              value={mainSupplierUser?.fullname || mainSupplierUser?.username || supplierName}
              badge="Owner"
            />
            <TeamAccessRow
              label="Sub Suppliers"
              value={String(subSupplierCount)}
              badge={subSupplierCount > 0 ? 'Active' : 'None'}
            />
            <TeamAccessRow
              label="Your Access"
              value={isMainSupplier ? 'Can manage supplier users' : 'Product and company access only'}
              badge={isMainSupplier ? 'Main' : 'Sub'}
            />
          </div>
        </SurfaceCard>
      </section>
    </div>
  )
}

function SurfaceCard({
  title,
  subtitle,
  icon: Icon,
  badge,
  actionHref,
  actionLabel,
  children,
}: {
  title: string
  subtitle: string
  icon?: ElementType
  badge?: string
  actionHref?: string
  actionLabel?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] dark:border-white/8 dark:bg-slate-900/70 dark:shadow-black/20">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon ? (
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
              <Icon className="h-5 w-5" />
            </span>
          ) : null}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
        </div>

        {badge ? (
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
            {badge}
          </span>
        ) : null}

        {actionHref && actionLabel ? (
          <Link href={actionHref} className="text-sm font-semibold text-cyan-700 hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200">
            {actionLabel}
          </Link>
        ) : null}
      </div>

      {children}
    </div>
  )
}

function MetricCard({
  title,
  value,
  description,
  href,
  icon: Icon,
  accent,
}: {
  title: string
  value: string
  description: string
  href: string
  icon: ElementType
  accent: 'cyan' | 'emerald' | 'slate' | 'amber' | 'violet' | 'indigo'
}) {
  const accentClasses = {
    cyan: 'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-300',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300',
    slate: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200',
    amber: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300',
    violet: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-300',
    indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-300',
  }[accent]

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] transition hover:-translate-y-1 hover:border-cyan-200 dark:border-white/8 dark:bg-slate-900/70 dark:shadow-black/20"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(6,182,212,0.7),rgba(59,130,246,0.7),rgba(16,185,129,0.6))] opacity-70" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
        <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${accentClasses}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 dark:text-cyan-300">
        Open <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

function SnapshotCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: ElementType
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/8 dark:bg-white/[0.03]">
      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
        <Icon className="h-4 w-4" />
        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  )
}

function InventoryStatusCard({
  label,
  value,
  description,
  tone,
}: {
  label: string
  value: string
  description: string
  tone: 'amber' | 'emerald' | 'slate'
}) {
  const toneClasses = {
    amber: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300',
    slate: 'border-slate-200 bg-slate-50 text-slate-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200',
  }[tone]

  return (
    <div className={`rounded-2xl border p-4 ${toneClasses}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</p>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="mt-2 text-sm leading-6 opacity-90">{description}</p>
    </div>
  )
}

function TeamAccessRow({ label, value, badge }: { label: string; value: string; badge: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/8 dark:bg-white/[0.03]">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{label}</p>
        <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</p>
      </div>
      <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-300">
        {badge}
      </span>
    </div>
  )
}

function RecentProductRow({ product }: { product: Product }) {
  const updatedLabel = formatProductDate(product.updatedAt || product.createdAt)

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-cyan-200 dark:border-white/8 dark:bg-white/[0.03] dark:hover:border-cyan-400/20">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{product.name}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">SKU: {product.sku || 'No SKU'}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Qty: {Number(product.qty ?? 0)}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Updated: {updatedLabel}</p>
        </div>
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
            Number(product.status) === 1 || Number(product.status) === 2
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300'
              : 'border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300'
          }`}
        >
          {Number(product.status) === 1 || Number(product.status) === 2 ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  )
}

function formatProductDate(value: string | null) {
  if (!value) {
    return 'Not available'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return 'Not available'
  }

  return parsed.toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
