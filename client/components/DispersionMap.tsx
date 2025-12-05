import { useEffect, useRef, useState } from "react";
import { DispersionResult } from "@shared/api";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import L from "leaflet";

interface DispersionMapProps {
  results: DispersionResult[];
  latitude: number;
  longitude: number;
  isLoading: boolean;
}

// Fix leaflet default icon issue
const DefaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.setIcon(DefaultIcon);

export default function DispersionMap({
  results,
  latitude,
  longitude,
  isLoading,
}: DispersionMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const heatmapLayerRef = useRef<L.CanvasLayer | null>(null);
  const sourceMarkerRef = useRef<L.Marker | null>(null);
  const windArrowsRef = useRef<L.Polyline[]>([]);

  // Load Leaflet CSS
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current).setView(
      [latitude, longitude],
      10
    );

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '© OpenStreetMap contributors',
        maxZoom: 19,
      }
    ).addTo(map.current);

    // Add source marker
    sourceMarkerRef.current = L.marker(
      [latitude, longitude],
      {
        title: "Emission Source",
        icon: L.icon({
          iconUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="hsl(var(--primary))"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        }),
      }
    )
      .bindPopup("Emission Source")
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude]);

  // Auto-play animation
  useEffect(() => {
    if (!isPlaying || results.length === 0) return;

    const interval = setInterval(() => {
      setCurrentTimeIndex((prev) => {
        const next = prev + 1;
        if (next >= results.length) {
          setIsPlaying(false);
          return prev;
        }
        return next;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying, results.length]);

  // Update heatmap
  useEffect(() => {
    if (!map.current || results.length === 0) return;

    const result = results[currentTimeIndex];

    // Remove old heatmap layer
    if (heatmapLayerRef.current) {
      map.current.removeLayer(heatmapLayerRef.current);
    }

    // Create heatmap data from grid
    const maxValue = Math.max(
      ...results.map((r) => r.maxConcentration)
    );

    const gridSize = result.gridPoints.x.length;
    const heatmapData: Array<[number, number, number]> = [];

    // Calculate grid cell bounds
    const xPoints = result.gridPoints.x;
    const yPoints = result.gridPoints.y;

    const metersPerDegreeLat = 111000;
    const metersPerDegreeLon = 111000 * Math.cos((latitude * Math.PI) / 180);

    for (let i = 0; i < result.concentrationGrid.length; i++) {
      for (let j = 0; j < result.concentrationGrid[i].length; j++) {
        const concentration = result.concentrationGrid[i][j];
        const normalized = Math.min(concentration / maxValue, 1);

        // Convert grid coordinates back to lat/lon
        const x = xPoints[j];
        const y = yPoints[i];

        const receiverLat = latitude + (x / metersPerDegreeLat);
        const receiverLon = longitude + (y / metersPerDegreeLon);

        // Only add significant concentrations to heatmap
        if (concentration > maxValue * 0.05) {
          heatmapData.push([receiverLat, receiverLon, normalized]);
        }
      }
    }

    // Create custom heatmap layer using canvas
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Draw gradient circles for each data point
      heatmapData.forEach(([lat, lon, value]) => {
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        const color = getColorForValue(value);

        gradient.addColorStop(0, `${color}80`);
        gradient.addColorStop(1, `${color}00`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
      });
    }

    // Add custom overlay
    const imageUrl = canvas.toDataURL();
    const imageBounds: L.LatLngBoundsExpression = [
      [latitude - 0.05, longitude - 0.05],
      [latitude + 0.05, longitude + 0.05],
    ];

    const imageOverlay = L.imageOverlay(imageUrl, imageBounds, {
      opacity: 0.6,
    });

    imageOverlay.addTo(map.current);
    heatmapLayerRef.current = imageOverlay as any;

    // Clear old wind arrows
    windArrowsRef.current.forEach((arrow) => map.current?.removeLayer(arrow));
    windArrowsRef.current = [];

    // Add wind direction arrow
    const windAngle = ((result.windDirection + 180) * Math.PI) / 180;
    const arrowLength = 0.02; // degrees

    const endLat = latitude + Math.cos(windAngle) * arrowLength;
    const endLon = longitude + Math.sin(windAngle) * arrowLength;

    const arrowLine = L.polyline(
      [
        [latitude, longitude],
        [endLat, endLon],
      ],
      {
        color: "hsl(var(--primary))",
        weight: 3,
        opacity: 0.8,
        dashArray: "5, 5",
      }
    ).addTo(map.current);

    windArrowsRef.current.push(arrowLine);
  }, [results, currentTimeIndex, latitude, longitude]);

  function getColorForValue(value: number): string {
    if (value < 0.2) return "#90ee90"; // Light green
    if (value < 0.4) return "#ffee00"; // Yellow
    if (value < 0.7) return "#ff8400"; // Orange
    if (value < 0.9) return "#ff0000"; // Red
    return "#8b0000"; // Dark red
  }

  if (results.length === 0) {
    return (
      <Card className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-muted-foreground">
            {isLoading
              ? "Running simulation..."
              : "Run a simulation to view the map"}
          </p>
        </div>
      </Card>
    );
  }

  const currentResult = results[currentTimeIndex];

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          Dispersion Map
        </h2>

        {/* Map Container */}
        <div
          ref={mapContainer}
          className="border border-border rounded-lg overflow-hidden"
          style={{ height: "500px" }}
        />

        {/* Color Legend */}
        <div className="grid grid-cols-5 gap-1 p-2 bg-muted/30 rounded">
          <div className="flex flex-col items-center">
            <div className="w-full h-6 rounded" style={{ background: "#90ee90" }} />
            <span className="text-xs mt-1 text-muted-foreground">Low</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-6 rounded" style={{ background: "#ffee00" }} />
            <span className="text-xs mt-1 text-muted-foreground">Moderate</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-6 rounded" style={{ background: "#ff8400" }} />
            <span className="text-xs mt-1 text-muted-foreground">Elevated</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-6 rounded" style={{ background: "#ff0000" }} />
            <span className="text-xs mt-1 text-muted-foreground">High</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-6 rounded" style={{ background: "#8b0000" }} />
            <span className="text-xs mt-1 text-muted-foreground">Critical</span>
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-foreground">
              Hour {currentTimeIndex + 1} of {results.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {new Date(currentResult.time).toLocaleString()}
            </span>
          </div>
          <Slider
            value={[currentTimeIndex]}
            onValueChange={(value) => setCurrentTimeIndex(value[0])}
            min={0}
            max={results.length - 1}
            step={1}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentTimeIndex(0)}
            disabled={isLoading || results.length === 0}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={isLoading || results.length === 0}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Play
              </>
            )}
          </Button>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded text-sm">
          <div>
            <span className="text-muted-foreground">Wind Speed:</span>
            <span className="ml-2 font-semibold text-foreground">
              {currentResult.windSpeed.toFixed(2)} m/s
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Wind Dir:</span>
            <span className="ml-2 font-semibold text-foreground">
              {currentResult.windDirection.toFixed(0)}°
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Max Conc:</span>
            <span className="ml-2 font-semibold text-foreground">
              {currentResult.maxConcentration.toFixed(4)} µg/m³
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Location:</span>
            <span className="ml-2 font-semibold text-foreground text-xs">
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
