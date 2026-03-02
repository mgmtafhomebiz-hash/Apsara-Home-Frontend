type MediaSectionPageProps = {
  params: Promise<{ slug: string }>
}

const getTitle = (slug: string) =>
  slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

export default async function MediaSectionPage({ params }: MediaSectionPageProps) {
  const { slug } = await params
  const title = getTitle(slug)

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
      <p className="mt-3 text-gray-600">This page is under construction.</p>
    </main>
  )
}
