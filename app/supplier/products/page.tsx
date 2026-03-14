import { buildPageMetadata } from '@/app/seo'
import ProductsPageMain from '@/components/superAdmin/products/ProductsPageMain'
import { authOptions } from '@/libs/auth'
import { normalizeProductsResponse, ProductsResponse } from '@/store/api/productsApi'
import { getServerSession } from 'next-auth'

export const metadata = buildPageMetadata({
  title: 'Supplier Products',
  description: 'Manage supplier products on AF Home.',
  path: '/supplier/products',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

async function getInitialProducts(): Promise<ProductsResponse | null> {
  const session = await getServerSession(authOptions)
  const accessToken = (session?.user as { accessToken?: string } | undefined)?.accessToken
  const supplierId = Number((session?.user as { supplierId?: number | null } | undefined)?.supplierId ?? 0)

  if (!accessToken) return null

  const apiUrl = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL
  if (!apiUrl) return null

  const supplierQuery = supplierId > 0 ? `&supplier_id=${supplierId}` : ''
  const res = await fetch(`${apiUrl}/api/admin/products?page=1&per_page=25${supplierQuery}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) return null
  return normalizeProductsResponse((await res.json()) as ProductsResponse)
}

export default async function SupplierProductsPage() {
  const initialData = await getInitialProducts()

  return <ProductsPageMain initialData={initialData} />
}
