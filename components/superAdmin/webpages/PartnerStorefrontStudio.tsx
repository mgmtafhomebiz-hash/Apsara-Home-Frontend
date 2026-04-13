'use client'

import type { ReactNode } from 'react'
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { showErrorToast, showSuccessToast } from '@/libs/toast'
import { getPartnerStorefrontConfig, parseIdList } from '@/libs/partnerStorefront'
import { useGetCategoriesQuery } from '@/store/api/categoriesApi'
import { useGetProductsQuery } from '@/store/api/productsApi'
import {
  useCreateAdminWebPageItemMutation,
  useGetAdminWebPageItemsQuery,
  useUpdateAdminWebPageItemMutation,
  type WebPageItem,
} from '@/store/api/webPagesApi'

type DraftState = {
  id?: number
  slug: string
  displayName: string
  heroTitle: string
  heroSubtitle: string
  logoUrl: string
  themeColor: string
  accentColor: string
  notificationEmail: string
  allowedCategoryIds: number[]
  featuredProductIds: number[]
  enableAiSupport: boolean
}

const emptyDraft: DraftState = {
  slug: '',
  displayName: '',
  heroTitle: '',
  heroSubtitle: '',
  logoUrl: '',
  themeColor: '#0f766e',
  accentColor: '#f97316',
  notificationEmail: '',
  allowedCategoryIds: [],
  featuredProductIds: [],
  enableAiSupport: false,
}

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const toDraft = (item?: WebPageItem): DraftState => {
  const config = getPartnerStorefrontConfig(item)
  if (!config || !item) return emptyDraft
  return {
    id: item.id,
    slug: config.slug,
    displayName: config.displayName,
    heroTitle: config.heroTitle,
    heroSubtitle: config.heroSubtitle,
    logoUrl: config.logoUrl ?? '',
    themeColor: config.themeColor,
    accentColor: config.accentColor,
    notificationEmail: config.notificationEmail,
    allowedCategoryIds: config.allowedCategoryIds,
    featuredProductIds: config.featuredProductIds,
    enableAiSupport: config.enableAiSupport,
  }
}

