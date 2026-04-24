import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/app/seo';
import GuestTrackOrderPage from '@/components/orders/GuestTrackOrderPage';
import { getNavbarCategories } from '@/libs/serverStorefront';
import { getPartnerStorefrontConfig } from '@/libs/partnerStorefront';
import type { WebPageItem } from '@/store/api/webPagesApi';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ partner: string }>;
};

type PublicWebPageItemsResponse = {
  items?: WebPageItem[];
};

async function getPartnerStorefront(partnerSlug: string) {
  const apiUrl = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL;
  if (!apiUrl) return null;

  try {
    const response = await fetch(`${apiUrl}/api/web-pages/partner-storefronts`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) return null;

    const json = (await response.json()) as PublicWebPageItemsResponse;
    const storefront = (json.items ?? []).find((item) => {
      const config = getPartnerStorefrontConfig(item);
      return config?.slug === partnerSlug;
    });

    return getPartnerStorefrontConfig(storefront);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { partner } = await params;
  const normalizedPartner = partner.trim().toLowerCase();
  const partnerName = normalizedPartner
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return buildPageMetadata({
    title: 'Track Order',
    description: `Track your ${partnerName} guest order using your order number and checkout contact details.`,
    path: `/${normalizedPartner}/track-order`,
    noIndex: true,
    siteName: partnerName || 'Partner Storefront',
  });
}

export default async function PartnerTrackOrderPage({ params }: PageProps) {
  const { partner } = await params;
  const normalizedPartner = partner.trim().toLowerCase();

  const [navbarCategories, storefront] = await Promise.all([
    getNavbarCategories(),
    getPartnerStorefront(normalizedPartner),
  ]);

  if (!storefront) {
    notFound();
  }

  return (
    <GuestTrackOrderPage
      initialCategories={navbarCategories}
      partnerShell={{
        partnerSlug: storefront.slug,
        displayName: storefront.displayName,
        logoUrl: storefront.logoUrl,
        logoVersion: storefront.logoVersion,
      }}
    />
  );
}
