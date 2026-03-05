import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'By Room Details', description: 'Browse the By Room Details page on AF Home.', path: '/by-room/[...slug]' });

type ByRoomDetailsPageProps = {
  params: Promise<{ slug: string[] }>
}

const toTitle = (parts: string[]) =>
  parts
    .map((part) =>
      part
        .split('-')
        .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
        .join(' ')
    )
    .join(' - ')

export default async function ByRoomDetailsPage({ params }: ByRoomDetailsPageProps) {
  const { slug } = await params
  const title = toTitle(slug)

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
      <p className="mt-3 text-gray-600">This page is under construction.</p>
    </main>
  )
}