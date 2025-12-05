import { DispersionResult } from "@shared/api";
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
    concentration: parseFloat(result.maxConcentration.toFixed(4)),
    fullTime: result.time,
  }));

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

  const TooltipContent = (props: any) => (
    <ChartTooltipContent
      {...props}
      className="bg-background border border-border"
      indicator="line"
    />
  );

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          Concentration Over Time
        </h2>

        <ChartContainer
          config={{
            concentration: {
              label: "Concentration",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-80 w-full"
        >
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
                content={TooltipContent}
                cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1 }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="concentration"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="Max Concentration"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-muted/30 rounded border border-border">
            <p className="text-xs text-muted-foreground">Peak Concentration</p>
            <p className="text-lg font-bold text-foreground">
              {Math.max(...chartData.map((d) => d.concentration)).toFixed(4)}{" "}
              <span className="text-sm">g/m³</span>
            </p>
          </div>
          <div className="p-3 bg-muted/30 rounded border border-border">
            <p className="text-xs text-muted-foreground">Average</p>
            <p className="text-lg font-bold text-foreground">
              {(
                chartData.reduce((sum, d) => sum + d.concentration, 0) /
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
              {chartData.reduce((maxIdx, d, idx) =>
                d.concentration > (chartData[maxIdx]?.concentration || 0)
                  ? idx
                  : maxIdx,
              )}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
