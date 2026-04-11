export default function Head({ params }: { params: { partner: string } }) {
  const slug = String(params.partner ?? '').toLowerCase()
  if (slug !== 'synergy-shop') return null

  return (
    <>
      <link rel="icon" href="/Images/synergy.png" />
      <link rel="apple-touch-icon" href="/Images/synergy.png" />
    </>
  )
}
