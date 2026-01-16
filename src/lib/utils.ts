import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const COUNTRY_CODES: Record<string, string> = {
  'United States': 'us', 'USA': 'us', 'Canada': 'ca', 'Brazil': 'br', 'Argentina': 'ar', 'Chile': 'cl',
  'Turkey': 'tr', 'France': 'fr', 'Germany': 'de', 'Sweden': 'se', 'Norway': 'no',
  'Europe': 'eu', 'Korea': 'kr', 'Japan': 'jp', 'China': 'cn', 'Mongolia': 'mn',
  'Thailand': 'th', 'Singapore': 'sg', 'India': 'in', 'Indonesia': 'id', 'Philippines': 'ph', 'Vietnam': 'vn',
  'Russia': 'ru', 'Ukraine': 'ua', 'Poland': 'pl', 'Spain': 'es', 'Italy': 'it', 'Portugal': 'pt',
  'United Kingdom': 'gb', 'UK': 'gb', 'Finland': 'fi', 'Denmark': 'dk', 'Netherlands': 'nl', 'Belgium': 'be',
  'Australia': 'au', 'New Zealand': 'nz',
  'International': 'un', 'World': 'un',
};

export function getCountryCode(countryName?: string): string | null {
  if (!countryName) return null;
  
  // Try direct lookup
  if (COUNTRY_CODES[countryName]) return COUNTRY_CODES[countryName];
  
  // Try case-insensitive
  const lower = countryName.toLowerCase();
  for (const [key, value] of Object.entries(COUNTRY_CODES)) {
    if (key.toLowerCase() === lower) return value;
  }
  
  return null;
}
