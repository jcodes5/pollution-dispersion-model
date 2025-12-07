import { DispersionResult } from "@shared/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import html2canvas from "html2canvas";

interface ConcentrationChartProps {
  results: DispersionResult[];
  isLoading: boolean;
}

export default function ConcentrationChart({
  results,
  isLoading,
}: ConcentrationChartProps) {
  // Transform data for chart
  const chartData = results.map((result, index) => ({
    hour: index + 1,
    time: new Date(result.time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    maxConcentration: parseFloat(result.maxConcentration.toFixed(4)),
  }));

  // Export chart as PNG
  const exportAsPNG = async () => {
    const chartElement = document.querySelector('.concentration-chart-wrapper') as HTMLElement;
    if (!chartElement) return;

    try {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
      });

      const link = document.createElement('a');
      link.download = `concentration-chart-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error exporting chart:', error);
    }
  };

  if (results.length === 0) {
    return (
      <Card className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-muted-foreground">
            {isLoading
              ? "Running simulation..."
              : "Run a simulation to view concentration data"}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 concentration-chart-wrapper">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            Concentration Over Time
          </h2>
          <Button
            onClick={exportAsPNG}
            size="sm"
            variant="outline"
            disabled={isLoading || results.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PNG
          </Button>
        </div>

        <div className="w-full h-80 concentration-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                label={{
                  value: "Concentration (g/m³)",
                  angle: -90,
                  position: "insideLeft",
                }}
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div
                        style={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "4px",
                          padding: "8px",
                        }}
                      >
                        <p style={{ color: "hsl(var(--foreground))", margin: 0 }}>
                          {`Time: ${label}`}
                        </p>
                        <p style={{ color: "hsl(var(--foreground))", margin: 0 }}>
                          {`Concentration: ${payload[0].value} g/m³`}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="maxConcentration"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="Max Concentration"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-muted/30 rounded border border-border">
            <p className="text-xs text-muted-foreground">Peak Concentration</p>
            <p className="text-lg font-bold text-foreground">
              {Math.max(...chartData.map((d) => d.maxConcentration)).toFixed(4)}{" "}
              <span className="text-sm">g/m³</span>
            </p>
          </div>
          <div className="p-3 bg-muted/30 rounded border border-border">
            <p className="text-xs text-muted-foreground">Average</p>
            <p className="text-lg font-bold text-foreground">
              {(
                chartData.reduce((sum: number, d) => sum + d.maxConcentration, 0) /
                chartData.length
              ).toFixed(4)}{" "}
              <span className="text-sm">g/m³</span>
            </p>
          </div>
          <div className="p-3 bg-muted/30 rounded border border-border">
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-lg font-bold text-foreground">
              {results.length} <span className="text-sm">hours</span>
            </p>
          </div>
          <div className="p-3 bg-muted/30 rounded border border-border">
            <p className="text-xs text-muted-foreground">Peak Hour</p>
            <p className="text-lg font-bold text-foreground">
              Hour{" "}
              {chartData.reduce((maxIdx: number, d, idx) =>
                d.maxConcentration > (chartData[maxIdx]?.maxConcentration || 0)
                  ? idx
                  : maxIdx,
                0
              ) + 1}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
