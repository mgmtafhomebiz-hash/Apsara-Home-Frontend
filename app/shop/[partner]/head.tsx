export default function Head({ params }: { params: { partner: string } }) {
  const slug = String(params.partner ?? '').toLowerCase()
  if (slug !== 'synergy-shop') return null

  return (
    <>
      <link rel="icon" href="/Images/synergy.png" type="image/png" sizes="any" />
      <link rel="shortcut icon" href="/Images/synergy.png" type="image/png" />
      <link rel="apple-touch-icon" href="/Images/synergy.png" />
    </>
  )
}
