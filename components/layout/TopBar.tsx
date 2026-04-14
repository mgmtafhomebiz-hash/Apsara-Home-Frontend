'use client'

const defaultMessages = [
  'Free Shipping on orders over PHP 5,000',
  'Summer Sale - Up to 50% off selected items',
  'New arrivals every week',
  'Nationwide delivery to all major cities',
  'Installment available via GCash & Maya',
]

export type TopBarConfig = {
  phone?: string
  email?: string
  messages?: string[]
  facebookLabel?: string
  facebookUrl?: string
  instagramLabel?: string
  instagramUrl?: string
  tiktokLabel?: string
  tiktokUrl?: string
}

export default function TopBar({
  phone = '+63 912 345 6789',
  email = 'hello@afhome.ph',
  messages = defaultMessages,
  facebookLabel = 'FB',
  facebookUrl = '#',
  instagramLabel = 'IG',
  instagramUrl = '#',
  tiktokLabel = 'TikTok',
  tiktokUrl = '#',
}: TopBarConfig = {}) {
  const safeMessages = messages.length > 0 ? messages : defaultMessages

  return (
    <div className="overflow-hidden bg-slate-900 py-2 text-xs text-white">
      <div className="flex items-center">
        <div className="hidden shrink-0 items-center gap-5 px-6 text-white/60 md:flex">
          <a href={`tel:${phone.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 transition-colors hover:text-orange-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {phone}
          </a>
          <a href={`mailto:${email}`} className="flex items-center gap-1.5 transition-colors hover:text-orange-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,12 2,6" />
            </svg>
            {email}
          </a>
        </div>

        <div className="mx-4 flex-1 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...safeMessages, ...safeMessages].map((message, index) => (
              <span key={`${message}-${index}`} className="mx-10 text-white/70">
                {message}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-3 px-6 text-white/50 md:flex">
          <a href={facebookUrl} className="transition-colors hover:text-orange-400">{facebookLabel}</a>
          <span className="text-white/20">|</span>
          <a href={instagramUrl} className="transition-colors hover:text-orange-400">{instagramLabel}</a>
          <span className="text-white/20">|</span>
          <a href={tiktokUrl} className="transition-colors hover:text-orange-400">{tiktokLabel}</a>
        </div>
      </div>
    </div>
  )
}
