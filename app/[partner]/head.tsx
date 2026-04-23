export default function Head({ params }: { params: { partner: string } }) {
  const normalizedPartner = String(params.partner ?? '').trim().toLowerCase()
  const isSynergy = normalizedPartner === 'synergy-shop'

  const iconHref = isSynergy ? '/Images/synergy.png' : '/icons/icon-192.png'

  return (
    <>
      <link rel="icon" href={iconHref} type="image/png" sizes="any" />
      <link rel="shortcut icon" href={iconHref} type="image/png" />
      <link rel="apple-touch-icon" href={iconHref} />
    </>
  )
}
