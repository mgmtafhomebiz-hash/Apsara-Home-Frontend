'use client'

import Image from 'next/image'

type LoadingScreenProps = {
  logoSrc?: string
  logoAlt?: string
  brandText?: string
  tagline?: string
}

export default function LoadingScreen({
  logoSrc = '/Images/af_home_logo.png',
  logoAlt = 'AF Home Logo',
  brandText = 'AF HOME',
  tagline = 'Your Trusted Home Partner',
}: LoadingScreenProps) {
  const [firstWord, ...rest] = brandText.trim().split(/\s+/)
  const highlightWord = rest.join(' ')

  return (
    <div
      id="af-loading-screen"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#faf8f5]"
    >
      <div className="absolute -top-24 -right-24 h-80 w-80 animate-blob rounded-full bg-[#2c5f4f]/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 animate-blob rounded-full bg-[#d4a574]/15 blur-3xl animation-delay-2000" />
      <div className="absolute top-1/3 -left-16 h-48 w-48 animate-blob rounded-full bg-[#2c5f4f]/8 blur-2xl animation-delay-4000" />

      <div className="relative mb-8 flex items-center justify-center">
        <span
          className="absolute inline-flex animate-ping rounded-full bg-[#d4a574]/20"
          style={{ width: 180, height: 180, animationDuration: '2.4s', animationDelay: '0.3s' }}
        />
        <span
          className="absolute inline-flex animate-ping rounded-full bg-[#2c5f4f]/25"
          style={{ width: 148, height: 148, animationDuration: '2s' }}
        />

        <span className="absolute h-32 w-32 rounded-full bg-[#2c5f4f]/10 blur-md" />

        <div className="relative z-10 animate-logo-enter">
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={110}
            height={110}
            priority
            className="object-contain drop-shadow-xl mix-blend-multiply"
          />
        </div>
      </div>

      <div className="mb-10 flex flex-col items-center gap-1.5 animate-fade-up-in" style={{ animationDelay: '0.4s', opacity: 0 }}>
        <p className="font-display text-2xl font-semibold tracking-[0.18em] text-[#1a1a1a]">
          {firstWord}
          {highlightWord ? <span className="text-[#d4a574]"> {highlightWord}</span> : null}
        </p>
        <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#6b6b6b]">{tagline}</p>
      </div>

      <div className="flex items-center gap-2 animate-fade-up-in" style={{ animationDelay: '0.65s', opacity: 0 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="loading-dot h-2 w-2 rounded-full bg-[#2c5f4f]"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 h-[3px] w-full overflow-hidden bg-[#2c5f4f]/10">
        <div className="absolute inset-y-0 w-1/3 animate-loading-sweep bg-gradient-to-r from-transparent via-[#2c5f4f] to-transparent" />
      </div>
    </div>
  )
}

