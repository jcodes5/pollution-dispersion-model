import { DispersionResult } from "@shared/api";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConcentrationTableProps {
  results: DispersionResult[];
  isLoading: boolean;
}

export default function ConcentrationTable({
  results,
  isLoading,
}: ConcentrationTableProps) {
  if (results.length === 0) {
    return (
      <Card className="p-6 flex items-center justify-center h-80">
        <div className="text-center">
          <p className="text-muted-foreground">
            {isLoading
              ? "Running simulation..."
              : "Run a simulation to view detailed results"}
          </p>
        </div>
      </Card>
    );
  }

  // Find peak
  let maxConcentration = 0;
  let peakHour = 0;
  results.forEach((result, index) => {
    if (result.maxConcentration > maxConcentration) {
      maxConcentration = result.maxConcentration;
      peakHour = index;
    }
  });

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          Hourly Results
        </h2>

        <ScrollArea className="h-96 border border-border rounded-lg">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/50">
              <TableRow>
                <TableHead className="w-20">Hour</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">
                  Max Conc. (g/m³)
                </TableHead>
                <TableHead className="text-right">Wind Speed (m/s)</TableHead>
                <TableHead className="text-right">Wind Dir. (°)</TableHead>
                <TableHead className="w-24">Peak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => {
                const isPeak = index === peakHour;
                const time = new Date(result.time);
                const timeString = time.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });
                const dateString = time.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <TableRow
                    key={index}
                    className={
                      isPeak ? "bg-accent/10 hover:bg-accent/20" : ""
                    }
                  >
                    <TableCell className="font-semibold text-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {dateString} {timeString}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-foreground">
                      {result.maxConcentration.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-foreground">
                      {result.windSpeed.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-foreground">
                      {result.windDirection.toFixed(1)}
                    </TableCell>
                    <TableCell>
                      {isPeak && (
                        <div className="inline-flex items-center justify-center px-2 py-1 bg-accent/20 text-accent rounded-full text-xs font-semibold">
                          ★ Peak
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-border">
          <div className="p-3 bg-primary/10 rounded">
            <p className="text-xs font-semibold text-primary uppercase">
              Peak Concentration
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {maxConcentration.toFixed(4)}
            </p>
            <p className="text-xs text-muted-foreground">g/m³ at Hour {peakHour + 1}</p>
          </div>
          <div className="p-3 bg-secondary/10 rounded">
            <p className="text-xs font-semibold text-secondary uppercase">
              Average Concentration
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {(
                results.reduce((sum, r) => sum + r.maxConcentration, 0) /
                results.length
              ).toFixed(4)}
            </p>
            <p className="text-xs text-muted-foreground">across all hours</p>
          </div>
          <div className="p-3 bg-accent/10 rounded">
            <p className="text-xs font-semibold text-accent uppercase">
              Total Duration
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {results.length}
            </p>
            <p className="text-xs text-muted-foreground">hours simulated</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
