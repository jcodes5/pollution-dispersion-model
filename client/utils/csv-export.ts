import { DispersionResult } from "@shared/api";

interface CSVRow {
  hour: number;
  time: string;
  maxConcentration: number;
  averageConcentration: number;
  windSpeed: number;
  windDirection: number;
}

/**
 * Export dispersion results to CSV format
 */
export function exportToCSV(
  results: DispersionResult[],
  filename: string = "dispersion-results.csv",
): void {
  if (results.length === 0) {
    console.warn("No results to export");
    return;
  }

  // Calculate grid average for each result
  const csvData: CSVRow[] = results.map((result) => {
    const flatGrid = result.concentrationGrid.flat();
    const avgConcentration =
      flatGrid.reduce((a, b) => a + b, 0) / flatGrid.length;

    return {
      hour: result.hour + 1,
      time: new Date(result.time).toLocaleString(),
      maxConcentration: parseFloat(result.maxConcentration.toFixed(6)),
      averageConcentration: parseFloat(avgConcentration.toFixed(6)),
      windSpeed: parseFloat(result.windSpeed.toFixed(2)),
      windDirection: parseFloat(result.windDirection.toFixed(1)),
    };
  });

  // Create CSV headers
  const headers = [
    "Hour",
    "Time",
    "Max Concentration (µg/m³)",
    "Avg Concentration (µg/m³)",
    "Wind Speed (m/s)",
    "Wind Direction (°)",
  ];

  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...csvData.map((row) =>
      [
        row.hour,
        `"${row.time}"`,
        row.maxConcentration,
        row.averageConcentration,
        row.windSpeed,
        row.windDirection,
      ].join(","),
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Get grid average concentration
 */
export function getGridAverage(grid: number[][]): number {
  const flat = grid.flat();
  return flat.length > 0 ? flat.reduce((a, b) => a + b, 0) / flat.length : 0;
}

/**
 * Get grid statistics
 */
export function getGridStats(grid: number[][]) {
  const flat = grid.flat();
  if (flat.length === 0) return { min: 0, max: 0, avg: 0, median: 0 };

  const sorted = [...flat].sort((a, b) => a - b);
  const avg = flat.reduce((a, b) => a + b, 0) / flat.length;
  const median = sorted[Math.floor(sorted.length / 2)];

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg,
    median,
  };
}
