import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  SimulationParams,
  SimulationResponse,
  DispersionResult,
} from "@shared/api";
import SimulatorControls from "@/components/SimulatorControls";
import DispersionMap from "@/components/DispersionMap";
import ConcentrationChart from "@/components/ConcentrationChart";
import ReceptorTable from "@/components/ReceptorTable";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Simulator() {
  const [results, setResults] = useState<DispersionResult[]>([]);
  const [lastParams, setLastParams] = useState<SimulationParams | null>(null);
  const { toast } = useToast();

  const simulateMutation = useMutation({
    mutationFn: async (params: SimulationParams) => {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Simulation failed");
      }

      const data: SimulationResponse = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Simulation failed");
      }

      return data;
    },
    onSuccess: (data) => {
      setResults(data.results);
      toast({
        title: "Simulation Complete",
        description: `Peak concentration: ${data.stats.peakConcentration.toFixed(4)} µg/m³ at ${data.stats.peakTime}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Simulation Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });

  const handleSimulate = (params: SimulationParams) => {
    simulateMutation.mutate(params);
  };

  return (
    <div className="w-full bg-muted/20 min-h-screen">
      <div className="container px-4 py-8 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Pollutant Dispersion Simulator
          </h1>
          <p className="text-lg text-muted-foreground">
            Forecast air pollutant spread with Gaussian plume modeling and
            real-time meteorological data
          </p>
        </div>

        {/* Main Layout: Split on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Controls */}
          <div className="lg:col-span-1">
            <SimulatorControls
              onSimulate={handleSimulate}
              isLoading={simulateMutation.isPending}
            />
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="visualization" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="visualization">Visualization</TabsTrigger>
                <TabsTrigger value="timeseries">Time Series</TabsTrigger>
                <TabsTrigger value="table">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="visualization" className="mt-4">
                <DispersionVisualization
                  results={results}
                  isLoading={simulateMutation.isPending}
                />
              </TabsContent>

              <TabsContent value="timeseries" className="mt-4">
                <ConcentrationChart
                  results={results}
                  isLoading={simulateMutation.isPending}
                />
              </TabsContent>

              <TabsContent value="table" className="mt-4">
                <ReceptorTable
                  results={results}
                  isLoading={simulateMutation.isPending}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-background rounded-lg border border-border">
            <h3 className="text-lg font-bold text-foreground mb-2">
              🧮 Gaussian Plume Model
            </h3>
            <p className="text-sm text-muted-foreground">
              Industry-standard atmospheric dispersion model that calculates
              pollutant concentration based on emission parameters and
              meteorological conditions.
            </p>
          </div>
          <div className="p-6 bg-background rounded-lg border border-border">
            <h3 className="text-lg font-bold text-foreground mb-2">
              ☁️ Real Weather Data
            </h3>
            <p className="text-sm text-muted-foreground">
              Integrated with Open-Meteo API for free, real-time meteorological
              forecasts without API keys. Includes wind speed, direction, and
              temperature data.
            </p>
          </div>
          <div className="p-6 bg-background rounded-lg border border-border">
            <h3 className="text-lg font-bold text-foreground mb-2">
              📊 Full Customization
            </h3>
            <p className="text-sm text-muted-foreground">
              Control all simulation parameters including emission rate, source
              height, stability class, or provide custom wind data for manual
              simulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
