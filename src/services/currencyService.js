/**
 * CalcX Currency Service
 * Connects to live exchange rate API (open.er-api.com) with caching,
 * failure handling, and transparent status reporting.
 */

export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', flag: '🇲🇽' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', flag: '🇰🇼' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR', flag: '🇶🇦' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', flag: '🇮🇱' },
];

const CACHE_KEY = 'calcx_currency_cache_v1';
const API_URL = 'https://open.er-api.com/v6/latest/USD';

/**
 * Loads cached exchange rates from localStorage
 */
export function getCachedRates() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse cached rates', err);
    return null;
  }
}

/**
 * Saves exchange rates to localStorage cache
 */
function saveRatesToCache(data) {
  try {
    const cacheData = {
      rates: data.rates,
      time_last_update_utc: data.time_last_update_utc,
      cached_at: new Date().toISOString(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (err) {
    console.warn('Failed to save rates to cache', err);
  }
}

/**
 * Fetches current exchange rates.
 * Resolves with status: 'live' | 'cached' | 'unavailable'
 */
export async function fetchExchangeRates() {
  const cached = getCachedRates();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    if (data.result !== 'success' || !data.rates) {
      throw new Error('Malformed API response');
    }

    saveRatesToCache(data);

    return {
      status: 'live',
      rates: data.rates,
      lastUpdated: data.time_last_update_utc || new Date().toUTCString(),
      source: 'Live Exchange API',
    };
  } catch (err) {
    console.warn('Currency API fetch failed, checking cache:', err.message);

    if (cached && cached.rates) {
      return {
        status: 'cached',
        rates: cached.rates,
        lastUpdated: cached.time_last_update_utc || cached.cached_at,
        source: 'Cached Rates (Offline Fallback)',
        errorMsg: 'Live exchange rates unavailable. Using cached rates.',
      };
    }

    return {
      status: 'unavailable',
      rates: null,
      lastUpdated: null,
      source: null,
      errorMsg: 'Live exchange rates unavailable and no cached data exists.',
    };
  }
}

/**
 * Converts amount from one currency to another using base USD rates
 */
export function convertCurrency(amount, fromCode, toCode, rates) {
  if (!rates || !rates[fromCode] || !rates[toCode]) {
    return {
      converted: 0,
      rate: 0,
      inverseRate: 0,
      formatted: '0.00',
    };
  }

  const numAmount = parseFloat(amount) || 0;
  // Rates are relative to USD: 1 USD = rates[currency]
  const fromRateInUSD = rates[fromCode];
  const toRateInUSD = rates[toCode];

  // (amount / fromRate) converts to USD, then * toRate converts to target
  const rate = toRateInUSD / fromRateInUSD;
  const inverseRate = fromRateInUSD / toRateInUSD;
  const converted = numAmount * rate;

  return {
    converted,
    rate,
    inverseRate,
    formatted: converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }),
  };
}
