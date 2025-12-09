# Pollution Dispersion Simulation System - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [How the Simulation Works](#how-the-simulation-works)
3. [User Input Parameters](#user-input-parameters)
4. [API Architecture](#api-architecture)
5. [The Gaussian Plume Model](#the-gaussian-plume-model)
6. [Results Structure](#results-structure)
7. [Visualization System](#visualization-system)
8. [Real-World Applications](#real-world-applications)
9. [Setup and Usage](#setup-and-usage)
10. [Technical Architecture](#technical-architecture)

---

## Project Overview

This is a **production-ready full-stack air quality modeling system** built with React, Express, TypeScript, and Vite. It uses the **Gaussian Plume Model** - an industry-standard atmospheric dispersion model - to predict how air pollutants spread from a point source (like a factory chimney).

### Key Features

- ✅ **Real-time Weather Integration**: Fetches live meteorological data from Open-Meteo API
- ✅ **Interactive Visualization**: Heatmap showing pollutant concentration over a 24-hour period
- ✅ **Customizable Simulations**: Full control over emission parameters and source characteristics
- ✅ **Data Export**: Download results as CSV or animation frames as ZIP
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Type-Safe**: Full TypeScript implementation throughout

### Real-World Use Cases

- Environmental Impact Assessments (EIA)
- Regulatory compliance (EPA standards)
- Emergency response planning
- Urban air quality forecasting
- Industrial site planning

---

## How the Simulation Works

```text
┌─────────────────────────────────────────────────────────────────┐
│ USER INPUT (SimulatorControls.tsx)                              │
│ - Location (latitude/longitude)                                 │
│ - Emission parameters (rate, height)                            │
│ - Stability class, duration, weather mode                       │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ API REQUEST (Simulator.tsx → /api/simulate)                     │
│ POST with SimulationParams JSON                                 │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ SERVER PROCESSING (server/routes/simulate.ts)                   │
│ 1. Validate input parameters                                    │
│ 2. Fetch weather (if useAutoWeather = true)                     │
│    └─ Call Open-Meteo API for wind, temperature                │
│ 3. Loop 24 times (hourly simulation)                            │
│    └─ Run Gaussian Plume Model for each hour                    │
│ 4. Calculate concentration grid (spatial distribution)          │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ RESULTS (Array of DispersionResult)                             │
│ - Max concentration for each hour                               │
│ - 2D grid of concentrations at different locations              │
│ - Wind speed and direction metadata                             │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ VISUALIZATION (DispersionVisualization.tsx)                     │
│ - Heatmap showing pollution spread                              │
│ - Wind direction indicator                                      │
│ - Interactive timeline slider                                   │
│ - Play/Pause animation controls                                 │
│ - Export to PNG/ZIP                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Input Parameters

### Location Parameters

#### Latitude & Longitude

**What it is**: GPS coordinates of the pollution source (factory chimney, power plant stack, etc.)

**Example**:

- New York City: 40.7128°N, -74.006°W
- Los Angeles: 34.0522°N, -118.2437°W

**Real-life Use**:

- Specifies exact location for meteorological data retrieval
- Required for EPA regulatory compliance documentation
- Determines which weather station data is used

**Technical Implementation**:

```typescript
// From SimulatorControls.tsx
const params: SimulationParams = {
  latitude: 40.7128, // -90 to 90
  longitude: -74.006, // -180 to 180
  // ... other parameters
};

// Server validates in simulate.ts
if (latitude < -90 || latitude > 90) {
  return res.status(400).json({
    error: "Latitude must be between -90 and 90",
  });
}
```

**API Call**: Used by Open-Meteo to fetch weather data

```text
GET https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006
```

#### Stability Class (Pasquill Stability Categories)

**What it is**: Atmospheric stability rating that determines how pollutants disperse vertically and horizontally

**The Six Classes** (A to F):

| Class | Stability         | Condition                | Time               | Dispersion            | Real-World Example   |
| ----- | ----------------- | ------------------------ | ------------------ | --------------------- | -------------------- |
| **A** | Very Unstable     | Sunny day, light wind    | Midday (11am-3pm)  | BEST (most dilution)  | June noon in city    |
| **B** | Unstable          | Sunny day, moderate wind | Midday             | Good                  | Spring afternoon     |
| **C** | Slightly Unstable | Overcast, moderate wind  | Afternoon          | Moderate              | Partly cloudy day    |
| **D** | Neutral           | Overcast, any wind       | Afternoon/evening  | Fair                  | Cloudy day with wind |
| **E** | Slightly Stable   | Clear night, light wind  | Evening (6pm-11pm) | Poor                  | Clear night, calm    |
| **F** | Very Stable       | Clear night, calm        | Night (11pm-6am)   | WORST (concentration) | Clear, still night   |

**Why This Matters**:

- Class A: Pollutants rise and disperse → lower ground-level concentration
- Class F: Pollutants stay near ground → higher ground-level concentration

**Real-life Determination**:
Meteorologists use this table:

```text
Wind Speed (m/s) | Sunshine | Thinly Overcast | Overcast
────────────────┼──────────┼─────────────────┼─────────
< 2              |    A     |       B         |   E
2-3              |    A     |       B         |   D
3-5              |    B     |       C         |   D
5-6              |    C     |       D         |   D
> 6              |    C     |       D         |   D
```

**Technical Use** (server/routes/simulate.ts):

```typescript
const validStabilityClasses = ["A", "B", "C", "D", "E", "F"];
if (!validStabilityClasses.includes(params.stabilityClass)) {
  return res.status(400).json({
    error: "Stability class must be A, B, C, D, E, or F",
  });
}

// Used in Gaussian Plume Model calculations
const dispersionCoefficients = getDispersionCoefficients(
  distance,
  stabilityClass,
);
```

### Emission Source Parameters

#### Emission Rate

**What it is**: Mass of pollutant released from the source per second

**Unit**: grams per second (g/s)

**Common Examples**:

- Small factory: 5-20 g/s
- Medium industrial facility: 50-100 g/s
- Large power plant: 500-1000 g/s
- Vehicle exhaust (one car): 0.01-0.05 g/s

**Annual Conversion**:

```text
10 g/s × 86,400 seconds/day × 365 days/year = 315,360 kg/year
                                             = 315.36 metric tons/year
```

**Real-life Measurement**:

- Stack monitoring equipment (continuous emission monitors)
- Fuel consumption records
- Material balance calculations
- EPA emission inventories

**Impact on Simulation**:

```text
Higher emission rate → Higher concentrations at all downwind locations
Lower emission rate → Lower concentrations everywhere
```

#### Source Height

**What it is**: Height of the emission point above ground level (chimney/stack height)

**Unit**: meters (m)

**Typical Values**:

- Small industrial stack: 10-30 m
- Medium factory: 50-100 m
- Large power plant: 150-300 m
- Tall smokestack: 300+ m

**Real-life Examples**:

- Pizza oven: 2-3 m
- House chimney: 5-10 m
- Industrial factory: 50-100 m
- Coal power plant: 200+ m (to disperse pollution over wider area)

**Why It Matters**:

- **Taller stacks**: Pollution starts at higher altitude → more dispersion → lower ground-level impact
- **Shorter stacks**: Pollution starts near ground → less dispersion → higher ground-level impact

**Scientific Principle** (Gaussian Plume Model):
The plume rises due to buoyancy and wind transport, so starting height significantly affects final ground-level concentration.

**Impact Example**:

```text
Scenario: Factory with 10 g/s emission, neutral wind 5 m/s

At 500m downwind:
- 25m stack height: 8.5 g/m³
- 50m stack height: 4.2 g/m³
- 100m stack height: 2.1 g/m³

Higher stack = 4x lower concentration
```

### Simulation Parameters

#### Duration

**What it is**: Length of time to simulate the pollution dispersion

**Unit**: hours (1-48 typical, up to 168 for a week)

**Common Scenarios**:

- 24 hours: Standard for daily air quality forecasting
- 8 hours: EPA regulatory standard for some pollutants
- 1 hour: Emergency response to acute incident
- 168 hours: Week-long worst-case scenario

**Real-life Applications**:

```text
Scenario 1: Factory operation planning
- Simulate 24 hours with typical wind patterns
- Determine maximum ground-level concentration

Scenario 2: Regulatory assessment
- Simulate worst-case 1-hour scenario
- Show EPA inspector worst conditions possible

Scenario 3: Emergency response
- Simulate 3-6 hours after chemical release
- Determine evacuation zone
```

**Weather Changes During Simulation**:

```text
Hour 1: Wind from North, 3 m/s, Stability D
Hour 2: Wind from North, 4 m/s, Stability D
...
Hour 12: Wind from North-East, 2 m/s, Stability E
...
Hour 24: Wind from North-East, 5 m/s, Stability C
```

#### Use Auto Weather (Toggle)

**Enabled** (`useAutoWeather: true`):

- Fetches real-time meteorological forecast from Open-Meteo API
- Gets hourly wind speed, wind direction, temperature
- Represents realistic time-varying conditions
- Requires location (lat/lon) to work
- **Use case**: Realistic air quality forecasting

**Disabled** (`useAutoWeather: false`):

- Uses manual wind speed and wind direction you provide
- Assumes constant wind for entire simulation period
- Represents steady-state worst-case scenario
- **Use case**: Regulatory compliance (worst-case assumption)

**Technical Implementation** (server/routes/simulate.ts):

```typescript
if (params.useAutoWeather) {
  // Fetch from Open-Meteo
  try {
    forecastData = await fetchForecast(
      params.latitude,
      params.longitude,
      params.duration,
    );
  } catch (error) {
    // Fall back to mock data if API fails
    forecastData = generateMockForecast(params.duration);
  }
} else {
  // Use manual wind input
  if (
    typeof params.windSpeed !== "number" ||
    typeof params.windDirection !== "number"
  ) {
    return res.status(400).json({
      error: "Manual weather mode requires windSpeed and windDirection",
    });
  }

  // Generate constant wind forecast
  forecastData = [];
  for (let i = 0; i < params.duration; i++) {
    forecastData.push({
      windSpeed: params.windSpeed,
      windDirection: params.windDirection,
      temperature: 15, // Default
    });
  }
}
```

#### Wind Speed (Manual Weather Mode)

**What it is**: How fast the wind is blowing the pollution away

**Unit**: meters per second (m/s)

**Conversion**:

- 1 m/s = 2.24 mph = 3.6 km/h

**Real-world Values**:

- Calm: 0-1 m/s (still air)
- Light breeze: 1-3 m/s
- Gentle breeze: 3-5 m/s
- Moderate wind: 5-8 m/s
- Strong wind: 8+ m/s

**Impact on Concentration**:

```text
Higher wind speed → More dilution → Lower concentration
Lower wind speed → Less dilution → Higher concentration

Relationship: C ∝ 1/u  (inverse proportional)
If wind speed doubles, concentration halves
```

**Real-life Example**:

```text
Scenario: Same factory, same emission rate

Calm day (1 m/s): Peak ground concentration = 15 g/m³
Breezy day (5 m/s): Peak ground concentration = 3 g/m³
Windy day (10 m/s): Peak ground concentration = 1.5 g/m³
```

#### Wind Direction (Manual Weather Mode)

**What it is**: Direction the wind is coming FROM, in degrees

**Unit**: degrees (0-360°)

- **0° / 360°**: North (pollutant goes South)
- **90°**: East (pollutant goes West)
- **180°**: South (pollutant goes North)
- **270°**: West (pollutant goes East)

**Visual Aid**:

```text
        0° (N)
        ↑
   315°  |  45°
       \ | /
 270°← -+-  → 90°
       / | \
   225°  |  135°
        ↓
      180° (S)
```

**Real-life Application**:

```text
Factory in New York at (40.7128, -74.006)

Wind from North (0°) → Pollution goes South → Affects Brooklyn, Queens
Wind from West (270°) → Pollution goes East → Affects Brooklyn, Manhattan
Wind from South (180°) → Pollution goes North → Affects Bronx

City planners use this to zone residential areas away
from prevailing downwind direction
```

---

## API Architecture

### Request Flow

#### 1. Frontend Sends Request

**File**: `client/pages/Simulator.tsx`

```typescript
const response = await fetch("/api/simulate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    latitude: 40.7128,
    longitude: -74.006,
    emissionRate: 10,
    sourceHeight: 50,
    stabilityClass: "D",
    duration: 24,
    useAutoWeather: true,
  }),
});

const data: SimulationResponse = await response.json();
if (!data.success) {
  throw new Error(data.error);
}
```

#### 2. Server Validates Input

**File**: `server/routes/simulate.ts`

Checks:

- All required parameters present
- Values within valid ranges
- Correct data types

```typescript
if (
  typeof params.latitude !== "number" ||
  typeof params.longitude !== "number" ||
  typeof params.emissionRate !== "number" ||
  typeof params.sourceHeight !== "number" ||
  typeof params.stabilityClass !== "string" ||
  typeof params.duration !== "number"
) {
  return res.status(400).json({
    success: false,
    error: "Missing required simulation parameters",
  });
}

if (params.latitude < -90 || params.latitude > 90) {
  return res.status(400).json({
    success: false,
    error: "Latitude must be between -90 and 90",
  });
}
```

#### 3. Fetch Meteorological Data

**Files**: `server/utils/open-meteo.ts`

If `useAutoWeather: true`:

```typescript
export async function fetchForecast(
  latitude: number,
  longitude: number,
  hours: number = 48,
): Promise<MeteoDataPoint[]> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly: "wind_speed_10m,wind_direction_10m,temperature_2m",
    temperature_unit: "celsius",
    wind_speed_unit: "ms",
    timezone: "UTC",
    forecast_days: "2",
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params}`;
  const response = await fetch(url);
  const data = await response.json();

  // Extract and return hourly data
  return data.hourly.time.map((time, i) => ({
    time,
    windSpeed: data.hourly.wind_speed_10m[i],
    windDirection: data.hourly.wind_direction_10m[i],
    temperature: data.hourly.temperature_2m[i],
  }));
}
```

**Response Example**:

```json
{
  "latitude": 40.7128,
  "longitude": -74.006,
  "hourly": {
    "time": [
      "2024-12-07T00:00", "2024-12-07T01:00", "2024-12-07T02:00", ...
    ],
    "wind_speed_10m": [4.2, 3.8, 3.5, 5.1, 6.2, ...],
    "wind_direction_10m": [180, 182, 185, 190, 188, ...],
    "temperature_2m": [5, 4, 3, 3, 4, ...]
  }
}
```

#### 4. Run Gaussian Plume Model

**File**: `server/routes/simulate.ts`

```typescript
const simulation = runSimulation(
  forecastData,
  params.emissionRate,
  params.sourceHeight,
  params.stabilityClass,
  params.latitude,
  params.longitude,
);
```

#### 5. Return Results

**File**: `server/routes/simulate.ts`

```typescript
return res.status(200).json({
  success: true,
  results: simulation.results, // Array of DispersionResult
  stats: simulation.stats, // Peak, average, timing
} as SimulationResponse);
```

### Type Definitions

**File**: `shared/api.ts`

```typescript
export interface SimulationParams {
  latitude: number;
  longitude: number;
  emissionRate: number; // g/s
  sourceHeight: number; // m
  stabilityClass: string; // A-F
  windSpeed?: number; // m/s (manual mode)
  windDirection?: number; // degrees (manual mode)
  duration: number; // hours
  useAutoWeather: boolean;
}

export interface MeteoDataPoint {
  time: string;
  windSpeed: number;
  windDirection: number;
  temperature: number;
}

export interface DispersionResult {
  time: string;
  hour: number;
  maxConcentration: number;
  concentrationGrid: number[][];
  gridPoints: { x: number[]; y: number[] };
  windSpeed: number;
  windDirection: number;
}

export interface SimulationResponse {
  success: boolean;
  results: DispersionResult[];
  stats: {
    peakConcentration: number;
    peakTime: string;
    peakHour: number;
    averageConcentration: number;
  };
  error?: string;
}
```

---

## The Gaussian Plume Model

### Scientific Foundation

The **Gaussian Plume Model** is the industry standard for atmospheric dispersion modeling, used by EPA, NOAA, and environmental consultants worldwide.

### Mathematical Formulation

#### The Core Equation

```text
C(x,y,z) = (Q / (2π × u × σy × σz)) ×
           exp(-y² / (2 × σy²)) ×
           [exp(-(z - H)² / (2 × σz²)) + exp(-(z + H)² / (2 × σz²))]
```

**Parameters**:

| Symbol | Name                | Unit | Example | Meaning                           |
| ------ | ------------------- | ---- | ------- | --------------------------------- |
| **C**  | Concentration       | g/m³ | 5.0     | Pollutant amount at point (x,y,z) |
| **Q**  | Emission Rate       | g/s  | 10      | Mass rate from source             |
| **u**  | Wind Speed          | m/s  | 5.0     | Horizontal wind velocity          |
| **x**  | Downwind Distance   | m    | 500     | Distance along wind direction     |
| **y**  | Lateral Distance    | m    | 200     | Distance perpendicular to wind    |
| **z**  | Height              | m    | 2       | Height above ground               |
| **H**  | Stack Height        | m    | 50      | Height of emission point          |
| **σy** | Lateral Dispersion  | m    | 120     | Spreading in y-direction          |
| **σz** | Vertical Dispersion | m    | 80      | Spreading in z-direction          |

### Key Assumptions

1. **Point Source**: Pollution comes from single location (not distributed)
2. **Steady-State Wind**: Wind speed and direction constant
3. **Flat Terrain**: No hills or valleys
4. **Ground Reflection**: Pollution doesn't penetrate ground (reflection at z=0)
5. **No Transformation**: Pollutant doesn't react in air (conservative)
6. **No Deposition**: Particles don't settle out or stick to ground

### Dispersion Coefficients

The values σy and σz depend on:

- **Distance downwind** (x): Further = more dispersion
- **Stability class** (A-F): More stable = less dispersion

#### Example Values (Pasquill-Gifford)

At 1000m downwind:

| Stability | σy (m) | σz (m) | Dispersion           |
| --------- | ------ | ------ | -------------------- |
| A         | 380    | 340    | Best (very unstable) |
| B         | 310    | 220    | Good (unstable)      |
| C         | 220    | 140    | Moderate             |
| D         | 140    | 110    | Fair (neutral)       |
| E         | 105    | 70     | Poor (stable)        |
| F         | 75     | 50     | Worst (very stable)  |

**Physical Interpretation**:

- Unstable (A): Heat-driven turbulence → large dispersion
- Stable (F): Calm, layered atmosphere → small dispersion

### Why the Equation Has Two Exponential Terms

```text
[exp(-(z - H)² / (2 × σz²)) + exp(-(z + H)² / (2 × σz²))]
```

This models **ground reflection**:

- **First term**: Direct plume at height H
- **Second term**: "Mirror image" reflected from ground

This prevents negative (impossible) concentrations at ground level.

### Real-World Example

**Scenario**: Coal power plant

- Location: 35.0°N, 105.0°W (New Mexico)
- Emission: 100 g/s of SO₂
- Stack height: 200 m
- Wind: 5 m/s from West
- Stability: D (neutral afternoon)
- Question: What's the concentration 2 km downwind at ground level?

**Calculation**:

```text
Given:
Q = 100 g/s
u = 5 m/s
x = 2000 m (2 km downwind)
y = 0 m (center of plume)
z = 0 m (ground level)
H = 200 m
Stability D at 2000m:
  σy = 230 m
  σz = 220 m

C(2000, 0, 0) = (100 / (2π × 5 × 230 × 220)) ×
                exp(-0 / (2 × 230²)) ×
                [exp(-(0-200)² / (2×220²)) + exp(-(0+200)² / (2×220²))]

             = (100 / 1,603,500) ×
                1.0 ×
                [exp(-40000/96800) + exp(-40000/96800)]

             = 0.0000624 × 2 × exp(-0.413)

             = 0.0000624 × 2 × 0.662

             = 0.0000827 g/m³ = 82.7 μg/m³
```

**Interpretation**:

- At ground level, 2 km away, concentration ≈ 83 μg/m³
- EPA standard for 1-hour SO₂ = 350 μg/m³
- This source alone is within EPA limits at this distance
- But combined with other sources might exceed limits

---

## Results Structure

### DispersionResult Object

Each hour of simulation produces one result:

```typescript
interface DispersionResult {
  time: string; // "2024-12-07T14:00:00Z"
  hour: number; // 0-23
  maxConcentration: number; // Highest value in grid (g/m³)
  concentrationGrid: number[][]; // 2D array of concentrations
  gridPoints: {
    x: number[]; // Downwind distances (m)
    y: number[]; // Lateral distances (m)
  };
  windSpeed: number; // m/s
  windDirection: number; // degrees (0-360)
}
```

### Example Result for Hour 0

```json
{
  "time": "2024-12-07T14:00:00Z",
  "hour": 0,
  "maxConcentration": 8.742,
  "concentrationGrid": [
    [0.012, 0.025, 0.048, 0.095, ..., 0.001],
    [0.024, 0.051, 0.102, 0.205, ..., 0.003],
    [0.048, 0.102, 0.205, 0.410, ..., 0.005],
    [0.095, 0.205, 0.410, 0.820, ..., 0.010],
    [0.192, 0.410, 0.820, 1.642, ..., 0.020],
    [0.410, 0.820, 1.642, 3.284, ..., 0.040],
    [0.820, 1.642, 3.284, 6.568, 8.742, 6.568, ..., 0.080],
    [0.410, 0.820, 1.642, 3.284, ..., 0.040],
    [...rest of grid...]
  ],
  "gridPoints": {
    "x": [0, 100, 200, 300, 400, 500, 600, ..., 5000],
    "y": [-2500, -2400, ..., -100, 0, 100, ..., 2500]
  },
  "windSpeed": 5.2,
  "windDirection": 180
}
```

### Visualization Interpretation

```text
concentrationGrid layout (top-down view):

       Lateral (y-axis)
       ↑
       |  y=-2500...y=0...y=+2500
   ----|----------●----------  ← Wind from South (180°)
       |         /|\
       |        / | \
       |       /  |  \
       |      /   |   \
    x=0    x=500 x=1000 (Downwind direction)
       |
       └─→ Downwind (x-axis)

● = Emission source
/ = Plume edges
```

### Summary Statistics

```typescript
interface SimulationStats {
  peakConcentration: number;    // Maximum across all hours
  peakTime: string;             // When peak occurred
  peakHour: number;             // Which hour (0-23)
  averageConcentration: number; // Mean across all hours
}

// Example
{
  "peakConcentration": 12.340,
  "peakTime": "2024-12-07T16:00:00Z",
  "peakHour": 2,
  "averageConcentration": 5.123
}
```

---

## Visualization System

### Heatmap Color Scale

The visualization uses a 5-level color scheme based on normalized concentration:

```text
Normalized Value (C / maxConcentration)    Color    Meaning
─────────────────────────────────────────────────────────────
0.0 - 0.2                                  🟢 Green Low
0.2 - 0.4                                  🟡 Yellow Moderate
0.4 - 0.7                                  🟠 Orange Elevated
0.7 - 0.9                                  🔴 Red High
0.9 - 1.0                                  🟤 Dark Red Critical
```

**Code Implementation** (`client/components/DispersionVisualization.tsx`):

```typescript
function getColorForValue(value: number): string {
  if (value < 0.2) {
    // Green to Yellow gradient
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
  }
  // ... and so on for other ranges
}
```

### Visual Elements

#### 1. Heatmap Grid

- **What it shows**: Concentration at each location
- **Color intensity**: Darker = higher concentration
- **Cell size**: 200m × 200m (adjustable)

#### 2. Source Marker

- **Black dot** at center-left of canvas
- Represents the emission source (chimney location)

#### 3. Wind Direction Arrow

- **Blue arrow** pointing in wind direction
- Arrow length proportional to wind speed
- Shows which way pollution is traveling

#### 4. Timeline Slider

- **Horizontal slider** to navigate through 24 hours
- Shows: "Hour 5 of 24" and timestamp

#### 5. Info Panel

```text
Wind Speed: 5.20 m/s
Wind Dir: 180°
Max Conc: 8.742 g/m³
Peak: 78.3% of daily max
```

### Interactive Controls

#### Play/Pause Animation

- Automatically cycles through all 24 hours
- 500ms delay between frames
- Pauses at end

#### Reset Button

- Returns to Hour 0
- Useful after viewing entire animation

#### Export Frames Button

- Generates all frames as individual PNG images
- Compresses into ZIP file
- Downloads automatically

**Export Function** (`client/components/DispersionVisualization.tsx`):

```typescript
const exportAsFrames = async () => {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const framesFolder = zip.folder("frames");

  // For each hour, render frame and add to ZIP
  for (let i = 0; i < results.length; i++) {
    const canvas = document.createElement("canvas");
    // ... render frame ...
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/png");
    });
    framesFolder.file(`frame-${String(i + 1).padStart(3, "0")}.png`, blob);
  }

  // Download ZIP
  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `dispersion-frames-${date}.zip`;
  link.click();
};
```

---

## Real-World Applications

### 1. Environmental Impact Assessment (EIA)

**Scenario**: Factory wants to build new chemical plant

**Process**:

1. Input: Location, planned emission rate, stack height
2. Simulate: 24-hour average with typical wind conditions
3. Analyze: Will concentrations exceed EPA standards at nearby homes?
4. Decision: Approve, deny, or require pollution controls

**Real Example**:

```text
Proposed: PCB manufacturing plant
Location: 34.05°N, 118.25°W (Los Angeles area)
Emission: 50 g/s PCB vapor
Stack: 100m height
EPA limit: 0.1 ng/m³ (8-hour average)

Simulation Result: 0.08 ng/m³ at nearest residence (500m away)
Decision: APPROVED (below EPA limit with safety margin)
```

### 2. Regulatory Compliance

**Scenario**: Existing factory seeking permit renewal

**Requirements**:

- Show worst-case 1-hour scenario
- Assume unfavorable stability class (F)
- Assume worst wind direction (toward populated area)

**Code Pattern**:

```typescript
// Worst-case simulation parameters
const worstCase = {
  stabilityClass: "F", // Most stable (worst dispersion)
  duration: 1, // 1-hour average
  useAutoWeather: false,
  windSpeed: 2.0, // Light wind (poor dispersion)
  windDirection: 180, // Toward city
};
```

### 3. Emergency Response

**Scenario**: Chemical plant accident with toxic gas release

**Immediate Response**:

1. **First 15 minutes**: Estimate leak size (g/s)
2. **Run simulation**: 1-6 hour duration with current wind
3. **Output**: Evacuation radius showing dangerous zones
4. **Action**: Issue warnings, prepare evacuations

**Example**:

```text
Incident: Ammonia leak
Estimated rate: 500 g/s
Current wind: 3 m/s from North
Stability: D (afternoon)

Result: 50 ppm concentration extends 2 km downwind
        OSHA 15-min exposure limit: 35 ppm

Action: Evacuate 3 km radius as safety margin
```

### 4. Urban Planning & Zoning

**Scenario**: City developing industrial zone

**Question**: Where should residential areas go relative to factories?

**Answer**: Simulation shows prevailing wind patterns

```text
Analysis:
- Prevailing wind in area: From West (270°)
- Pollution blown toward East
- Recommendation: Zone residences WEST of factories
                 (upwind, away from pollution)
```

### 5. Air Quality Forecasting

**Scenario**: Meteorologist predicting poor air quality day

**Process**:

1. Forecast weather: Stable conditions expected
2. Run simulation: All area sources with typical emissions
3. Predict: AQI will be UNHEALTHY
4. Warn: Public advised to reduce outdoor activity

**Code**:

```typescript
// Forecasting scenario
const forecast = {
  useAutoWeather: true, // Use real weather forecast
  latitude,
  longitude, // For all factories in area
  duration: 24,
};

// If results show AQI > 150:
// Issue "Code Red" air quality alert
```

### 6. Industrial Process Optimization

**Scenario**: Pharmaceutical plant deciding on pollution control

**Question**: Is taller stack better than treating emissions?

**Comparison**:

```text
Option A: Build 50m stack (current)
Result: 5 g/m³ at nearest residence

Option B: Build 100m stack (cost: $2M)
Result: 1 g/m³ at nearest residence

Option C: Install scrubber (cost: $5M)
Result: 0.5 g/m³ at nearest residence

Decision: Option B has best cost/benefit ratio
```

---

## Setup and Usage

### Prerequisites

- Node.js 18+ and npm/pnpm
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Open-Meteo weather API)

### Installation

```bash
# Clone repository
git clone https://github.com/jcodes5/-60pollution-20dispersion-20model.git
cd -60pollution-20dispersion-20model

# Install dependencies
pnpm install

# Install additional dependencies
pnpm install jszip  # For frame export
pnpm install gif.js # Optional: for GIF export (in development)
```

### Running the Application

```bash
# Development server (hot reload)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test

# Type checking
pnpm typecheck
```

### Development Server

The app runs on `http://localhost:8080` with:

- Frontend: React SPA with hot reload
- Backend: Express API server
- Both run on same port via Vite proxy

### Project Structure

```text
client/
├── pages/
│   ├── Simulator.tsx          # Main simulation UI
│   └── Index.tsx
├── components/
│   ├── SimulatorControls.tsx  # Input form
│   ├── DispersionVisualization.tsx  # Heatmap
│   ├── ConcentrationChart.tsx # Time series graph
│   ├── ConcentrationTable.tsx # Results table
│   └── ui/                    # Pre-built Radix components
└── lib/
    ├── export-utils.ts        # CSV/ZIP export functions
    └── utils.ts

server/
├── index.ts                   # Express server setup
├── routes/
│   ├── simulate.ts            # /api/simulate endpoint
│   ├── forecast.ts            # /api/forecast endpoint
│   └── demo.ts                # /api/demo endpoint
└── utils/
    ├── gaussian-plume.ts      # Dispersion model
    └── open-meteo.ts          # Weather API client

shared/
└── api.ts                     # TypeScript interfaces

```

### Environment Variables

Create `.env` file (optional):

```bash
VITE_API_URL=http://localhost:8080
NODE_ENV=development
```

---

## Technical Architecture

### Frontend Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool (fast HMR)
- **TailwindCSS 3**: Styling
- **Radix UI**: Component library
- **Recharts**: Charts and graphs
- **React Query**: Data fetching and caching
- **React Router 6**: SPA routing

### Backend Stack

- **Express**: Web server
- **TypeScript**: Type safety
- **Node.js 18+**: Runtime
- **Vite (SSR mode)**: Dev server integration

### Data Flow

```typescript
// Client sends simulation parameters
const params: SimulationParams = {
  latitude: number,
  longitude: number,
  emissionRate: number,
  sourceHeight: number,
  stabilityClass: string,
  duration: number,
  useAutoWeather: boolean,
  windSpeed?: number,      // Optional
  windDirection?: number   // Optional
};

// Server validates and processes
// Returns SimulationResponse with results

interface SimulationResponse {
  success: boolean;
  results: DispersionResult[];  // 24 objects (one per hour)
  stats: {
    peakConcentration: number;
    peakTime: string;
    peakHour: number;
    averageConcentration: number;
  };
  error?: string;
}

// Frontend displays results in visualization
```

### API Endpoints

#### POST `/api/simulate`

**Request**:

```json
{
  "latitude": 40.7128,
  "longitude": -74.006,
  "emissionRate": 10,
  "sourceHeight": 50,
  "stabilityClass": "D",
  "duration": 24,
  "useAutoWeather": true
}
```

**Response**:

```json
{
  "success": true,
  "results": [
    {
      "time": "2024-12-07T00:00:00Z",
      "hour": 0,
      "maxConcentration": 8.742,
      "concentrationGrid": [[...]],
      "gridPoints": {"x": [...], "y": [...]},
      "windSpeed": 5.2,
      "windDirection": 180
    },
    ...
  ],
  "stats": {
    "peakConcentration": 12.340,
    "peakTime": "2024-12-07T16:00:00Z",
    "peakHour": 2,
    "averageConcentration": 5.123
  }
}
```

#### GET `/api/forecast`

**Query Parameters**:

```text
latitude=40.7128&longitude=-74.006&hours=24
```

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "time": "2024-12-07T00:00:00Z",
      "windSpeed": 5.2,
      "windDirection": 180,
      "temperature": 8.5
    },
    ...
  ],
  "location": {"lat": 40.7128, "lon": -74.006}
}
```

### System Features

1. **Type Safety**: Full TypeScript prevents runtime errors
2. **Error Handling**: Comprehensive validation and error messages
3. **Responsive Design**: Works on desktop, tablet, mobile
4. **Performance**: Optimized rendering and calculations
5. **Accessibility**: WCAG compliant UI components
6. **Extensibility**: Easy to add new features (dispersion models, pollutant types, etc.)

---

## Troubleshooting

### Dev Server Won't Start

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Weather API Not Working

```bash
# Check internet connection
# Open-Meteo is free but has rate limits
# If rate limited, wait 1 hour or use manual weather mode
```

### Simulation Produces No Results

```bash
# Check browser console for errors
# Ensure all required parameters are entered
# Verify latitude/longitude are valid (±90/-180 to 180)
```

### Visualization Not Showing

```bash
# Run simulation first (results must not be empty)
# Check browser console for JavaScript errors
# Try different browser (Chrome, Firefox)
```

---

## References

### Scientific Papers

- Turner, D.B. (1994). Workbook of atmospheric dispersion estimates
- Pasquill, F. & Smith, FB. (1983). Atmospheric diffusion
- EPA (2016). Guideline on Air Quality Models

### Standards

- EPA 40 CFR Part 51 Appendix W
- AIEE Guidelines
- ISO 12944 (Atmospheric corrosivity classification)

### APIs Used

- [Open-Meteo Weather API](https://open-meteo.com/)
- No API key required

### Tools & Libraries

- [gif.js](https://github.com/jnordberg/gif.js)
- [jszip](https://stuk.github.io/jszip/)
- [Recharts](https://recharts.org/)

---

## License

This project is part of a pollution dispersion modeling system for environmental applications.

## Support

For questions or issues, please contact the development team or file an issue on the repository.

---

_Last Updated: December 7, 2025_
_Version: 1.0.0_
