export interface CountryItem {
  name: string;
  code: string; // ISO 2-letter code (e.g. US, NG, CH, GB)
  flagUrl: string; // High quality PNG/SVG flag image URL
}

// Initial Instant Fallback Dataset with FlagCDN Image URLs
const FALLBACK_COUNTRIES: CountryItem[] = [
  { name: 'United States', code: 'US', flagUrl: 'https://flagcdn.com/w40/us.png' },
  { name: 'Nigeria', code: 'NG', flagUrl: 'https://flagcdn.com/w40/ng.png' },
  { name: 'United Kingdom', code: 'GB', flagUrl: 'https://flagcdn.com/w40/gb.png' },
  { name: 'Switzerland', code: 'CH', flagUrl: 'https://flagcdn.com/w40/ch.png' },
  { name: 'Canada', code: 'CA', flagUrl: 'https://flagcdn.com/w40/ca.png' },
  { name: 'Germany', code: 'DE', flagUrl: 'https://flagcdn.com/w40/de.png' },
  { name: 'Singapore', code: 'SG', flagUrl: 'https://flagcdn.com/w40/sg.png' },
  { name: 'Australia', code: 'AU', flagUrl: 'https://flagcdn.com/w40/au.png' },
  { name: 'France', code: 'FR', flagUrl: 'https://flagcdn.com/w40/fr.png' },
  { name: 'Japan', code: 'JP', flagUrl: 'https://flagcdn.com/w40/jp.png' },
  { name: 'India', code: 'IN', flagUrl: 'https://flagcdn.com/w40/in.png' },
  { name: 'Brazil', code: 'BR', flagUrl: 'https://flagcdn.com/w40/br.png' },
  { name: 'South Africa', code: 'ZA', flagUrl: 'https://flagcdn.com/w40/za.png' },
  { name: 'United Arab Emirates', code: 'AE', flagUrl: 'https://flagcdn.com/w40/ae.png' },
  { name: 'Kenya', code: 'KE', flagUrl: 'https://flagcdn.com/w40/ke.png' },
  { name: 'Ghana', code: 'GH', flagUrl: 'https://flagcdn.com/w40/gh.png' },
  { name: 'Netherlands', code: 'NL', flagUrl: 'https://flagcdn.com/w40/nl.png' },
  { name: 'Ireland', code: 'IE', flagUrl: 'https://flagcdn.com/w40/ie.png' },
  { name: 'Spain', code: 'ES', flagUrl: 'https://flagcdn.com/w40/es.png' },
  { name: 'Italy', code: 'IT', flagUrl: 'https://flagcdn.com/w40/it.png' },
  { name: 'Mexico', code: 'MX', flagUrl: 'https://flagcdn.com/w40/mx.png' },
  { name: 'Argentina', code: 'AR', flagUrl: 'https://flagcdn.com/w40/ar.png' },
  { name: 'New Zealand', code: 'NZ', flagUrl: 'https://flagcdn.com/w40/nz.png' },
  { name: 'Sweden', code: 'SE', flagUrl: 'https://flagcdn.com/w40/se.png' },
];

/**
  Centralized REST API Service for fetching Country & Flag Data
  Source: REST Countries API (v3.1) with FlagCDN fallback
 */
export async function getCountries(): Promise<CountryItem[]> {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flags');
    if (!response.ok) throw new Error('REST Countries API error');
    
    const data = await response.json();
    const formatted: CountryItem[] = data.map((c: any) => ({
      name: c.name.common,
      code: c.cca2,
      flagUrl: c.flags?.png || c.flags?.svg || `https://flagcdn.com/w40/${c.cca2.toLowerCase()}.png`,
    })).sort((a: CountryItem, b: CountryItem) => a.name.localeCompare(b.name));

    return formatted.length > 0 ? formatted : FALLBACK_COUNTRIES;
  } catch (error) {
    console.warn('Using fallback country list:', error);
    return FALLBACK_COUNTRIES;
  }
}
