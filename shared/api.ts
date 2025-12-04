/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Meteorological data point from forecast
 */
export interface MeteoDataPoint {
  time: string;
  windSpeed: number;
  windDirection: number;
  temperature: number;
}

/**
 * Forecast response from /api/forecast
 */
export interface ForecastRequest {
  latitude: number;
  longitude: number;
  hours: number;
}

export interface ForecastResponse {
  success: boolean;
  data: MeteoDataPoint[];
  location: { lat: number; lon: number };
  error?: string;
}

/**
 * Dispersion result for a single time step
 */
export interface DispersionResult {
  time: string;
  hour: number;
  maxConcentration: number;
  concentrationGrid: number[][];
  gridPoints: { x: number[]; y: number[] };
  windSpeed: number;
  windDirection: number;
}

/**
 * Hourly wind override for manual control
 */
export interface HourlyWindOverride {
  hour: number;
  windSpeed: number;
  windDirection: number;
}

/**
 * Enhanced simulation parameters request
 */
export interface SimulationParams {
  latitude: number;
  longitude: number;
  emissionRate: number;
  sourceHeight: number;
  stabilityClass?: string; // Optional if auto-mapping is enabled
  windSpeed?: number;
  windDirection?: number;
  stackDiameter?: number;
  exitVelocity?: number;
  duration: number;
  useAutoWeather: boolean;
  autoMapStability?: boolean;
  pollutantType: 'PM2.5' | 'PM10';
  receptorHeight?: number;
  gridSize?: 20 | 30 | 40 | 50;
  depositionVelocity?: number;
  mixingHeight?: number;
  lossRate?: number;
  hourlyWindOverrides?: HourlyWindOverride[];
}

/**
 * Simulation response from /api/simulate
 */
export interface SimulationResponse {
  success: boolean;
  results: DispersionResult[];
  stats: {
    peakConcentration: number;
    peakTime: string;
    peakHour: number;
    averageConcentration: number;
  };
  error?: string;
}

/**
 * Concentration at specific point
 */
export interface ConcentrationPoint {
  x: number;
  y: number;
  concentration: number;
  time: string;
}
