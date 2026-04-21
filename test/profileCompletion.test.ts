import { describe, expect, it } from 'vitest'

import { getProfileCompletion } from '../libs/profileCompletion'

describe('getProfileCompletion', () => {
  it('returns 0 percent when there is no profile', () => {
    expect(getProfileCompletion(null)).toEqual({ percentage: 0, complete: false })
  })

  it('uses the explicit backend completion percentage when present', () => {
    expect(
      getProfileCompletion({
        profile_completion_percentage: 67,
        profile_complete: false,
      }),
    ).toEqual({ percentage: 67, complete: false })
  })

  it('marks the profile complete when all required fields are filled', () => {
    expect(
      getProfileCompletion({
        name: 'Rafa Santos',
        email: 'rafa@example.com',
        phone: '09123456789',
        username: 'rafa1122',
        birth_date: '2000-01-01',
        gender: 'male',
        occupation: 'Developer',
        work_location: 'local',
        country: 'Philippines',
      }),
    ).toEqual({ percentage: 100, complete: true })
  })

  it('infers local work location from Philippines and computes the right percentage', () => {
    expect(
      getProfileCompletion({
        name: 'Rafa Santos',
        email: 'rafa@example.com',
        phone: '09123456789',
        username: 'rafa1122',
        birth_date: '',
        gender: null,
        occupation: 'None',
        country: 'Philippines',
      }),
    ).toEqual({ percentage: 67, complete: false })
  })

  it('infers overseas work location from non-local country values', () => {
    expect(
      getProfileCompletion({
        name: 'Rafa Santos',
        email: 'rafa@example.com',
        phone: '09123456789',
        username: 'rafa1122',
        birth_date: '2000-01-01',
        gender: 'female',
        occupation: 'Designer',
        country: 'Singapore',
      }),
    ).toEqual({ percentage: 100, complete: true })
  })
})
