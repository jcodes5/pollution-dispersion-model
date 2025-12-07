import { useEffect, useRef, useState } from "react";
import { DispersionResult } from "@shared/api";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Download } from "lucide-react";
import html2canvas from "html2canvas";

interface DispersionVisualizationProps {
  results: DispersionResult[];
  isLoading: boolean;
}

export default function DispersionVisualization({
  results,
  isLoading,
}: DispersionVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [maxValue, setMaxValue] = useState(1);
  const [isExportingGif, setIsExportingGif] = useState(false);

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
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, results.length]);

  // Find max concentration for color scaling
  useEffect(() => {
    if (results.length === 0) return;
    const max = Math.max(...results.map((r) => r.maxConcentration));
    setMaxValue(Math.max(max, 1));
  }, [results]);

  // Render canvas
  useEffect(() => {
    if (!canvasRef.current || results.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const result = results[currentTimeIndex];
    const grid = result.concentrationGrid;
    const xPoints = result.gridPoints.x;
    const yPoints = result.gridPoints.y;

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    const cellWidth = canvas.width / (xPoints.length - 1);
    const cellHeight = canvas.height / (yPoints.length - 1);

    // Render heatmap
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const value = grid[i][j];
        const normalized = Math.min(value / maxValue, 1);
        const color = getColorForValue(normalized);

        const x = j * cellWidth;
        const y = i * cellHeight;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellWidth, cellHeight);
      }
    }

    // Draw border
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw source point (center-left)
    const sourceX = canvas.width * 0.05;
    const sourceY = canvas.height / 2;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(sourceX, sourceY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw wind direction arrow
    const windAngle = ((result.windDirection - 90) * Math.PI) / 180;
    const arrowLength = 60;
    const arrowX = sourceX + Math.cos(windAngle) * arrowLength;
    const arrowY = sourceY + Math.sin(windAngle) * arrowLength;

    ctx.strokeStyle = "#0066cc";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sourceX, sourceY);
    ctx.lineTo(arrowX, arrowY);
    ctx.stroke();

    // Draw arrowhead
    const arrowSize = 10;
    const angle1 = windAngle + (5 * Math.PI) / 6;
    const angle2 = windAngle - (5 * Math.PI) / 6;

    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
      arrowX + arrowSize * Math.cos(angle1),
      arrowY + arrowSize * Math.sin(angle1),
    );
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
      arrowX + arrowSize * Math.cos(angle2),
      arrowY + arrowSize * Math.sin(angle2),
    );
    ctx.stroke();
  }, [results, currentTimeIndex, maxValue]);

  // Convert normalized value (0-1) to color
  function getColorForValue(value: number): string {
    // Green -> Yellow -> Orange -> Red -> Dark Red
    if (value < 0.2) {
      // Green to Yellow
      const t = value / 0.2;
      const r = Math.round(144 + (255 - 144) * t);
      const g = 238;
      const b = Math.round(144 - 144 * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (value < 0.4) {
      // Yellow to Orange
      const t = (value - 0.2) / 0.2;
      const r = 255;
      const g = Math.round(238 - 106 * t);
      const b = 0;
      return `rgb(${r}, ${g}, ${b})`;
    } else if (value < 0.7) {
      // Orange to Red
      const t = (value - 0.4) / 0.3;
      const r = 255;
      const g = Math.round(132 - 132 * t);
      const b = 0;
      return `rgb(${r}, ${g}, ${b})`;
    } else if (value < 0.9) {
      // Red to Dark Red
      const t = (value - 0.7) / 0.2;
      const r = 255;
      const g = Math.round(0);
      const b = 0;
      return `rgb(${Math.round(255 - 75 * t)}, ${g}, ${b})`;
    } else {
      // Dark Red
      return "rgb(139, 0, 0)";
    }
  }

  // Export visualization as PNG (current frame)
  const exportAsImage = async () => {
    if (!canvasRef.current || results.length === 0) return;

    try {
      const canvas = canvasRef.current;
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `dispersion-frame-${currentTimeIndex + 1}-${new Date().toISOString().split("T")[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting image:", error);
    }
  };

  // Export all frames as ZIP with PNG images (simplified alternative to GIF)
  const exportAsFrames = async () => {
    if (results.length === 0) return;

    setIsExportingGif(true);
    try {
      // Dynamically import jszip for creating ZIP files
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const framesFolder = zip.folder("frames");

      if (!framesFolder) {
        throw new Error("Failed to create frames folder in ZIP");
      }

      // Generate frames
      for (let i = 0; i < results.length; i++) {
        const canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;

        const result = results[i];
        const grid = result.concentrationGrid;
        const xPoints = result.gridPoints.x;
        const yPoints = result.gridPoints.y;

        // Clear canvas
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        const cellWidth = canvas.width / (xPoints.length - 1);
        const cellHeight = canvas.height / (yPoints.length - 1);

        // Render heatmap
        for (let row = 0; row < grid.length; row++) {
          for (let col = 0; col < grid[row].length; col++) {
            const value = grid[row][col];
            const normalized = Math.min(value / maxValue, 1);
            const color = getColorForValue(normalized);

            const x = col * cellWidth;
            const y = row * cellHeight;

            ctx.fillStyle = color;
            ctx.fillRect(x, y, cellWidth, cellHeight);
          }
        }

        // Add border
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Add info text
        ctx.fillStyle = "#000";
        ctx.font = "bold 14px Arial";
        ctx.fillText(`Hour ${i + 1} of ${results.length}`, 10, 25);
        ctx.font = "12px Arial";
        ctx.fillText(
          `Wind: ${result.windSpeed.toFixed(2)} m/s @ ${result.windDirection.toFixed(1)}°`,
          10,
          40,
        );
        ctx.fillText(
          `Max Concentration: ${result.maxConcentration.toFixed(4)} g/m³`,
          10,
          55,
        );

        // Convert canvas to blob and add to ZIP
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b || new Blob()), "image/png");
        });

        framesFolder.file(`frame-${String(i + 1).padStart(3, "0")}.png`, blob);
      }

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dispersion-frames-${new Date().toISOString().split("T")[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExportingGif(false);
    } catch (error) {
      console.error("Error exporting frames:", error);
      setIsExportingGif(false);
    }
  };

  if (!results.length || isLoading) {
    return (
      <Card className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-muted-foreground">
            {isLoading
              ? "Running simulation..."
              : "Run a simulation to view results"}
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
          Dispersion Visualization
        </h2>

        {/* Canvas */}
        <div className="border border-border rounded-lg overflow-hidden bg-white">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full max-w-full h-auto"
            style={{ aspectRatio: '600 / 400' }}
          />
        </div>

        {/* Color Legend */}
        <div className="grid grid-cols-5 gap-1 p-2 bg-muted/30 rounded">
          <div className="flex flex-col items-center">
            <div
              className="w-full h-6 rounded"
              style={{ background: "rgb(144, 238, 144)" }}
            />
            <span className="text-xs mt-1 text-muted-foreground">Low</span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-full h-6 rounded"
              style={{ background: "rgb(255, 238, 0)" }}
            />
            <span className="text-xs mt-1 text-muted-foreground">Mod</span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-full h-6 rounded"
              style={{ background: "rgb(255, 132, 0)" }}
            />
            <span className="text-xs mt-1 text-muted-foreground">Elev</span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-full h-6 rounded"
              style={{ background: "rgb(255, 0, 0)" }}
            />
            <span className="text-xs mt-1 text-muted-foreground">High</span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-full h-6 rounded"
              style={{ background: "rgb(139, 0, 0)" }}
            />
            <span className="text-xs mt-1 text-muted-foreground">Crit</span>
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-foreground">
              Hour {currentTimeIndex + 1} of {results.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {currentResult.time}
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
            className="min-h-[44px] px-4 md:px-3"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={isLoading || results.length === 0}
            className="min-h-[44px] px-4 md:px-3"
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
          <Button
            size="sm"
            variant="outline"
            onClick={exportAsFrames}
            disabled={isLoading || results.length === 0 || isExportingGif}
            className="min-h-[44px] px-4 md:px-3"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExportingGif ? "Exporting..." : "Export Frames"}
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
              {currentResult.maxConcentration.toFixed(4)} g/m³
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Peak:</span>
            <span className="ml-2 font-semibold text-foreground">
              {((currentResult.maxConcentration / maxValue) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
