import { useState } from "react";
import {
  SimulationParams,
  HourlyWindOverride,
  POLLUTANT_DEFAULTS,
  GRID_SIZES,
  RECEPTOR_HEIGHT,
} from "@shared/api";
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
import { Loader2, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

interface SimulatorControlsProps {
  onSimulate: (params: SimulationParams) => void;
  isLoading: boolean;
}

export default function SimulatorControls({
  onSimulate,
  isLoading,
}: SimulatorControlsProps) {
  const [useAutoWeather, setUseAutoWeather] = useState(true);
  const [autoMapStability, setAutoMapStability] = useState(true);
  const [showWindOverrides, setShowWindOverrides] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    pollutantType: "PM2.5" as const,
    receptorHeight: RECEPTOR_HEIGHT.DEFAULT,
    gridSize: 40 as const,
    depositionVelocity: POLLUTANT_DEFAULTS["PM2.5"].depositonVelocity,
    mixingHeight: 500,
    lossRate: 0,
  });

  const [windOverrides, setWindOverrides] = useState<HourlyWindOverride[]>([]);

  const handleInputChange = (
    field: string,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        typeof value === "string"
          ? isNaN(Number(value))
            ? value
            : parseFloat(value)
          : value,
    }));
  };

  const handlePollutantChange = (pollutant: "PM2.5" | "PM10") => {
    handleInputChange("pollutantType", pollutant);
    handleInputChange(
      "depositionVelocity",
      POLLUTANT_DEFAULTS[pollutant].depositonVelocity,
    );
  };

  const addWindOverride = () => {
    const newOverride: HourlyWindOverride = {
      hour: 0,
      windSpeed: formData.windSpeed,
      windDirection: formData.windDirection,
    };
    setWindOverrides([...windOverrides, newOverride]);
  };

  const updateWindOverride = (index: number, override: HourlyWindOverride) => {
    const newOverrides = [...windOverrides];
    newOverrides[index] = override;
    setWindOverrides(newOverrides);
  };

  const removeWindOverride = (index: number) => {
    setWindOverrides(windOverrides.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const params: SimulationParams = {
      latitude: formData.latitude,
      longitude: formData.longitude,
      emissionRate: formData.emissionRate,
      sourceHeight: formData.sourceHeight,
      stabilityClass: autoMapStability ? undefined : formData.stabilityClass,
      windSpeed: formData.windSpeed,
      windDirection: formData.windDirection,
      stackDiameter: formData.stackDiameter,
      exitVelocity: formData.exitVelocity,
      duration: formData.duration,
      useAutoWeather,
      autoMapStability,
      pollutantType: formData.pollutantType,
      receptorHeight: formData.receptorHeight,
      gridSize: formData.gridSize,
      depositionVelocity: formData.depositionVelocity,
      mixingHeight: formData.mixingHeight,
      lossRate: formData.lossRate,
      hourlyWindOverrides: windOverrides.length > 0 ? windOverrides : undefined,
    };
    onSimulate(params);
  };

  return (
    <Card className="p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Simulation Parameters
      </h2>

      <div className="space-y-6">
        {/* Pollutant Type Section */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
            Pollutant Type
          </h3>
          <div className="space-y-2">
            <div className="flex gap-3">
              {(["PM2.5", "PM10"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handlePollutantChange(type)}
                  className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                    formData.pollutantType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                  disabled={isLoading}
                >
                  {type}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {POLLUTANT_DEFAULTS[formData.pollutantType].description}
            </p>
          </div>
        </div>

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

            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
              <Checkbox
                checked={autoMapStability}
                onCheckedChange={(checked) =>
                  setAutoMapStability(checked as boolean)
                }
                disabled={isLoading}
              />
              <Label className="text-sm cursor-pointer">
                Auto-map stability class
              </Label>
            </div>

            {!autoMapStability && (
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
            )}
          </div>
        </div>

        {/* Receptor Section */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
            Receptor
          </h3>
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-muted-foreground">
                Receptor Height (m)
              </Label>
              <Input
                type="number"
                min={RECEPTOR_HEIGHT.MIN}
                max={RECEPTOR_HEIGHT.MAX}
                step="0.1"
                value={formData.receptorHeight}
                onChange={(e) =>
                  handleInputChange("receptorHeight", e.target.value)
                }
                className="mt-1"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Default: {RECEPTOR_HEIGHT.DEFAULT}m (breathing height)
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Grid Size</Label>
              <Select
                value={formData.gridSize.toString()}
                onValueChange={(value) =>
                  handleInputChange("gridSize", parseInt(value))
                }
                disabled={isLoading}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRID_SIZES.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}×{size} cells
                    </SelectItem>
                  ))}
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

        {/* Wind Overrides Section */}
        <div>
          <button
            onClick={() => setShowWindOverrides(!showWindOverrides)}
            className="w-full flex items-center justify-between p-3 bg-muted/30 rounded border border-border hover:bg-muted/50 transition-colors"
            disabled={isLoading}
          >
            <span className="text-sm font-semibold text-foreground">
              Hourly Wind Overrides ({windOverrides.length})
            </span>
            {showWindOverrides ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showWindOverrides && (
            <div className="mt-3 p-3 bg-muted/30 rounded border border-border space-y-2">
              {windOverrides.map((override, idx) => (
                <div key={idx} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">
                      Hour
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max={formData.duration - 1}
                      value={override.hour}
                      onChange={(e) =>
                        updateWindOverride(idx, {
                          ...override,
                          hour: parseInt(e.target.value),
                        })
                      }
                      className="mt-1 h-8"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">
                      Speed (m/s)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={override.windSpeed}
                      onChange={(e) =>
                        updateWindOverride(idx, {
                          ...override,
                          windSpeed: parseFloat(e.target.value),
                        })
                      }
                      className="mt-1 h-8"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">
                      Direction (°)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max="360"
                      step="1"
                      value={override.windDirection}
                      onChange={(e) =>
                        updateWindOverride(idx, {
                          ...override,
                          windDirection: parseFloat(e.target.value),
                        })
                      }
                      className="mt-1 h-8"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={() => removeWindOverride(idx)}
                    disabled={isLoading}
                    className="p-2 hover:bg-destructive/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))}
              <Button
                onClick={addWindOverride}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isLoading}
              >
                + Add Override
              </Button>
            </div>
          )}
        </div>

        {/* Advanced Section */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between p-3 bg-muted/30 rounded border border-border hover:bg-muted/50 transition-colors"
            disabled={isLoading}
          >
            <span className="text-sm font-semibold text-foreground">
              Advanced Options
            </span>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showAdvanced && (
            <div className="mt-3 p-3 bg-muted/30 rounded border border-border space-y-3">
              <div>
                <Label className="text-sm text-muted-foreground">
                  Deposition Velocity (m/s)
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={formData.depositionVelocity}
                  onChange={(e) =>
                    handleInputChange("depositionVelocity", e.target.value)
                  }
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Mixing Height (m)
                </Label>
                <Input
                  type="number"
                  min="100"
                  step="10"
                  value={formData.mixingHeight}
                  onChange={(e) =>
                    handleInputChange("mixingHeight", e.target.value)
                  }
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Loss Rate (1/s)
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.00001"
                  value={formData.lossRate}
                  onChange={(e) =>
                    handleInputChange("lossRate", e.target.value)
                  }
                  className="mt-1"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Chemical removal rate (0 = no chemical loss)
                </p>
              </div>
            </div>
          )}
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
