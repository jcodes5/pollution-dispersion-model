import { DispersionResult, MeteoDataPoint } from "@shared/api";

/**
 * Gaussian Plume Model Implementation
 * Based on EPA's Gaussian Plume Model
 */

// Stability class parameters for dispersion
const STABILITY_PARAMS: Record<string, { ay: number; az: number }> = {
  A: { ay: 0.22, az: 0.2 },
  B: { ay: 0.16, az: 0.12 },
  C: { ay: 0.11, az: 0.08 },
  D: { ay: 0.08, az: 0.06 },
  E: { ay: 0.06, az: 0.03 },
  F: { ay: 0.03, az: 0.016 },
};

interface GaussianParams {
  Q: number; // emission rate (g/s)
  u: number; // wind speed (m/s)
  H: number; // stack height (m)
  stabilityClass: string;
  latitude: number;
  longitude: number;
}

/**
 * Calculate dispersion parameters (sigma_y and sigma_z) based on downwind distance
 * Using Pasquill-Gifford parameters
 */
function calculateDispersionParams(
  distance: number,
  stabilityClass: string
): { sigma_y: number; sigma_z: number } {
  const params = STABILITY_PARAMS[stabilityClass] || STABILITY_PARAMS.D;

  // Pasquill-Gifford dispersion parameters
  // sigma values in meters for given downwind distance in km
  const distanceKm = distance / 1000;

  // Simplified empirical formulas for sigma_y and sigma_z
  const sigma_y = params.ay * distanceKm * 1000;
  const sigma_z = params.az * distanceKm * 1000;

  // Ensure minimum values
  return {
    sigma_y: Math.max(sigma_y, 1),
    sigma_z: Math.max(sigma_z, 1),
  };
}

/**
 * Calculate concentration at a specific point using Gaussian plume formula
 * C(x,y,z) = (Q / (2πuσyσz)) × exp(−y² / (2σy²)) × [exp(−(z−H)² / (2σz²)) + exp(−(z+H)² / (2σz²))]
 */
function calculateConcentration(
  x: number,
  y: number,
  z: number,
  params: GaussianParams
): number {
  const { Q, u, H, stabilityClass } = params;

  // Avoid division by zero
  if (u < 0.1 || x < 1) return 0;

  const { sigma_y, sigma_z } = calculateDispersionParams(x, stabilityClass);

  // Main Gaussian plume formula
  const y_term = Math.exp(-Math.pow(y, 2) / (2 * Math.pow(sigma_y, 2)));

  const z_term1 = Math.exp(-Math.pow(z - H, 2) / (2 * Math.pow(sigma_z, 2)));
  const z_term2 = Math.exp(-Math.pow(z + H, 2) / (2 * Math.pow(sigma_z, 2)));
  const z_term = z_term1 + z_term2;

  const denominator = 2 * Math.PI * u * sigma_y * sigma_z;
  const concentration = (Q / denominator) * y_term * z_term;

  return Math.max(concentration, 0);
}

/**
 * Generate a 2D concentration grid for visualization
 */
export function generateConcentrationGrid(
  gridSize: number,
  gridSpacing: number,
  params: GaussianParams,
  receptorHeight: number = 1.5 // breathing height
): {
  grid: number[][];
  x_points: number[];
  y_points: number[];
  maxConcentration: number;
} {
  const half = gridSize / 2;
  const x_points = [];
  const y_points = [];

  for (let i = 0; i <= gridSize; i++) {
    x_points.push(i * gridSpacing);
    y_points.push((i - half) * gridSpacing);
  }

  const grid: number[][] = [];
  let maxConcentration = 0;

  for (let i = 0; i <= gridSize; i++) {
    const row: number[] = [];
    for (let j = 0; j <= gridSize; j++) {
      const x = x_points[j];
      const y = y_points[i];

      const concentration = calculateConcentration(
        x,
        y,
        receptorHeight,
        params
      );
      row.push(concentration);
      maxConcentration = Math.max(maxConcentration, concentration);
    }
    grid.push(row);
  }

  return { grid, x_points, y_points, maxConcentration };
}

/**
 * Rotate coordinates based on wind direction
 */
function rotateCoordinates(
  x: number,
  y: number,
  windDirection: number
): { rotated_x: number; rotated_y: number } {
  // Wind direction is in degrees, convert to radians
  // Wind direction 0° = North, 90° = East, etc.
  // Plume extends downwind, so we rotate by (wind_direction - 90°)
  const angle = ((windDirection - 90) * Math.PI) / 180;

  const cos_a = Math.cos(angle);
  const sin_a = Math.sin(angle);

  const rotated_x = x * cos_a - y * sin_a;
  const rotated_y = x * sin_a + y * cos_a;

  return { rotated_x, rotated_y };
}

/**
 * Run a single simulation timestep
 */
export function simulateTimeStep(
  meteoData: MeteoDataPoint,
  emissionRate: number,
  sourceHeight: number,
  stabilityClass: string,
  latitude: number,
  longitude: number
): DispersionResult {
  const params: GaussianParams = {
    Q: emissionRate,
    u: meteoData.windSpeed,
    H: sourceHeight,
    stabilityClass,
    latitude,
    longitude,
  };

  // Generate concentration grid
  const gridConfig = {
    gridSize: 50,
    gridSpacing: 100, // 100m spacing
  };

  const { grid, x_points, y_points, maxConcentration } =
    generateConcentrationGrid(
      gridConfig.gridSize,
      gridConfig.gridSpacing,
      params
    );

  return {
    time: meteoData.time,
    hour: 0,
    maxConcentration,
    concentrationGrid: grid,
    gridPoints: { x: x_points, y: y_points },
    windSpeed: meteoData.windSpeed,
    windDirection: meteoData.windDirection,
  };
}

/**
 * Run complete simulation across multiple timesteps
 */
export function runSimulation(
  forecastData: MeteoDataPoint[],
  emissionRate: number,
  sourceHeight: number,
  stabilityClass: string,
  latitude: number,
  longitude: number
): {
  results: DispersionResult[];
  stats: {
    peakConcentration: number;
    peakTime: string;
    peakHour: number;
    averageConcentration: number;
  };
} {
  const results: DispersionResult[] = [];
  let peakConcentration = 0;
  let peakTime = "";
  let peakHour = 0;
  const concentrations: number[] = [];

  forecastData.forEach((meteoPoint, index) => {
    const result = simulateTimeStep(
      meteoPoint,
      emissionRate,
      sourceHeight,
      stabilityClass,
      latitude,
      longitude
    );

    result.hour = index;
    results.push(result);
    concentrations.push(result.maxConcentration);

    if (result.maxConcentration > peakConcentration) {
      peakConcentration = result.maxConcentration;
      peakTime = result.time;
      peakHour = index;
    }
  });

  const averageConcentration =
    concentrations.reduce((a, b) => a + b, 0) / concentrations.length;

  return {
    results,
    stats: {
      peakConcentration,
      peakTime,
      peakHour,
      averageConcentration,
    },
  };
}
