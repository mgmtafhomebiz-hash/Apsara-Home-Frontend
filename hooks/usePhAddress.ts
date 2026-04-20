import { useEffect, useState } from 'react'

interface PsgcItem {
    code: string
    name: string
}

interface UsePhAddressReturn {
    regions: PsgcItem[]
    provinces: PsgcItem[]
    cities: PsgcItem[]
    barangays: PsgcItem[]
    regionCode: string
    provinceCode: string
    cityCode: string
    noProvince: boolean
    loadingRegions: boolean
    loadingProvinces: boolean
    loadingCities: boolean
    loadingBarangays: boolean
    setRegion: (code: string, name: string) => void
    setProvince: (code: string, name: string) => void
    setCity: (code: string, name: string) => void
    setBarangay: (name: string) => void
    reset: () => void
    address: {
        region: string
        province: string
        city: string
        barangay: string
    }
}

interface UsePhAddressOptions {
    legacyNoProvinceRegions?: boolean
    source?: 'auto' | 'backend' | 'psgc'
}

const API_BASE = process.env.NEXT_PUBLIC_LARAVEL_API_URL ?? ''
const PSGC_BASE_URL = 'https://psgc.gitlab.io/api'
const listCache = new Map<string, PsgcItem[]>()
const inflight = new Map<string, Promise<PsgcItem[]>>()
const LEGACY_NO_PROVINCE_REGION_CODES = new Set([
    '130000000', // NCR
    '140000000', // CAR
    '190000000', // Dinagat Islands in some legacy PSGC datasets
])

const requestJson = async (url: string, timeoutMs: number): Promise<Response> => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs)

    try {
        return await fetch(url, {
            headers: {
                Accept: 'application/json',
            },
            signal: controller.signal,
        })
    } finally {
        window.clearTimeout(timeout)
    }
}

type LoadResult = {
    items: PsgcItem[]
    ok: boolean
}

const fetchAddressList = async (path: string, params?: Record<string, string>, timeoutMs = 5000): Promise<LoadResult> => {
    const query = new URLSearchParams(params ?? {})
    const url = `${API_BASE}/api/address/${path}${query.toString() ? `?${query.toString()}` : ''}`

    const cached = listCache.get(url)
    if (cached) return { items: cached, ok: true }

    const pending = inflight.get(url)
    if (pending) {
        const items = await pending
        return { items, ok: true }
    }

    let succeeded = false

    const request = requestJson(url, timeoutMs)
        .then((response) => {
            succeeded = response.ok
            return response.ok ? response.json() : { data: [] }
        })
        .then((payload: { data?: PsgcItem[] }) => (payload.data ?? []).sort((a, b) => a.name.localeCompare(b.name)))
        .catch(() => [])
        .finally(() => inflight.delete(url))

    inflight.set(url, request)
    const items = await request
    if (succeeded) {
        listCache.set(url, items)
    }
    return { items, ok: succeeded }
}

const fetchPsgcList = async (path: string, timeoutMs = 7000): Promise<LoadResult> => {
    const url = `${PSGC_BASE_URL}${path}`

    const cached = listCache.get(url)
    if (cached) return { items: cached, ok: true }

    const pending = inflight.get(url)
    if (pending) {
        const items = await pending
        return { items, ok: true }
    }

    let succeeded = false

    const request = requestJson(url, timeoutMs)
        .then((response) => {
            succeeded = response.ok
            return response.ok ? response.json() : []
        })
        .then((payload: Array<{ code?: string; name?: string; regionName?: string }>) =>
            (payload ?? [])
                .map((item) => ({
                    code: String(item.code ?? ''),
                    name: String(item.regionName || item.name || ''),
                }))
                .filter((item) => item.code && item.name)
                .sort((a, b) => a.name.localeCompare(b.name)),
        )
        .catch(() => [])
        .finally(() => inflight.delete(url))

    inflight.set(url, request)
    const items = await request
    if (succeeded) {
        listCache.set(url, items)
    }
    return { items, ok: succeeded }
}

const loadBySource = async (source: 'backend' | 'psgc', path: string, params?: Record<string, string>) => {
    if (source === 'psgc') {
        return fetchPsgcList(path)
    }

    return fetchAddressList(path, params, 2500)
}

const loadWithFallback = async (
    preferredSource: UsePhAddressOptions['source'],
    pathBySource: { backend: { path: string; params?: Record<string, string> }, psgc: { path: string } },
) => {
    if (preferredSource === 'psgc') {
        return fetchPsgcList(pathBySource.psgc.path)
    }

    if (preferredSource === 'backend') {
        return fetchAddressList(pathBySource.backend.path, pathBySource.backend.params)
    }

    const backendResult = await loadBySource('backend', pathBySource.backend.path, pathBySource.backend.params)
    if (backendResult.ok && backendResult.items.length > 0) {
        return backendResult
    }

    const psgcResult = await loadBySource('psgc', pathBySource.psgc.path)
    if (psgcResult.ok && psgcResult.items.length > 0) {
        return psgcResult
    }

    return backendResult.ok ? backendResult : psgcResult
}

