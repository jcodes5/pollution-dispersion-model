import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DocSection {
  title: string;
  content: string;
}

const docSections: DocSection[] = [
  {
    title: "Getting Started",
    content: `DispersionSim is a web-based air pollutant dispersion simulator that requires no installation. Simply open your browser, navigate to the application, and start modeling.

Key Requirements:
• Modern web browser (Chrome, Firefox, Safari, Edge)
• Internet connection for weather data fetching
• Basic understanding of atmospheric dispersion concepts

The application is organized into three main sections:
1. Home - Overview and feature information
2. Simulator - Where you run your dispersion models
3. Documentation - In-depth guides and technical information`,
  },
  {
    title: "Input Parameters",
    content: `Understanding Input Parameters:

Location (Required):
• Latitude: Decimal format, range -90 to 90
• Longitude: Decimal format, range -180 to 180
• Example: 40.7128° N, 74.0060° W (New York City)

Emission Source (Required):
• Emission Rate: Mass per unit time (g/s), typical range 0.1-1000
• Source Height: Height above ground in meters, typical range 5-500m
• Temperature: Temperature of released gases in Celsius

Pollutant Type (Required):
• PM2.5: Fine particulate matter (diameter < 2.5 micrometers)
• PM10: Coarse particulate matter (diameter < 10 micrometers)
• Other: Generic particulate simulation

Duration:
• Simulation length: 1-48 hours ahead`,
  },
  {
    title: "Gaussian Plume Model",
    content: `The Gaussian Plume Model Explained:

The Gaussian Plume Model is a mathematical representation of how pollutants disperse in the atmosphere. Key assumptions:

1. Continuous Point Source: A steady emission from a single location
2. Gaussian Distribution: Concentration decreases exponentially with distance
3. Steady-State Conditions: Wind direction and speed remain relatively constant
4. Flat Terrain: Assumes no major topographic influences

The Model Equation:
C = (Q / (2π * u * σy * σz)) * exp(-y²/(2σy²)) * exp(-(z-H)²/(2σz²))

Where:
• C = Concentration at receptor point
• Q = Emission rate
• u = Wind speed
• σy, σz = Dispersion parameters (depend on stability class and distance)
• H = Effective plume height
• y, z = Horizontal and vertical distances from plume centerline

Stability Classes (Pasquill-Gifford):
• A: Very Unstable - Creates maximum spread, typically midday with clear skies
• B: Unstable - Day with moderate mixing
• C: Slightly Unstable - Day with weak mixing
• D: Neutral - Night or overcast conditions
• E: Stable - Night with clear skies
• F: Very Stable - Night with strong inversion

Dispersion parameters increase with distance and vary by stability class.`,
  },
  {
    title: "Weather Data Integration",
    content: `Weather Data Sources:

DispersionSim uses the Open-Meteo API to fetch meteorological data:
• Free, open-source weather service
• No API key required
• Global coverage for any latitude/longitude
• 48-hour forecast data with 1-hour resolution

Data Retrieved:
• Wind Speed (m/s): Used to calculate plume transport
• Wind Direction (°): Determines direction of dispersion
• Temperature (°C): Affects plume buoyancy and rise
• Cloud Cover (%): Influences atmospheric stability
• Relative Humidity (%): Affects particle behavior

Data Quality:
The accuracy of simulations depends on forecast accuracy. Weather forecasts are generally:
• Most accurate: 0-24 hours ahead
• Reasonable accuracy: 24-48 hours ahead
• Decreasing accuracy: Beyond 48 hours

Note: Actual weather may differ from forecasts. Always consider forecast uncertainty in your analysis.`,
  },
  {
    title: "Interpreting Results",
    content: `Understanding Your Simulation Results:

Visualization Tab:
The 2D dispersion map shows:
• Source location (marked point)
• Concentration distribution (color scale)
• Wind direction (arrow indicator)
• Plume shape reflecting wind and atmospheric conditions

Color Coding:
• Green: Low concentration (< 20% of peak)
• Yellow: Moderate concentration (20-40%)
• Orange: Elevated concentration (40-70%)
• Red: High concentration (70-90%)
• Dark Red: Critical levels (> 90%)

Time Series Tab:
Line graph showing:
• X-axis: Time (24-48 hours)
• Y-axis: Concentration (µg/m³)
• Peak identification: When maximum concentration occurs
• Trends: Whether concentration is increasing or decreasing

Details Tab:
Hourly statistics including:
• Hour number and timestamp
• Peak concentration for that hour
• Average concentration across modeling domain
• Wind speed and direction at that time
• Peak hour indicator

Key Metrics:
• Peak Concentration: Maximum concentration anywhere in domain
• Average Concentration: Mean across all hours simulated
• Peak Hour: When maximum concentration occurs
• Duration: Total simulation period`,
  },
  {
    title: "Advanced Topics",
    content: `Advanced Modeling Concepts:

Plume Rise:
Beyond the initial source height, plume rises due to:
• Thermal buoyancy: Hot emissions rise
• Momentum: High-velocity emissions have initial upward momentum
• Atmospheric wind: Carries plume downwind

Factors affecting plume rise:
• Emission temperature
• Wind speed (higher wind = more plume tilt)
• Atmospheric stability (stable air suppresses rise)

Dispersion:
The spreading of the plume is governed by:
• Turbulence intensity (varies by stability class)
• Distance from source (dispersion increases with distance)
• Atmospheric conditions (unstable = more mixing)

Depositional Effects:
Advanced users can consider:
• Gravitational settling (for larger particles)
• Dry deposition (particles to surfaces)
• Wet deposition (removal by precipitation)
• Chemical reactions (for reactive pollutants)

Note: Basic DispersionSim does not model these effects. For complex scenarios, consult specialized air quality models like AERMOD or CALPUFF.`,
  },
];

function DocSection({ section }: { section: DocSection }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-l-4 border-l-primary">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
      >
        <h3 className="font-semibold text-lg text-foreground">
          {section.title}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {section.content}
          </div>
        </div>
      )}
    </Card>
  );
}

export default function Documentation() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-20 lg:py-28 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground mb-4">
              Technical Documentation
            </h1>
            <p className="text-xl text-muted-foreground">
              In-depth guides and technical reference material
            </p>
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {docSections.map((section, index) => (
              <DocSection key={index} section={section} />
            ))}
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              References & Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  EPA Air Quality Modeling
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Official US EPA guidance on air dispersion modeling
                </p>
                <a
                  href="https://www.epa.gov/scram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  Visit EPA SCRAM
                </a>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Open-Meteo Weather API
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Free, open-source weather data provider
                </p>
                <a
                  href="https://open-meteo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  Visit Open-Meteo
                </a>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Gaussian Plume Theory
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Academic resources on dispersion modeling
                </p>
                <a
                  href="#"
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  Learn More
                </a>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Atmospheric Science Basics
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Introduction to meteorology and air quality
                </p>
                <a
                  href="#"
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  Learn More
                </a>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
