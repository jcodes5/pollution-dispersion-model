import { RequestHandler } from "express";
import {
  SimulationParams,
  SimulationResponse,
  MeteoDataPoint,
} from "@shared/api";
import { runSimulation } from "../utils/gaussian-plume";
import { fetchForecast, generateMockForecast } from "../utils/open-meteo";
import { mapToStabilityClass } from "../utils/stability-mapping";
import { getCachedForecast, setCachedForecast } from "../utils/forecast-cache";

export const handleSimulate: RequestHandler = async (req, res) => {
  try {
    console.log("=== Simulation Request Started ===");
    const params = req.body as SimulationParams;

    console.log("Received simulation params:", params);

    // Validate input
    if (
      typeof params.latitude !== "number" ||
      typeof params.longitude !== "number" ||
      typeof params.emissionRate !== "number" ||
      typeof params.sourceHeight !== "number" ||
      typeof params.duration !== "number"
    ) {
      console.error("Invalid params:", {
        latitude: typeof params.latitude,
        longitude: typeof params.longitude,
        emissionRate: typeof params.emissionRate,
        sourceHeight: typeof params.sourceHeight,
        stabilityClass: typeof params.stabilityClass,
        duration: typeof params.duration,
      });
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

    // Validate latitude
    if (typeof params.latitude !== "number" || isNaN(params.latitude)) {
      return res.status(400).json({
        success: false,
        results: [],
        stats: {
          peakConcentration: 0,
          peakTime: "",
          peakHour: 0,
          averageConcentration: 0,
        },
        error: "Latitude must be a valid number",
      } as SimulationResponse);
    }

    if (params.latitude < -90 || params.latitude > 90) {
      return res.status(400).json({
        success: false,
        results: [],
        stats: {
          peakConcentration: 0,
          peakTime: "",
          peakHour: 0,
          averageConcentration: 0,
        },
        error: "Latitude must be between -90 and 90",
      } as SimulationResponse);
    }

    // Validate longitude
    if (typeof params.longitude !== "number" || isNaN(params.longitude)) {
      return res.status(400).json({
        success: false,
        results: [],
        stats: {
          peakConcentration: 0,
          peakTime: "",
          peakHour: 0,
          averageConcentration: 0,
        },
        error: "Longitude must be a valid number",
      } as SimulationResponse);
    }

    if (params.longitude < -180 || params.longitude > 180) {
      return res.status(400).json({
        success: false,
        results: [],
        stats: {
          peakConcentration: 0,
          peakTime: "",
          peakHour: 0,
          averageConcentration: 0,
        },
        error: "Longitude must be between -180 and 180",
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
      depositonVelocity = pollutantType === "PM10" ? 0.01 : 0.002;
    }

    const mixingHeight = params.mixingHeight || 500;
    const lossRate = params.lossRate || 0;

    // Fetch meteorological data
    let forecastData: MeteoDataPoint[];

    if (params.useAutoWeather) {
      console.log("Fetching auto weather data...");
      // Check cache first
      forecastData = getCachedForecast(params.latitude, params.longitude);

      if (!forecastData) {
        // Cache miss - fetch from API
        try {
          console.log("Cache miss, fetching from Open-Meteo API...");
          forecastData = await fetchForecast(
            params.latitude,
            params.longitude,
            params.duration,
          );
          console.log("Got forecast data, points:", forecastData.length);
          // Store in cache
          setCachedForecast(params.latitude, params.longitude, forecastData);
        } catch (error) {
          console.warn("Open-Meteo API failed, using mock data:", error);
          // Fall back to mock data
          forecastData = generateMockForecast(params.duration);
        }
      } else {
        console.log("Using cached forecast data");
      }
    } else {
      console.log("Using manual weather input");
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
          error: "Manual weather mode requires windSpeed and windDirection",
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
        params.hourlyWindOverrides.map((o) => [o.hour, o]),
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
      lossRate,
    );

    console.log("Simulation completed successfully");
    console.log("Results count:", simulation.results.length);
    console.log("Peak concentration:", simulation.stats.peakConcentration);

    return res.status(200).json({
      success: true,
      results: simulation.results,
      stats: simulation.stats,
    } as SimulationResponse);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Simulation error:", errorMessage);
    if (errorStack) {
      console.error("Stack trace:", errorStack);
    }
    console.error("Full error object:", error);

    return res.status(500).json({
      success: false,
      results: [],
      stats: {
        peakConcentration: 0,
        peakTime: "",
        peakHour: 0,
        averageConcentration: 0,
      },
      error: `Failed to run simulation: ${errorMessage}`,
    } as SimulationResponse);
  }
};
