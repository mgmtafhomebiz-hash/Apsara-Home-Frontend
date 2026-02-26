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
    loadingProvinces: boolean
    loadingCities: boolean
    loadingBarangays: boolean
    setRegion: (code: string, name: string) => void
    setProvince: (code: string, name: string) => void
    setCity: (code: string, name: string) => void
    setBarangay: (name: string) => void
    address: {
        region: string
        province: string
        city: string
        barangay: string
    }
}

const BASE = 'https://psgc.gitlab.io/api'
const listCache = new Map<string, PsgcItem[]>()
const inflight = new Map<string, Promise<PsgcItem[]>>()

// Regions with no provinces, go directly region -> cities.
const NO_PROVINCE_REGIONS = [
    '130000000', // NCR - National Capital Region
    '140000000', // CAR - Cordillera Administrative Region
]

const fetchPsgcList = async (path: string): Promise<PsgcItem[]> => {
    const url = `${BASE}${path}`

    const cached = listCache.get(url)
    if (cached) return cached

    const pending = inflight.get(url)
    if (pending) return pending

    const request = fetch(url)
        .then((response) => (response.ok ? response.json() : []))
        .then((data: PsgcItem[]) => data.sort((a, b) => a.name.localeCompare(b.name)))
        .catch(() => [])
        .finally(() => inflight.delete(url))

    inflight.set(url, request)
    const result = await request
    listCache.set(url, result)
    return result
}

export function usePhAddress(): UsePhAddressReturn {
    const [regions, setRegions] = useState<PsgcItem[]>([])
    const [provinces, setProvinces] = useState<PsgcItem[]>([])
    const [cities, setCities] = useState<PsgcItem[]>([])
    const [barangays, setBarangays] = useState<PsgcItem[]>([])

    const [regionCode, setRegionCode] = useState('')
    const [provinceCode, setProvinceCode] = useState('')
    const [cityCode, setCityCode] = useState('')
    const [noProvince, setNoProvince] = useState(false)

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

        fetchPsgcList('/regions/').then((data) => {
            if (active) setRegions(data)
        })

        return () => {
            active = false
        }
    }, [])

    // Load provinces (or cities directly) when region changes.
    useEffect(() => {
        if (!regionCode) {
            setLoadingProvinces(false)
            return
        }

        let active = true
        setLoadingProvinces(true)
        setProvinces([])
        setCities([])
        setBarangays([])

        const isNoProvince = NO_PROVINCE_REGIONS.includes(regionCode)
        setNoProvince(isNoProvince)

        const load = async () => {
            if (isNoProvince) {
                const cityList = await fetchPsgcList(`/regions/${regionCode}/cities-municipalities/`)
                if (active) setCities(cityList)
                return
            }

            const provinceList = await fetchPsgcList(`/regions/${regionCode}/provinces/`)
            if (!provinceList.length) {
                const cityList = await fetchPsgcList(`/regions/${regionCode}/cities-municipalities/`)
                if (active) {
                    setNoProvince(true)
                    setCities(cityList)
                }
                return
            }

            if (active) setProvinces(provinceList)
        }

        load().finally(() => {
            if (active) setLoadingProvinces(false)
        })

        return () => {
            active = false
        }
    }, [regionCode])

    // Load cities when province changes.
    useEffect(() => {
        if (!provinceCode) {
            setLoadingCities(false)
            return
        }

        let active = true
        setLoadingCities(true)
        setCities([])
        setBarangays([])

        fetchPsgcList(`/provinces/${provinceCode}/cities-municipalities/`)
            .then((data) => {
                if (active) setCities(data)
            })
            .finally(() => {
                if (active) setLoadingCities(false)
            })

        return () => {
            active = false
        }
    }, [provinceCode])

    // Load barangays when city changes.
    useEffect(() => {
        if (!cityCode) {
            setLoadingBarangays(false)
            return
        }

        let active = true
        setLoadingBarangays(true)
        setBarangays([])

        fetchPsgcList(`/cities-municipalities/${cityCode}/barangays/`)
            .then((data) => {
                if (active) setBarangays(data)
            })
            .finally(() => {
                if (active) setLoadingBarangays(false)
            })

        return () => {
            active = false
        }
    }, [cityCode])

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

    return {
        regions,
        provinces,
        cities,
        barangays,
        regionCode,
        provinceCode,
        cityCode,
        noProvince,
        loadingProvinces,
        loadingCities,
        loadingBarangays,
        setRegion,
        setProvince,
        setCity,
        setBarangay,
        address,
    }
}
