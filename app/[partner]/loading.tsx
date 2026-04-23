'use client'

import { useParams } from 'next/navigation'
import LoadingScreen from '@/components/ui/LoadingScreen'

export default function PartnerLoading() {
  const params = useParams<{ partner?: string }>()
  const partner = String(params?.partner ?? '').trim().toLowerCase()
  const isSynergy = partner === 'synergy-shop'

  return (
    <LoadingScreen
      logoSrc={isSynergy ? '/Images/synergy.png' : '/Images/af_home_logo.png'}
      logoAlt={isSynergy ? 'Synergy Shop Logo' : 'AF Home Logo'}
      brandText={isSynergy ? 'SYNERGY SHOP' : 'AF HOME'}
      tagline={isSynergy ? 'Partner Storefront' : 'Your Trusted Home Partner'}
    />
  )
}

