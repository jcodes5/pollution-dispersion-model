import { RequestHandler } from "express";
import { ForecastResponse, ForecastRequest } from "@shared/api";
import { fetchForecast, generateMockForecast } from "../utils/open-meteo";
import {
  getCachedForecast,
  setCachedForecast,
  getCacheStats,
} from "../utils/forecast-cache";

export const handleForecast: RequestHandler = async (req, res) => {
  try {
    const { latitude, longitude, hours } = req.body as ForecastRequest;

    // Validate input
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      typeof hours !== "number"
    ) {
      return res.status(400).json({
        success: false,
        data: [],
        location: { lat: 0, lon: 0 },
        error: "Missing or invalid parameters: latitude, longitude, hours",
      } as ForecastResponse);
    }

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        data: [],
        location: { lat: 0, lon: 0 },
        error: "Latitude must be between -90 and 90",
      } as ForecastResponse);
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        data: [],
        location: { lat: 0, lon: 0 },
        error: "Longitude must be between -180 and 180",
      } as ForecastResponse);
    }

    if (hours < 1 || hours > 168) {
      return res.status(400).json({
        success: false,
        data: [],
        location: { lat: 0, lon: 0 },
        error: "Hours must be between 1 and 168",
      } as ForecastResponse);
    }

    // Check cache first
    let forecastData = getCachedForecast(latitude, longitude);

    if (forecastData) {
      console.log(
        `Forecast cache hit for {${latitude},${longitude}} - ${getCacheStats().entries} entries in cache`
      );
      return res.status(200).json({
        success: true,
        data: forecastData.slice(0, hours),
        location: { lat: latitude, lon: longitude },
      } as ForecastResponse);
    }

    // Cache miss - fetch from API
    try {
      forecastData = await fetchForecast(latitude, longitude, hours);
      // Store in cache
      setCachedForecast(latitude, longitude, forecastData);
      console.log(`Forecast cache miss for {${latitude},${longitude}}`);
    } catch (error) {
      console.warn("Open-Meteo API failed, using mock data:", error);
      // Fall back to mock data if API fails
      forecastData = generateMockForecast(hours);
    }

    return res.status(200).json({
      success: true,
      data: forecastData,
      location: { lat: latitude, lon: longitude },
    } as ForecastResponse);
  } catch (error) {
    console.error("Forecast error:", error);
    return res.status(500).json({
      success: false,
      data: [],
      location: { lat: 0, lon: 0 },
      error: "Failed to fetch forecast data",
    } as ForecastResponse);
  }
};
