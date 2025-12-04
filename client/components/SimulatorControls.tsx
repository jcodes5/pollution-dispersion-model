import { useState } from "react";
import { SimulationParams } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface SimulatorControlsProps {
  onSimulate: (params: SimulationParams) => void;
  isLoading: boolean;
}

export default function SimulatorControls({
  onSimulate,
  isLoading,
}: SimulatorControlsProps) {
  const [useAutoWeather, setUseAutoWeather] = useState(true);
  const [formData, setFormData] = useState({
    latitude: 40.7128,
    longitude: -74.006,
    emissionRate: 10,
    sourceHeight: 50,
    stabilityClass: "D",
    windSpeed: 5,
    windDirection: 180,
    stackDiameter: 1,
    exitVelocity: 1,
    duration: 24,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = () => {
    const params: SimulationParams = {
      latitude: formData.latitude,
      longitude: formData.longitude,
      emissionRate: formData.emissionRate,
      sourceHeight: formData.sourceHeight,
      stabilityClass: formData.stabilityClass,
      windSpeed: formData.windSpeed,
      windDirection: formData.windDirection,
      stackDiameter: formData.stackDiameter,
      exitVelocity: formData.exitVelocity,
      duration: formData.duration,
      useAutoWeather,
    };
    onSimulate(params);
  };

  return (
    <Card className="p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Simulation Parameters
      </h2>

      <div className="space-y-6">
        {/* Location Section */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
            Location
          </h3>
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-muted-foreground">Latitude</Label>
              <Input
                type="number"
                step="0.0001"
                value={formData.latitude}
                onChange={(e) => handleInputChange("latitude", e.target.value)}
                className="mt-1"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Longitude</Label>
              <Input
                type="number"
                step="0.0001"
                value={formData.longitude}
                onChange={(e) => handleInputChange("longitude", e.target.value)}
                className="mt-1"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Source Section */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
            Emission Source
          </h3>
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-muted-foreground">
                Emission Rate (g/s)
              </Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={formData.emissionRate}
                onChange={(e) =>
                  handleInputChange("emissionRate", e.target.value)
                }
                className="mt-1"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Source Height (m)
              </Label>
              <Input
                type="number"
                min="0"
                step="1"
                value={formData.sourceHeight}
                onChange={(e) =>
                  handleInputChange("sourceHeight", e.target.value)
                }
                className="mt-1"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Stack Diameter (m)
              </Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={formData.stackDiameter}
                onChange={(e) =>
                  handleInputChange("stackDiameter", e.target.value)
                }
                className="mt-1"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Exit Velocity (m/s)
              </Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={formData.exitVelocity}
                onChange={(e) =>
                  handleInputChange("exitVelocity", e.target.value)
                }
                className="mt-1"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Meteorology Section */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
            Meteorology
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
              <Checkbox
                checked={useAutoWeather}
                onCheckedChange={(checked) =>
                  setUseAutoWeather(checked as boolean)
                }
                disabled={isLoading}
              />
              <Label className="text-sm cursor-pointer">
                Auto-fetch weather data
              </Label>
            </div>

            {!useAutoWeather && (
              <div className="space-y-3 p-3 bg-muted/50 rounded border border-border">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Wind Speed (m/s)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.windSpeed}
                    onChange={(e) =>
                      handleInputChange("windSpeed", e.target.value)
                    }
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Wind Direction (°)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="360"
                    step="1"
                    value={formData.windDirection}
                    onChange={(e) =>
                      handleInputChange("windDirection", e.target.value)
                    }
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div>
              <Label className="text-sm text-muted-foreground">
                Stability Class
              </Label>
              <Select
                value={formData.stabilityClass}
                onValueChange={(value) =>
                  handleInputChange("stabilityClass", value)
                }
                disabled={isLoading}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A - Very Unstable</SelectItem>
                  <SelectItem value="B">B - Unstable</SelectItem>
                  <SelectItem value="C">C - Slightly Unstable</SelectItem>
                  <SelectItem value="D">D - Neutral</SelectItem>
                  <SelectItem value="E">E - Slightly Stable</SelectItem>
                  <SelectItem value="F">F - Stable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Simulation Section */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
            Simulation
          </h3>
          <div>
            <Label className="text-sm text-muted-foreground">
              Duration (hours, 1-48)
            </Label>
            <Input
              type="number"
              min="1"
              max="48"
              step="1"
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              className="mt-1"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          size="lg"
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running Simulation...
            </>
          ) : (
            "Run Simulation"
          )}
        </Button>
      </div>
    </Card>
  );
}
