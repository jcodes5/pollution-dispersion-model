import { RequestHandler } from "express";
import {
  SimulationParams,
  SimulationResponse,
  MeteoDataPoint,
} from "@shared/api";
import { runSimulation } from "../utils/gaussian-plume";
import {
  fetchForecast,
  generateMockForecast,
} from "../utils/open-meteo";
import { mapToStabilityClass } from "../utils/stability-mapping";
import {
  getCachedForecast,
  setCachedForecast,
} from "../utils/forecast-cache";

export const handleSimulate: RequestHandler = async (req, res) => {
  try {
    const params = req.body as SimulationParams;

    // Validate input
    if (
      typeof params.latitude !== "number" ||
      typeof params.longitude !== "number" ||
      typeof params.emissionRate !== "number" ||
      typeof params.sourceHeight !== "number" ||
      typeof params.duration !== "number"
    ) {
      return res.status(400).json({
        success: false,
        results: [],
        stats: {
          peakConcentration: 0,
          peakTime: "",
          peakHour: 0,
          averageConcentration: 0,
        },
        error: "Missing required simulation parameters",
      } as SimulationResponse);
    }

    // Validate parameters
    if (params.emissionRate < 0) {
      return res.status(400).json({
        success: false,
        results: [],
        stats: {
          peakConcentration: 0,
          peakTime: "",
          peakHour: 0,
          averageConcentration: 0,
        },
        error: "Emission rate must be non-negative",
      } as SimulationResponse);
    }

    if (params.sourceHeight < 0) {
      return res.status(400).json({
        success: false,
        results: [],
        stats: {
          peakConcentration: 0,
          peakTime: "",
          peakHour: 0,
          averageConcentration: 0,
        },
        error: "Source height must be non-negative",
      } as SimulationResponse);
    }

    if (params.duration < 1 || params.duration > 168) {
      return res.status(400).json({
        success: false,
        results: [],
        stats: {
          peakConcentration: 0,
          peakTime: "",
          peakHour: 0,
          averageConcentration: 0,
        },
        error: "Duration must be between 1 and 168 hours",
      } as SimulationResponse);
    }

    const pollutantType = params.pollutantType || "PM2.5";
    const receptorHeight = params.receptorHeight || 1.5;
    const gridSize = params.gridSize || 40;
    const gridSpacing = params.gridSize ? 5000 / params.gridSize : 100;

    // Get deposition velocity based on pollutant type and user override
    let depositonVelocity = params.depositionVelocity;
    if (!depositonVelocity) {
      depositonVelocity =
        pollutantType === "PM10" ? 0.01 : 0.002;
    }

    const mixingHeight = params.mixingHeight || 500;
    const lossRate = params.lossRate || 0;

    // Fetch meteorological data
    let forecastData: MeteoDataPoint[];

    if (params.useAutoWeather) {
      // Check cache first
      forecastData = getCachedForecast(params.latitude, params.longitude);

      if (!forecastData) {
        // Cache miss - fetch from API
        try {
          forecastData = await fetchForecast(
            params.latitude,
            params.longitude,
            params.duration
          );
          // Store in cache
          setCachedForecast(params.latitude, params.longitude, forecastData);
        } catch (error) {
          console.warn("Open-Meteo API failed, using mock data:", error);
          // Fall back to mock data
          forecastData = generateMockForecast(params.duration);
        }
      }
    } else {
      // Use manual wind input or override
      if (
        typeof params.windSpeed !== "number" ||
        typeof params.windDirection !== "number"
      ) {
        return res.status(400).json({
          success: false,
          results: [],
          stats: {
            peakConcentration: 0,
            peakTime: "",
            peakHour: 0,
            averageConcentration: 0,
          },
          error:
            "Manual weather mode requires windSpeed and windDirection",
        } as SimulationResponse);
      }

      // Generate constant wind forecast
      forecastData = [];
      const now = new Date();
      for (let i = 0; i < params.duration; i++) {
        const time = new Date(now.getTime() + i * 3600000);
        forecastData.push({
          time: time.toISOString(),
          windSpeed: params.windSpeed,
          windDirection: params.windDirection,
          temperature: 15,
        });
      }
    }

    // Apply hourly wind overrides if provided
    if (params.hourlyWindOverrides && params.hourlyWindOverrides.length > 0) {
      const overrideMap = new Map(
        params.hourlyWindOverrides.map((o) => [o.hour, o])
      );
      forecastData = forecastData.map((data, index) => {
        const override = overrideMap.get(index);
        if (override) {
          return {
            ...data,
            windSpeed: override.windSpeed,
            windDirection: override.windDirection,
          };
        }
        return data;
      });
    }

    // Determine stability class
    let stabilityClass = params.stabilityClass || "D";

    if (params.autoMapStability) {
      // Auto-map stability class based on meteorological conditions
      stabilityClass = mapToStabilityClass({
        hour: new Date(forecastData[0].time).getUTCHours(),
        windSpeed: forecastData[0].windSpeed,
        cloudCover: 50, // Default if not available
      }).class;
    }

    // Run simulation
    const simulation = runSimulation(
      forecastData,
      params.emissionRate,
      params.sourceHeight,
      stabilityClass,
      params.latitude,
      params.longitude,
      gridSize,
      gridSpacing,
      receptorHeight,
      depositonVelocity,
      mixingHeight,
      lossRate
    );

    return res.status(200).json({
      success: true,
      results: simulation.results,
      stats: simulation.stats,
    } as SimulationResponse);
  } catch (error) {
    console.error("Simulation error:", error);
    return res.status(500).json({
      success: false,
      results: [],
      stats: {
        peakConcentration: 0,
        peakTime: "",
        peakHour: 0,
        averageConcentration: 0,
      },
      error: "Failed to run simulation",
    } as SimulationResponse);
  }
};
