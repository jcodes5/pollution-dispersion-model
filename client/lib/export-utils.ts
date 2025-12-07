import { DispersionResult } from "@shared/api";

/**
 * Export simulation results to CSV format
 */
export function exportToCSV(results: DispersionResult[], filename?: string) {
  if (results.length === 0) {
    console.warn("No results to export");
    return;
  }

  // Create CSV header
  const headers = [
    "Hour",
    "Date",
    "Time",
    "Max Concentration (g/m³)",
    "Wind Speed (m/s)",
    "Wind Direction (°)",
  ];

  // Create CSV rows
  const rows = results.map((result, index) => {
    const date = new Date(result.time);
    const dateStr = date.toLocaleDateString("en-US");
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return [
      index + 1,
      dateStr,
      timeStr,
      result.maxConcentration.toFixed(4),
      result.windSpeed.toFixed(2),
      result.windDirection.toFixed(1),
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download =
    filename ||
    `simulation-results-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export canvas as GIF animation using gifshot library
 * Note: This requires the gifshot library to be installed
 */
export async function exportCanvasAsGif(
  canvasElements: HTMLCanvasElement[],
  filename?: string,
  onProgress?: (progress: number) => void,
) {
  if (canvasElements.length === 0) {
    console.warn("No canvas elements to export");
    return;
  }

  try {
    // Dynamic import of gif.js
    const gifModule = await import("gif.js");
    const GIF = gifModule.default;

    // Get dimensions from first canvas
    const width = canvasElements[0].width;
    const height = canvasElements[0].height;

    return new Promise<void>((resolve, reject) => {
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width,
        height,
        workerScript:
          "https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js",
      });

      // Add frames
      canvasElements.forEach((canvas, index) => {
        gif.addFrame(canvas, { delay: 500 });
        if (onProgress) {
          onProgress((index + 1) / canvasElements.length);
        }
      });

      // Handle rendering
      gif.on("finished", function (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download =
          filename ||
          `dispersion-animation-${new Date().toISOString().split("T")[0]}.gif`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        resolve();
      });

      gif.on("error", (error) => {
        console.error("Error creating GIF:", error);
        reject(error);
      });

      gif.render();
    });
  } catch (error) {
    console.error("Error exporting GIF:", error);
    throw error;
  }
}

/**
 * Capture canvas frames for GIF export
 * Returns array of canvas elements
 */
export async function captureCanvasFrames(
  renderFrame: (index: number) => HTMLCanvasElement | null,
  frameCount: number,
): Promise<HTMLCanvasElement[]> {
  const frames: HTMLCanvasElement[] = [];

  for (let i = 0; i < frameCount; i++) {
    const canvas = renderFrame(i);
    if (canvas) {
      // Clone the canvas to preserve the image
      const clonedCanvas = document.createElement("canvas");
      clonedCanvas.width = canvas.width;
      clonedCanvas.height = canvas.height;
      const ctx = clonedCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(canvas, 0, 0);
        frames.push(clonedCanvas);
      }
    }
  }

  return frames;
}
