import type { ShippingRate } from '@/store/api/shippingRatesApi';

const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\bcity of\b/gi, '')
    .replace(/\b(city|municipality|province)\b/gi, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const PROVINCE_ALIASES: Record<string, string> = {
  ncr: 'manila',
  'metro manila': 'manila',
  'national capital region': 'manila',
  'city of manila': 'manila',
};

const CITY_ALIASES: Record<string, string> = {
  'las pinas': 'las pinas',
  'sjdm bulacan': 'san jose del monte',
  'san jose del monte city': 'san jose del monte',
  'city of cavite': 'cavite',
  'general mariano alvarez gma': 'general mariano alvarez',
  'sta rosa': 'santa rosa',
  'sta cruz': 'santa cruz',
  'sto tomas': 'santo tomas',
  'sto. tomas': 'santo tomas',
  'sta maria': 'santa maria',
};

export function resolveShippingFee(rates: ShippingRate[], province: string, city: string): number | null {
  const normalizedProvince = PROVINCE_ALIASES[normalizeKey(province)] ?? normalizeKey(province);
  const normalizedCity = CITY_ALIASES[normalizeKey(city)] ?? normalizeKey(city);

  const matchedRate = rates.find((rate) => {
    if (!rate.status) return false;
    const rateProvince = PROVINCE_ALIASES[normalizeKey(rate.provinceKey || rate.province)] ?? normalizeKey(rate.provinceKey || rate.province);
    const rateCity = CITY_ALIASES[normalizeKey(rate.cityKey || rate.city)] ?? normalizeKey(rate.cityKey || rate.city);

    return rateProvince === normalizedProvince && rateCity === normalizedCity;
  });

  return matchedRate?.fee ?? null;
}
