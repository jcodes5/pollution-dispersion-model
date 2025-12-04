import { RequestHandler } from "express";
import { SimulationParams, SimulationResponse, MeteoDataPoint } from "@shared/api";
import { runSimulation } from "../utils/gaussian-plume";
import { fetchForecast, generateMockForecast } from "../utils/open-meteo";

export const handleSimulate: RequestHandler = async (req, res) => {
  try {
    const params = req.body as SimulationParams;

    // Validate input
    if (
      typeof params.latitude !== "number" ||
      typeof params.longitude !== "number" ||
      typeof params.emissionRate !== "number" ||
      typeof params.sourceHeight !== "number" ||
      typeof params.stabilityClass !== "string" ||
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

    const validStabilityClasses = ["A", "B", "C", "D", "E", "F"];
    if (!validStabilityClasses.includes(params.stabilityClass)) {
      return res.status(400).json({
        success: false,
        results: [],
        stats: {
          peakConcentration: 0,
          peakTime: "",
          peakHour: 0,
          averageConcentration: 0,
        },
        error: "Stability class must be A, B, C, D, E, or F",
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

    // Fetch meteorological data
    let forecastData: MeteoDataPoint[];

    if (params.useAutoWeather) {
      // Fetch from Open-Meteo
      try {
        forecastData = await fetchForecast(
          params.latitude,
          params.longitude,
          params.duration
        );
      } catch (error) {
        console.warn("Open-Meteo API failed, using mock data:", error);
        // Fall back to mock data
        forecastData = generateMockForecast(params.duration);
      }
    } else {
      // Use manual wind input
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

    // Run simulation
    const simulation = runSimulation(
      forecastData,
      params.emissionRate,
      params.sourceHeight,
      params.stabilityClass,
      params.latitude,
      params.longitude
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
