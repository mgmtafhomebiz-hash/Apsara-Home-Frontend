import { beforeEach, describe, expect, it } from 'vitest'

import {
  REFERRAL_STORAGE_KEY,
  clearStoredReferralCode,
  getStoredReferralCode,
  normalizeReferralCode,
  setStoredReferralCode,
} from '../libs/referral'

const createLocalStorageMock = () => {
  const store = new Map<string, string>()

  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
  }
}

beforeEach(() => {
  const localStorage = createLocalStorageMock()
  ;(globalThis as typeof globalThis & { window: { localStorage: typeof localStorage } }).window = {
    localStorage,
  }
})

describe('normalizeReferralCode', () => {
  it('returns a trimmed plain referral code', () => {
    expect(normalizeReferralCode('  referrer1  ')).toBe('referrer1')
  })

  it('extracts the ref query parameter from a full URL', () => {
    expect(normalizeReferralCode('https://afhome.ph/signup?ref=referrer1')).toBe('referrer1')
  })

  it('extracts the referred_by query parameter from a full URL', () => {
    expect(normalizeReferralCode('https://afhome.ph/signup?referred_by=referrer2')).toBe('referrer2')
  })

  it('falls back to the last path segment when there is no query parameter', () => {
    expect(normalizeReferralCode('https://afhome.ph/referrals/referrer3')).toBe('referrer3')
  })
})

describe('stored referral helpers', () => {
  it('stores the normalized referral code in localStorage', () => {
    setStoredReferralCode('https://afhome.ph/signup?ref=storedRef')

    expect(window.localStorage.getItem(REFERRAL_STORAGE_KEY)).toBe('storedRef')
    expect(getStoredReferralCode()).toBe('storedRef')
  })

  it('clears the stored referral code', () => {
    setStoredReferralCode('referrer4')
    clearStoredReferralCode()

    expect(window.localStorage.getItem(REFERRAL_STORAGE_KEY)).toBeNull()
    expect(getStoredReferralCode()).toBe('')
  })
})
