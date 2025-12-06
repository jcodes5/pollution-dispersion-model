import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Settings, Play, BarChart3, Download } from "lucide-react";

export default function HowToUse() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-20 lg:py-28 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground mb-4">
              How to Use DispersionSim
            </h1>
            <p className="text-xl text-muted-foreground">
              A step-by-step guide to running your first simulation
            </p>
          </div>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Step 1 */}
            <Card className="p-6 border-l-4 border-l-primary">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-primary" />
                    Select Your Location
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Navigate to the Simulator page and enter the geographic coordinates where you want to model pollutant dispersion. You can specify:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Latitude (North-South position)</li>
                    <li>Longitude (East-West position)</li>
                    <li>Any location on Earth with weather data available</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="p-6 border-l-4 border-l-secondary">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-secondary" />
                    Configure Emission Parameters
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Set up your emission source characteristics:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>Emission Rate:</strong> Mass per second (g/s) of pollutant being released</li>
                    <li><strong>Source Height:</strong> Height above ground where emissions occur (meters)</li>
                    <li><strong>Temperature:</strong> Emission temperature for buoyancy calculations</li>
                    <li><strong>Pollutant Type:</strong> PM2.5, PM10, or other particulates</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="p-6 border-l-4 border-l-accent">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <Play className="w-6 h-6 text-accent" />
                    Run Simulation
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Click the "Run Simulation" button to process your parameters:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>The system automatically fetches 48-hour weather forecast data</li>
                    <li>Gaussian plume model calculations are performed for each hour</li>
                    <li>Results are generated typically within seconds</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Step 4 */}
            <Card className="p-6 border-l-4 border-l-primary">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    Analyze Results
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Explore three comprehensive visualization tabs:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>Visualization:</strong> Interactive 2D map showing dispersion plume and concentration heatmap</li>
                    <li><strong>Time Series:</strong> Line graph showing concentration changes over 48 hours</li>
                    <li><strong>Details:</strong> Detailed hourly statistics and peak concentration data</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Step 5 */}
            <Card className="p-6 border-l-4 border-l-secondary">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <Download className="w-6 h-6 text-secondary" />
                    Export Data (Optional)
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Export your results for further analysis:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Download results as CSV files for spreadsheet analysis</li>
                    <li>Integrate data with other modeling tools</li>
                    <li>Create custom reports and presentations</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground text-center mb-12">
            Pro Tips
          </h2>
          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-2">
                📍 Accuracy with Coordinates
              </h3>
              <p className="text-sm text-muted-foreground">
                Use precise coordinates for your location. Even small variations can affect wind patterns and dispersion results.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-2">
                ⚙️ Stability Class Selection
              </h3>
              <p className="text-sm text-muted-foreground">
                Select the appropriate atmospheric stability class based on time of day and cloud cover for more realistic modeling.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-2">
                🌡️ Temperature Effects
              </h3>
              <p className="text-sm text-muted-foreground">
                Higher emission temperatures result in more buoyancy and higher rise of the plume above ground.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-2">
                📊 Compare Scenarios
              </h3>
              <p className="text-sm text-muted-foreground">
                Run multiple simulations with different parameters to understand how each factor affects dispersion.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Launch the simulator and run your first dispersion analysis now. No setup required.
            </p>
            <Link to="/simulator">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Go to Simulator
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
