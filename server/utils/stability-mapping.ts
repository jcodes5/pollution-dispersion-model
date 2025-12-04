/**
 * EPA Pasquill-Gifford Stability Class Mapping
 * 
 * Assigns atmospheric stability classes (A-F) based on:
 * - Time of day (day/night)
 * - Wind speed at 10m height
 * - Cloud cover / solar radiation
 * 
 * Reference: EPA Guideline on Air Quality Models (Appendix W)
 * Stability Classes:
 *   A = Extremely Unstable
 *   B = Unstable
 *   C = Slightly Unstable
 *   D = Neutral
 *   E = Slightly Stable
 *   F = Stable
 */

interface StabilityInput {
  hour: number; // 0-23, UTC hour
  windSpeed: number; // m/s at 10m height
  cloudCover: number; // 0-100 (%)
}

interface StabilityResult {
  class: string;
  reason: string;
}

/**
 * Determine if it's daytime or nighttime
 * Simple rule: day = 6am-6pm UTC (adjust as needed for local time)
 */
function isDay(hour: number): boolean {
  return hour >= 6 && hour < 18;
}

/**
 * Estimate solar radiation from cloud cover
 * High cloud cover = low radiation
 * Low cloud cover = high radiation
 */
function estimateSolarRadiation(cloudCover: number): 'high' | 'moderate' | 'low' {
  if (cloudCover < 25) return 'high';
  if (cloudCover < 75) return 'moderate';
  return 'low';
}

/**
 * EPA Pasquill Stability Class Lookup Table
 * Based on: Wind Speed, Time of Day, and Cloud Cover / Solar Radiation
 * 
 * References:
 * - EPA 40 CFR Part 51, Appendix W
 * - Turner, D.B. (1970) "Workbook of atmospheric dispersion estimates"
 */
export function mapToStabilityClass(input: StabilityInput): StabilityResult {
  const { hour, windSpeed, cloudCover } = input;
  const isDay_flag = isDay(hour);
  const solarRad = estimateSolarRadiation(cloudCover);

  // EPA Pasquill Lookup Table
  // Key: "day_high" | "day_moderate" | "day_low" | "night_low" | "night_high"
  // Wind speed ranges (m/s)

  let stabilityClass: string;
  let reason: string;

  if (isDay_flag) {
    // DAYTIME RULES (strong solar heating)
    if (solarRad === 'high') {
      // Strong solar radiation
      if (windSpeed < 2) stabilityClass = 'A';
      else if (windSpeed < 3) stabilityClass = 'A';
      else if (windSpeed < 5) stabilityClass = 'B';
      else if (windSpeed < 6) stabilityClass = 'C';
      else stabilityClass = 'C';
      reason = 'Day (high solar radiation)';
    } else if (solarRad === 'moderate') {
      // Moderate solar radiation
      if (windSpeed < 2) stabilityClass = 'B';
      else if (windSpeed < 3) stabilityClass = 'B';
      else if (windSpeed < 5) stabilityClass = 'C';
      else if (windSpeed < 6) stabilityClass = 'D';
      else stabilityClass = 'D';
      reason = 'Day (moderate solar radiation)';
    } else {
      // Weak solar radiation (high cloud cover)
      if (windSpeed < 2) stabilityClass = 'C';
      else if (windSpeed < 3) stabilityClass = 'C';
      else if (windSpeed < 4) stabilityClass = 'D';
      else if (windSpeed < 6) stabilityClass = 'D';
      else stabilityClass = 'D';
      reason = 'Day (weak solar radiation, high cloud)';
    }
  } else {
    // NIGHTTIME RULES (no solar heating, based on cloud cover)
    if (cloudCover < 25) {
      // Clear night (strong cooling, stable)
      if (windSpeed < 3) stabilityClass = 'F';
      else if (windSpeed < 5) stabilityClass = 'E';
      else stabilityClass = 'D';
      reason = 'Night (clear, strong cooling)';
    } else if (cloudCover < 75) {
      // Partly cloudy night
      if (windSpeed < 3) stabilityClass = 'E';
      else if (windSpeed < 5) stabilityClass = 'D';
      else stabilityClass = 'D';
      reason = 'Night (partly cloudy)';
    } else {
      // Overcast night (less stable, clouds trap heat)
      if (windSpeed < 3) stabilityClass = 'D';
      else stabilityClass = 'D';
      reason = 'Night (overcast)';
    }
  }

  return { class: stabilityClass, reason };
}

/**
 * Map array of hours to stability classes
 */
export function mapHourlyStabilityClasses(
  hours: number[],
  windSpeeds: number[],
  cloudCovers: number[]
): Array<{ hour: number; class: string; reason: string }> {
  return hours.map((hour, idx) => {
    const result = mapToStabilityClass({
      hour,
      windSpeed: windSpeeds[idx] || 5,
      cloudCover: cloudCovers[idx] || 50,
    });
    return {
      hour,
      class: result.class,
      reason: result.reason,
    };
  });
}

/**
 * Get Pasquill-Gifford dispersion parameter coefficients
 * Returns sigma_y and sigma_z coefficients for polynomial: sigma = a * x^b
 * where x is downwind distance in km
 * 
 * Reference: Pasquill-Gifford parameterization (EPA recommended)
 */
export function getPasquillGiffordCoefficients(
  stabilityClass: string
): { sigma_y: { a: number; b: number }; sigma_z: { a: number; b: number } } {
  // Coefficients from EPA Guideline on Air Quality Models
  // sigma = a * x^b, where x is distance in km
  const coefficients: Record<
    string,
    { sigma_y: { a: number; b: number }; sigma_z: { a: number; b: number } }
  > = {
    A: {
      sigma_y: { a: 0.22, b: 0.894 },
      sigma_z: { a: 0.2, b: 0.894 },
    },
    B: {
      sigma_y: { a: 0.16, b: 0.894 },
      sigma_z: { a: 0.12, b: 0.894 },
    },
    C: {
      sigma_y: { a: 0.11, b: 0.894 },
      sigma_z: { a: 0.08, b: 0.894 },
    },
    D: {
      sigma_y: { a: 0.08, b: 0.894 },
      sigma_z: { a: 0.06, b: 0.894 },
    },
    E: {
      sigma_y: { a: 0.06, b: 0.894 },
      sigma_z: { a: 0.03, b: 0.894 },
    },
    F: {
      sigma_y: { a: 0.03, b: 0.894 },
      sigma_z: { a: 0.016, b: 0.894 },
    },
  };

  return coefficients[stabilityClass] || coefficients.D;
}
