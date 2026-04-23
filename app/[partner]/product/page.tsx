import { redirect } from 'next/navigation'

type PageProps = {
  params: Promise<{ partner: string }>
}

export default async function PartnerProductLandingPage({ params }: PageProps) {
  const { partner } = await params
  redirect(`/shop/${partner}/product`)
}