export function usePhAddress(options?: UsePhAddressOptions): UsePhAddressReturn {
    const source = options?.source ?? 'backend'
    const [regions, setRegions] = useState<PsgcItem[]>([])
    const [provinces, setProvinces] = useState<PsgcItem[]>([])
    const [cities, setCities] = useState<PsgcItem[]>([])
    const [barangays, setBarangays] = useState<PsgcItem[]>([])

    const [regionCode, setRegionCode] = useState('')
    const [provinceCode, setProvinceCode] = useState('')
    const [cityCode, setCityCode] = useState('')
    const [noProvince, setNoProvince] = useState(false)

    const [loadingRegions, setLoadingRegions] = useState(false)
    const [loadingProvinces, setLoadingProvinces] = useState(false)
    const [loadingCities, setLoadingCities] = useState(false)
    const [loadingBarangays, setLoadingBarangays] = useState(false)

    const [address, setAddress] = useState({
        region: '',
        province: '',
        city: '',
        barangay: '',
    })

    // Load regions on mount.
    useEffect(() => {
        let active = true

        void Promise.resolve().then(() => {
            if (active) setLoadingRegions(true)
        })

        loadWithFallback(source, {
            backend: { path: 'regions' },
            psgc: { path: '/regions/' },
        }).then((result) => {
            if (active) setRegions(result.items)
        }).finally(() => {
            if (active) setLoadingRegions(false)
        })

        return () => {
            active = false
        }
    }, [source])

    // Load provinces (or cities directly) when region changes.
    useEffect(() => {
        if (!regionCode) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoadingProvinces(false)
            return
        }

        let active = true
        setLoadingProvinces(true)
        setProvinces([])
        setCities([])
        setBarangays([])

        const load = async () => {
            if (source === 'psgc') {
                const provinceResult = await fetchPsgcList(`/regions/${regionCode}/provinces/`)
                if (!provinceResult.items.length) {
                    const cityResult = await fetchPsgcList(`/regions/${regionCode}/cities-municipalities/`)
                    if (active) {
                        setNoProvince(true)
                        setCities(cityResult.items)
                    }
                    return
                }

                if (active) {
                    setNoProvince(false)
                    setProvinces(provinceResult.items)
                }
                return
            }

            if (source === 'backend' && options?.legacyNoProvinceRegions && LEGACY_NO_PROVINCE_REGION_CODES.has(regionCode)) {
                const cityResult = await fetchAddressList('cities', { region_code: regionCode })
                if (active) {
                    setNoProvince(true)
                    setCities(cityResult.items)
                }
                return
            }

            const provinceResult = await loadWithFallback(source, {
                backend: { path: 'provinces', params: { region_code: regionCode } },
                psgc: { path: `/regions/${regionCode}/provinces/` },
            })

            if (!provinceResult.items.length) {
                const cityResult = await loadWithFallback(source, {
                    backend: { path: 'cities', params: { region_code: regionCode } },
                    psgc: { path: `/regions/${regionCode}/cities-municipalities/` },
                })
                if (active) {
                    setNoProvince(true)
                    setCities(cityResult.items)
                }
                return
            }

            if (active) {
                setNoProvince(false)
                setProvinces(provinceResult.items)
            }
        }

        load().finally(() => {
            if (active) setLoadingProvinces(false)
        })

        return () => {
            active = false
        }
    }, [options?.legacyNoProvinceRegions, regionCode, source])

    // Load cities when province changes.
    useEffect(() => {
        if (!provinceCode) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoadingCities(false)
            return
        }

        let active = true
        setLoadingCities(true)
        setCities([])
        setBarangays([])

        loadWithFallback(source, {
            backend: { path: 'cities', params: { province_code: provinceCode } },
            psgc: { path: `/provinces/${provinceCode}/cities-municipalities/` },
        })
            .then((result) => {
                if (active) setCities(result.items)
            })
            .finally(() => {
                if (active) setLoadingCities(false)
            })

        return () => {
            active = false
        }
    }, [provinceCode, source])

    // Load barangays when city changes.
    useEffect(() => {
        if (!cityCode) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoadingBarangays(false)
            return
        }

        let active = true
        setLoadingBarangays(true)
        setBarangays([])

        loadWithFallback(source, {
            backend: { path: 'barangays', params: { city_code: cityCode } },
            psgc: { path: `/cities-municipalities/${cityCode}/barangays/` },
        })
            .then((result) => {
                if (active) setBarangays(result.items)
            })
            .finally(() => {
                if (active) setLoadingBarangays(false)
            })

        return () => {
            active = false
        }
    }, [cityCode, source])

    const setRegion = (code: string, name: string) => {
        setRegionCode(code)
        setProvinceCode('')
        setCityCode('')
        setAddress({ region: name, province: '', city: '', barangay: '' })
    }

    const setProvince = (code: string, name: string) => {
        setProvinceCode(code)
        setCityCode('')
        setAddress((prev) => ({ ...prev, province: name, city: '', barangay: '' }))
    }

    const setCity = (code: string, name: string) => {
        setCityCode(code)
        setAddress((prev) => ({ ...prev, city: name, barangay: '' }))
    }

    const setBarangay = (name: string) => {
        setAddress((prev) => ({ ...prev, barangay: name }))
    }

    const reset = () => {
        setRegionCode('')
        setProvinceCode('')
        setCityCode('')
        setNoProvince(false)
        setProvinces([])
        setCities([])
        setBarangays([])
        setAddress({
            region: '',
            province: '',
            city: '',
            barangay: '',
        })
    }

    return {
        regions,
        provinces,
        cities,
        barangays,
        regionCode,
        provinceCode,
        cityCode,
        noProvince,
        loadingRegions,
        loadingProvinces,
        loadingCities,
        loadingBarangays,
        setRegion,
        setProvince,
        setCity,
        setBarangay,
        reset,
        address,
    }
}