export default function PartnerStorefrontStudio() {
  const [selectedId, setSelectedId] = useState<number | 'new'>('new')
  const [draft, setDraft] = useState<DraftState>(emptyDraft)
  const { data: session } = useSession()
  const sessionRole = String(session?.user?.role ?? '').toLowerCase()
  const sessionUserLevelId = Number((session?.user as { userLevelId?: number } | undefined)?.userLevelId ?? 0)
  const storefrontIds = (session?.user as { storefrontIds?: number[] } | undefined)?.storefrontIds ?? []
  const isPartnerScoped = sessionUserLevelId === 4 || sessionRole === 'web_content'
  const canManageAiSupport = sessionUserLevelId === 1 || sessionUserLevelId === 2 || sessionRole === 'super_admin' || sessionRole === 'admin'
  const allowedStorefrontIds = useMemo(
    () => (isPartnerScoped ? storefrontIds.filter((id) => Number.isInteger(id) && id > 0) : []),
    [isPartnerScoped, storefrontIds],
  )
  const { data, isLoading, isError } = useGetAdminWebPageItemsQuery({
    type: 'partner-storefront',
    page: 1,
    perPage: 100,
    status: 'all',
  })
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const logoInputRef = useRef<HTMLInputElement | null>(null)
  const { data: categoriesData } = useGetCategoriesQuery({ per_page: 200 })
  const { data: productsData } = useGetProductsQuery({ perPage: 100, status: '1' })
  const [createItem, { isLoading: isCreating }] = useCreateAdminWebPageItemMutation()
  const [updateItem, { isLoading: isUpdating }] = useUpdateAdminWebPageItemMutation()

  const storefronts = useMemo(() => {
    const items = (data?.items ?? [])
      .map((item) => ({
        item,
        config: getPartnerStorefrontConfig(item),
      }))
      .filter((entry): entry is { item: WebPageItem; config: NonNullable<ReturnType<typeof getPartnerStorefrontConfig>> } => Boolean(entry.config))

    const scoped = isPartnerScoped
      ? items.filter((entry) => allowedStorefrontIds.includes(entry.item.id))
      : items

    return scoped.sort((a, b) => a.config.displayName.localeCompare(b.config.displayName))
  }, [data?.items, allowedStorefrontIds, isPartnerScoped])

  const categories = categoriesData?.categories ?? []
  const products = productsData?.products ?? []

  const selectStorefront = (item?: WebPageItem) => {
    if (!item) {
      setSelectedId('new')
      setDraft(emptyDraft)
      if (logoInputRef.current) {
        logoInputRef.current.value = ''
      }
      return
    }

    setSelectedId(item.id)
    setDraft(toDraft(item))
    if (logoInputRef.current) {
      logoInputRef.current.value = ''
    }
  }

  const toggleCategory = (categoryId: number) => {
    setDraft((current) => ({
      ...current,
      allowedCategoryIds: current.allowedCategoryIds.includes(categoryId)
        ? current.allowedCategoryIds.filter((id) => id !== categoryId)
        : [...current.allowedCategoryIds, categoryId],
    }))
  }

  const handleLogoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const payload = new FormData()
    payload.append('file', file)
    payload.append('folder', 'partner-storefronts')

    setIsUploadingLogo(true)

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: payload,
      })

      const result = (await response.json()) as { url?: string; error?: string }

      if (!response.ok || !result.url) {
        throw new Error(result.error || 'Failed to upload logo.')
      }

      const nextLogoUrl = result.url ?? ''
      const nextDraft = { ...draft, logoUrl: nextLogoUrl }

      setDraft((current) => ({ ...current, logoUrl: nextLogoUrl || current.logoUrl }))
      showSuccessToast('Logo uploaded successfully.')

      if (nextDraft.id) {
        if (isPartnerScoped && !allowedStorefrontIds.includes(nextDraft.id)) {
          showErrorToast('You do not have access to edit this storefront.')
          return
        }

        const slug = toSlug(nextDraft.slug || nextDraft.displayName)
        if (!slug) {
          showErrorToast('Add a slug or display name first.')
          return
        }

        const payload = {
          key: slug,
          title: nextDraft.displayName.trim() || slug,
          subtitle: nextDraft.heroTitle.trim() || `${nextDraft.displayName.trim() || slug} Shop`,
          body: nextDraft.heroSubtitle.trim(),
          image_url: nextDraft.logoUrl.trim() || undefined,
          is_active: true,
          payload: {
            fields: {
              slug,
              display_name: nextDraft.displayName.trim(),
              hero_title: nextDraft.heroTitle.trim(),
              hero_subtitle: nextDraft.heroSubtitle.trim(),
              logo_url: nextDraft.logoUrl.trim(),
              theme_color: nextDraft.themeColor.trim(),
              accent_color: nextDraft.accentColor.trim(),
              notification_email: nextDraft.notificationEmail.trim(),
              allowed_category_ids: nextDraft.allowedCategoryIds.join(','),
              featured_product_ids: nextDraft.featuredProductIds.join(','),
              enable_ai_support: nextDraft.enableAiSupport ? '1' : '0',
            },
          },
        }

        try {
          await updateItem({ type: 'partner-storefront', id: nextDraft.id, data: payload }).unwrap()
          showSuccessToast('Logo saved to storefront.')
        } catch (error) {
          const apiErr = error as { data?: { message?: string } }
          showErrorToast(apiErr?.data?.message || 'Failed to save logo.')
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload logo.'
      showErrorToast(message)
    } finally {
      setIsUploadingLogo(false)
      if (logoInputRef.current) {
        logoInputRef.current.value = ''
      }
    }
  }

  const saveStorefront = async () => {
    if (isPartnerScoped && !draft.id) {
      showErrorToast('You can only edit your assigned storefront.')
      return
    }

    if (isPartnerScoped && draft.id && !allowedStorefrontIds.includes(draft.id)) {
      showErrorToast('You do not have access to edit this storefront.')
      return
    }

    const slug = toSlug(draft.slug || draft.displayName)
    if (!slug) {
      showErrorToast('Add a slug or display name first.')
      return
    }

    const payload = {
      key: slug,
      title: draft.displayName.trim() || slug,
      subtitle: draft.heroTitle.trim() || `${draft.displayName.trim() || slug} Shop`,
      body: draft.heroSubtitle.trim(),
      image_url: draft.logoUrl.trim() || undefined,
      is_active: true,
      payload: {
        fields: {
          slug,
          display_name: draft.displayName.trim(),
          hero_title: draft.heroTitle.trim(),
          hero_subtitle: draft.heroSubtitle.trim(),
          logo_url: draft.logoUrl.trim(),
          theme_color: draft.themeColor.trim(),
          accent_color: draft.accentColor.trim(),
          notification_email: draft.notificationEmail.trim(),
          allowed_category_ids: draft.allowedCategoryIds.join(','),
          featured_product_ids: draft.featuredProductIds.join(','),
          enable_ai_support: draft.enableAiSupport ? '1' : '0',
        },
      },
    }

    try {
      if (draft.id) {
        await updateItem({ type: 'partner-storefront', id: draft.id, data: payload }).unwrap()
      } else {
        await createItem({ type: 'partner-storefront', data: payload }).unwrap()
      }

      setDraft((current) => ({ ...current, slug }))
      showSuccessToast('Partner storefront saved.')
    } catch (error) {
      const apiErr = error as { data?: { message?: string } }
      showErrorToast(apiErr?.data?.message || 'Failed to save partner storefront.')
    }
  }

  useEffect(() => {
    if (!isPartnerScoped) return

    if (storefronts.length === 0) {
      setSelectedId('new')
      setDraft(emptyDraft)
      return
    }

    const currentAllowed = selectedId !== 'new' && storefronts.some((entry) => entry.item.id === selectedId)
    if (!currentAllowed) {
      const first = storefronts[0].item
      setSelectedId(first.id)
      setDraft(toDraft(first))
    }
  }, [isPartnerScoped, storefronts, selectedId])

  if (isLoading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 shadow-sm">Loading partner storefronts...</div>
  }

  if (isError) {
    return <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center text-sm font-semibold text-red-600 shadow-sm">Failed to load partner storefronts.</div>
  }

  const saving = isCreating || isUpdating

  return (
    <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Partner Storefronts</p>
              <h1 className="mt-2 text-xl font-bold text-slate-900">Control Panel</h1>
              <p className="mt-1 text-sm text-slate-500">Create branded partner shop pages like `synergy-shop` and control their visible categories.</p>
            </div>
            {!isPartnerScoped ? (
              <button
                type="button"
                onClick={() => selectStorefront()}
                className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700"
              >
                New
              </button>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
            {storefronts.map(({ item, config }) => {
              const active = selectedId === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectStorefront(item)}
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    active ? 'border-cyan-300 bg-cyan-50' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{config.displayName}</p>
                  <p className="mt-1 text-xs text-slate-500">/{config.slug}</p>
                  <p className="mt-2 text-xs text-slate-400">{config.allowedCategoryIds.length} selected categories</p>
                </button>
              )
            })}

            {storefronts.length === 0 ? (
              <p className="p-3 text-sm text-slate-500">
                {isPartnerScoped ? 'No storefront assigned to this account yet.' : 'No partner storefronts yet.'}
              </p>
            ) : null}
          </div>
        </div>
      </aside>

      <section className="space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Slug">
              <input
                value={draft.slug}
                onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))}
                onBlur={(event) => setDraft((current) => ({ ...current, slug: toSlug(event.target.value) }))}
                placeholder="synergy-shop"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-300 focus:bg-white"
              />
            </Field>
            <Field label="Display Name">
              <input
                value={draft.displayName}
                onChange={(event) => setDraft((current) => ({ ...current, displayName: event.target.value }))}
                placeholder="Synergy Shop"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-300 focus:bg-white"
              />
            </Field>
            <Field label="Hero Title">
              <input
                value={draft.heroTitle}
                onChange={(event) => setDraft((current) => ({ ...current, heroTitle: event.target.value }))}
                placeholder="Synergy Shop Furniture Store"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-300 focus:bg-white"
              />
            </Field>
            <Field label="Partner Notification Email">
              <input
                value={draft.notificationEmail}
                onChange={(event) => setDraft((current) => ({ ...current, notificationEmail: event.target.value }))}
                placeholder="ops@synergy.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-300 focus:bg-white"
              />
            </Field>
            <Field label="Logo" className="md:col-span-2">
              <div className="space-y-3">
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Upload storefront logo</p>
                    <p className="mt-1 text-xs text-slate-500">PNG, JPG, or WebP. Upload directly from your device.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={isUploadingLogo}
                      className="rounded-2xl border border-cyan-200 bg-white px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
                    </button>
                  </div>
                </div>
                {draft.logoUrl ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <div className="h-12 w-12 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <img src={draft.logoUrl} alt="Uploaded logo preview" className="h-full w-full object-contain p-1" />
                    </div>
                    <p className="text-xs text-slate-500">Logo uploaded.</p>
                  </div>
                ) : null}
              </div>
            </Field>
            <Field label="Hero Subtitle" className="md:col-span-2">
              <textarea
                value={draft.heroSubtitle}
                onChange={(event) => setDraft((current) => ({ ...current, heroSubtitle: event.target.value }))}
                placeholder="Curated home furniture for condo buyers."
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-300 focus:bg-white"
              />
            </Field>
            <Field label="Theme Color">
              <input
                type="color"
                value={draft.themeColor}
                onChange={(event) => setDraft((current) => ({ ...current, themeColor: event.target.value }))}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2"
              />
            </Field>
            <Field label="Accent Color">
              <input
                type="color"
                value={draft.accentColor}
                onChange={(event) => setDraft((current) => ({ ...current, accentColor: event.target.value }))}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2"
              />
            </Field>
            {canManageAiSupport ? (
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2">
                <input
                  type="checkbox"
                  checked={draft.enableAiSupport}
                  onChange={(event) => setDraft((current) => ({ ...current, enableAiSupport: event.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Enable AI Support</p>
                  <p className="text-xs text-slate-500">Show the floating AI chat widget on this partner storefront.</p>
                </div>
              </label>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void saveStorefront()}
              disabled={saving}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Storefront'}
            </button>
            <a
              href={draft.slug ? `/shop/${draft.slug}` : '#'}
              target="_blank"
              rel="noreferrer"
              className={`rounded-2xl border px-5 py-3 text-sm font-semibold ${draft.slug ? 'border-slate-300 bg-white text-slate-700' : 'pointer-events-none border-slate-200 bg-slate-100 text-slate-400'}`}
            >
              Open Preview
            </a>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Allowed Categories</h2>
                <p className="mt-1 text-sm text-slate-500">Only these categories will appear on the partner shop page.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {draft.allowedCategoryIds.length} selected
              </span>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {categories.map((category) => {
                const active = draft.allowedCategoryIds.includes(category.id)
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                      active ? 'border-cyan-300 bg-cyan-50 text-cyan-900' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">{category.name}</p>
                      <p className="text-xs text-slate-400">ID {category.id} · {category.product_count ?? 0} items</p>
                    </div>
                    <span className={`h-4 w-4 rounded-full border-2 ${active ? 'border-cyan-500 bg-cyan-500' : 'border-slate-300 bg-white'}`} />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">Featured Product IDs</h2>
              <p className="mt-1 text-sm text-slate-500">These IDs can be used by shop builder sections for curated product cards.</p>
              <textarea
                value={draft.featuredProductIds.join(',')}
                onChange={(event) => setDraft((current) => ({ ...current, featuredProductIds: parseIdList(event.target.value) }))}
                rows={4}
                placeholder="12,18,25,36"
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-300 focus:bg-white"
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">Product Helper</h2>
              <p className="mt-1 text-sm text-slate-500">Quick reference from the first 100 active products.</p>
              <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        featuredProductIds: current.featuredProductIds.includes(product.id)
                          ? current.featuredProductIds
                          : [...current.featuredProductIds, product.id],
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:border-slate-300"
                  >
                    <p className="line-clamp-2 text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="mt-1 text-xs text-slate-500">ID {product.id} · Category {product.catid}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      {children}
    </label>
  )
}
