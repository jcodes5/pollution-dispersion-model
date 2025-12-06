import { MeteoDataPoint } from "@shared/api";

interface CacheEntry {
  data: MeteoDataPoint[];
  timestamp: number;
}

interface ForecastCache {
  [key: string]: CacheEntry;
}

// In-memory cache store
const cache: ForecastCache = {};

// Cache TTL in milliseconds (15 minutes)
const CACHE_TTL = 15 * 60 * 1000;

/**
 * Generate cache key from latitude and longitude
 */
export function generateCacheKey(latitude: number, longitude: number): string {
  // Round to 3 decimal places (~100m precision) to group similar locations
  const lat = Math.round(latitude * 1000) / 1000;
  const lon = Math.round(longitude * 1000) / 1000;
  return `${lat},${lon}`;
}

/**
 * Get cached forecast data if available and not expired
 */
export function getCachedForecast(
  latitude: number,
  longitude: number
): MeteoDataPoint[] | null {
  const key = generateCacheKey(latitude, longitude);
  const entry = cache[key];

  if (!entry) return null;

  // Check if cache is still valid
  const age = Date.now() - entry.timestamp;
  if (age > CACHE_TTL) {
    // Cache expired, delete it
    delete cache[key];
    return null;
  }

  return entry.data;
}

/**
 * Store forecast data in cache
 */
export function setCachedForecast(
  latitude: number,
  longitude: number,
  data: MeteoDataPoint[]
): void {
  const key = generateCacheKey(latitude, longitude);
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
}

/**
 * Clear entire cache (useful for testing or manual refresh)
 */
export function clearCache(): void {
  Object.keys(cache).forEach((key) => delete cache[key]);
}

/**
 * Get cache statistics (for debugging)
 */
export function getCacheStats(): {
  entries: number;
  ttl_minutes: number;
  keys: string[];
} {
  return {
    entries: Object.keys(cache).length,
    ttl_minutes: CACHE_TTL / (60 * 1000),
    keys: Object.keys(cache),
  };
}
