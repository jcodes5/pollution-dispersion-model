import { DispersionResult, MeteoDataPoint } from "@shared/api";
import { getPasquillGiffordCoefficients } from "./stability-mapping";

/**
 * Enhanced Gaussian Plume Model Implementation
 * Features:
 * - Pasquill-Gifford dispersion parameters
 * - Coordinate frame conversion (wind direction to downwind/crosswind)
 * - PM deposition and decay model
 * - Multi-hour simulation with concentration decay
 */

interface GaussianParams {
  Q: number; // emission rate (g/s)
  u: number; // wind speed (m/s)
  H: number; // stack height (m)
  stabilityClass: string;
  latitude: number;
  longitude: number;
  windDirection: number; // degrees (0-360)
  depositionVelocity?: number; // m/s
  mixingHeight?: number; // m
  lossRate?: number; // 1/s
}

interface GridPoint {
  lat: number;
  lon: number;
  x: number; // downwind distance (m)
  y: number; // crosswind distance (m)
}

/**
 * Convert absolute coordinates to downwind/crosswind frame
 */
function convertToDownwindFrame(
  receiverLat: number,
  receiverLon: number,
  sourceLat: number,
  sourceLon: number,
  windDirection: number,
): { x: number; y: number } {
  // Simple distance calculation (Euclidean, valid for small distances)
  const deltaLat = (receiverLat - sourceLat) * 111000; // 1 degree lat ≈ 111 km
  const deltaLon =
    (receiverLon - sourceLon) * 111000 * Math.cos((sourceLat * Math.PI) / 180);

  // Convert wind direction to radians
  // Wind blows FROM wind direction, TO wind direction + 180
  const windAngleRad = ((windDirection + 180) * Math.PI) / 180;

  // Rotate coordinates so wind blows in +x direction
  const cos_a = Math.cos(windAngleRad);
  const sin_a = Math.sin(windAngleRad);

  const x = deltaLat * cos_a + deltaLon * sin_a;
  const y = -deltaLat * sin_a + deltaLon * cos_a;

  return { x, y };
}

/**
 * Calculate Pasquill-Gifford dispersion parameters (sigma_y and sigma_z)
 * Using polynomial form: sigma = a * x^b
 * where x is downwind distance in km
 */
function calculateDispersionParams(
  distance: number,
  stabilityClass: string,
): { sigma_y: number; sigma_z: number } {
  const coeffs = getPasquillGiffordCoefficients(stabilityClass);

  // Convert distance from meters to km
  const distanceKm = Math.max(distance / 1000, 0.001);

  // Calculate sigma values using polynomial fit
  const sigma_y = coeffs.sigma_y.a * Math.pow(distanceKm, coeffs.sigma_y.b);
  const sigma_z = coeffs.sigma_z.a * Math.pow(distanceKm, coeffs.sigma_z.b);

  // Ensure minimum values
  return {
    sigma_y: Math.max(sigma_y, 0.5),
    sigma_z: Math.max(sigma_z, 0.5),
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
  params: GaussianParams,
): number {
  const { Q, u, H, stabilityClass } = params;

  // Only calculate for downwind distances
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
 * Apply concentration decay due to deposition and chemical loss
 * Model: C_t = C_0 * exp(-(v_dep / H_mixing + k_loss) * t)
 */
function applyDecay(
  concentration: number,
  timeSeconds: number,
  depositionVelocity: number = 0.002,
  mixingHeight: number = 500,
  lossRate: number = 0,
): number {
  const decayRate = depositionVelocity / mixingHeight + lossRate;
  return concentration * Math.exp(-decayRate * timeSeconds);
}

/**
 * Generate a 2D concentration grid for visualization
 */
export function generateConcentrationGrid(
  gridSize: number,
  gridSpacing: number,
  params: GaussianParams,
  sourceLat: number,
  sourceLon: number,
  receptorHeight: number = 1.5,
): {
  grid: number[][];
  x_points: number[];
  y_points: number[];
  maxConcentration: number;
} {
  const half = gridSize / 2;
  const x_points = [];
  const y_points = [];

  // Generate grid points
  for (let i = 0; i <= gridSize; i++) {
    x_points.push(i * gridSpacing);
    y_points.push((i - half) * gridSpacing);
  }

  const grid: number[][] = [];
  let maxConcentration = 0;

  // Calculate concentration at each grid point
  for (let i = 0; i <= gridSize; i++) {
    const row: number[] = [];
    for (let j = 0; j <= gridSize; j++) {
      const x = x_points[j];
      const y = y_points[i];

      const concentration = calculateConcentration(
        x,
        y,
        receptorHeight,
        params,
      );
      row.push(concentration);
      maxConcentration = Math.max(maxConcentration, concentration);
    }
    grid.push(row);
  }

  return { grid, x_points, y_points, maxConcentration };
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
  longitude: number,
  gridSize: number = 40,
  gridSpacing: number = 100,
  receptorHeight: number = 1.5,
  depositionVelocity: number = 0.002,
  mixingHeight: number = 500,
  lossRate: number = 0,
): DispersionResult {
  const params: GaussianParams = {
    Q: emissionRate,
    u: meteoData.windSpeed,
    H: sourceHeight,
    stabilityClass,
    latitude,
    longitude,
    windDirection: meteoData.windDirection,
    depositionVelocity,
    mixingHeight,
    lossRate,
  };

  // Generate concentration grid
  const { grid, x_points, y_points, maxConcentration } =
    generateConcentrationGrid(
      gridSize,
      gridSpacing,
      params,
      latitude,
      longitude,
      receptorHeight,
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
 * Applies decay model to simulate concentration decrease over time
 */
export function runSimulation(
  forecastData: MeteoDataPoint[],
  emissionRate: number,
  sourceHeight: number,
  stabilityClass: string,
  latitude: number,
  longitude: number,
  gridSize: number = 40,
  gridSpacing: number = 100,
  receptorHeight: number = 1.5,
  depositionVelocity: number = 0.002,
  mixingHeight: number = 500,
  lossRate: number = 0,
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

  // Time tracking for decay calculation
  let cumulativeTime = 0;
  const timeStepSeconds = 3600; // 1 hour

  forecastData.forEach((meteoPoint, index) => {
    const result = simulateTimeStep(
      meteoPoint,
      emissionRate,
      sourceHeight,
      stabilityClass,
      latitude,
      longitude,
      gridSize,
      gridSpacing,
      receptorHeight,
      depositionVelocity,
      mixingHeight,
      lossRate,
    );

    // Apply decay to concentration
    const decayedConcentration = applyDecay(
      result.maxConcentration,
      cumulativeTime,
      depositionVelocity,
      mixingHeight,
      lossRate,
    );

    result.hour = index;
    result.maxConcentration = decayedConcentration;

    // Apply decay to entire grid as well
    result.concentrationGrid = result.concentrationGrid.map((row) =>
      row.map(
        (c) =>
          applyDecay(
            c,
            cumulativeTime,
            depositionVelocity,
            mixingHeight,
            lossRate,
          ) * c, // Apply proportional decay
      ),
    );

    results.push(result);
    concentrations.push(decayedConcentration);

    if (decayedConcentration > peakConcentration) {
      peakConcentration = decayedConcentration;
      peakTime = result.time;
      peakHour = index;
    }

    cumulativeTime += timeStepSeconds;
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
