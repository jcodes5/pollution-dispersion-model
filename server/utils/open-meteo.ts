import { MeteoDataPoint } from "@shared/api";

const OPEN_METEO_API = "https://api.open-meteo.com/v1/forecast";

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    temperature_2m: number[];
  };
}

/**
 * Fetch meteorological forecast data from Open-Meteo API
 * Free API with 10,000 requests/day limit
 */
export async function fetchForecast(
  latitude: number,
  longitude: number,
  hours: number = 48
): Promise<MeteoDataPoint[]> {
  try {
    // Open-Meteo provides up to 7 days of forecast
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hourly: "wind_speed_10m,wind_direction_10m,temperature_2m",
      temperature_unit: "celsius",
      wind_speed_unit: "ms",
      timezone: "UTC",
      forecast_days: "2", // Get 2 days of data (48 hours)
    });

    const url = `${OPEN_METEO_API}?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.statusText}`);
    }

    const data: OpenMeteoResponse = await response.json();

    // Extract hourly data and limit to requested hours
    const meteoData: MeteoDataPoint[] = [];

    for (let i = 0; i < Math.min(hours, data.hourly.time.length); i++) {
      meteoData.push({
        time: data.hourly.time[i],
        windSpeed: Math.max(0.1, data.hourly.wind_speed_10m[i]),
        windDirection: data.hourly.wind_direction_10m[i],
        temperature: data.hourly.temperature_2m[i],
      });
    }

    return meteoData;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
}

/**
 * Generate mock meteorological data for testing
 * This is used when API fails or for quick testing
 */
export function generateMockForecast(
  hours: number = 48
): MeteoDataPoint[] {
  const data: MeteoDataPoint[] = [];
  const now = new Date();

  for (let i = 0; i < hours; i++) {
    const time = new Date(now.getTime() + i * 3600000);
    const hour = time.getHours();

    // Create realistic wind patterns
    const baseWindSpeed = 5 + 2 * Math.sin((hour * Math.PI) / 12);
    const windVariation = Math.sin(i * 0.5) * 0.5;
    const windSpeed = Math.max(0.5, baseWindSpeed + windVariation);

    // Wind direction varies throughout the day
    const windDirection = (180 + hour * 15 + Math.cos(i * 0.3) * 30) % 360;

    // Temperature varies with hour
    const temperature = 15 + 8 * Math.sin((hour * Math.PI) / 12);

    data.push({
      time: time.toISOString(),
      windSpeed,
      windDirection,
      temperature,
    });
  }

  return data;
}

/**
 * Validate forecast data
 */
export function validateForecast(
  data: MeteoDataPoint[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(data) || data.length === 0) {
    errors.push("Forecast data must be a non-empty array");
    return { valid: false, errors };
  }

  data.forEach((point, index) => {
    if (!point.time) errors.push(`Point ${index}: missing time`);
    if (point.windSpeed < 0)
      errors.push(`Point ${index}: wind speed must be non-negative`);
    if (point.windDirection < 0 || point.windDirection > 360)
      errors.push(
        `Point ${index}: wind direction must be between 0 and 360 degrees`
      );
  });

  return { valid: errors.length === 0, errors };
}
