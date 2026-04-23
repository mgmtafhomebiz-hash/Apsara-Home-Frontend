import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/app/seo';
import CustomerCheckoutMain from '@/components/checkout/customer/CustomerCheckoutMain';
import { getNavbarCategories } from '@/libs/serverStorefront';
import { getPartnerStorefrontConfig } from '@/libs/partnerStorefront';
import { normalizeReferralCode } from '@/libs/referral';
import type { WebPageItem } from '@/store/api/webPagesApi';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ partner: string }>
}

type PublicWebPageItemsResponse = {
  items?: WebPageItem[]
}

async function getStorefrontReferralCode(partnerSlug: string): Promise<string> {
  const apiUrl = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL;
  if (!apiUrl) return '';

  try {
    const response = await fetch(`${apiUrl}/api/web-pages/partner-storefronts`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) return '';

    const json = (await response.json()) as PublicWebPageItemsResponse;
    const storefront = (json.items ?? []).find((item) => {
      const config = getPartnerStorefrontConfig(item);
      return config?.slug === partnerSlug;
    });
    const config = getPartnerStorefrontConfig(storefront);
    return normalizeReferralCode(config?.referralLink ?? '');
  } catch {
    return '';
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { partner } = await params;
  const normalizedPartner = partner.trim().toLowerCase();

  if (normalizedPartner !== 'synergy-shop') {
    return buildPageMetadata({
      title: 'Checkout Customer',
      description: 'Browse the Checkout Customer page on AF Home.',
      path: '/checkout/customer',
      noIndex: true,
    });
  }

  const metadata = buildPageMetadata({
    title: 'Checkout',
    description: 'Complete your checkout for Synergy Shop orders.',
    path: `/${normalizedPartner}/checkout/customer`,
    noIndex: true,
    siteName: 'Synergy Shop',
  });

  return {
    ...metadata,
    icons: {
      icon: [{ url: '/Images/synergy.png', type: 'image/png' }],
      apple: '/Images/synergy.png',
    },
  };
}

export default async function PartnerCustomerCheckoutPage({ params }: PageProps) {
  const { partner } = await params;
  const normalizedPartner = partner.trim().toLowerCase();

  if (normalizedPartner !== 'synergy-shop') {
    notFound();
  }

  const [navbarCategories, storefrontReferralCode] = await Promise.all([
    getNavbarCategories(),
    getStorefrontReferralCode(normalizedPartner),
  ]);

  return (
    <CustomerCheckoutMain
      initialCategories={navbarCategories}
      storefrontPartner={normalizedPartner}
      storefrontReferralCode={storefrontReferralCode}
    />
  );
}
