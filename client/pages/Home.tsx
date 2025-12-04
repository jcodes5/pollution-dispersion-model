import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wind, Cloud, TrendingUp, Zap, Map, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                  Pollutant Dispersion Simulator
                </h1>
                <p className="text-xl text-muted-foreground mt-4">
                  Forecast air pollutant spread with advanced Gaussian plume
                  modeling. Integrate real-time meteorological data for accurate
                  predictions up to 48 hours ahead.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row pt-4">
                <Link to="/simulator">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Launch Simulator
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-md h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/30 rounded-full blur-3xl animate-pulse" />
                </div>
                <div className="relative z-10 text-center">
                  <Wind className="w-24 h-24 mx-auto text-primary mb-4" />
                  <p className="text-foreground font-semibold">
                    Dispersion Analysis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="w-full py-12 md:py-24 lg:py-32 bg-muted/30"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-foreground">
              Powerful Features
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Everything you need to model and visualize pollutant dispersion
              patterns with precision
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
              <div className="flex flex-col space-y-3">
                <Cloud className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-bold text-foreground">
                  Real-Time Weather
                </h3>
                <p className="text-muted-foreground">
                  Automatic meteorological data from Open-Meteo API with hourly
                  wind speed, direction, and temperature forecasts
                </p>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
              <div className="flex flex-col space-y-3">
                <Wind className="w-12 h-12 text-secondary" />
                <h3 className="text-xl font-bold text-foreground">
                  Gaussian Plume Model
                </h3>
                <p className="text-muted-foreground">
                  Industry-standard dispersion modeling based on Gaussian plume
                  theory with stability class corrections
                </p>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
              <div className="flex flex-col space-y-3">
                <Map className="w-12 h-12 text-accent" />
                <h3 className="text-xl font-bold text-foreground">
                  Visual Mapping
                </h3>
                <p className="text-muted-foreground">
                  Interactive 2D visualization of dispersion plumes with
                  color-coded concentration levels
                </p>
              </div>
            </Card>

            {/* Feature 4 */}
            <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
              <div className="flex flex-col space-y-3">
                <BarChart3 className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-bold text-foreground">
                  Time-Series Analytics
                </h3>
                <p className="text-muted-foreground">
                  Track concentration changes over 1-48 hours with interactive
                  charts and detailed statistics
                </p>
              </div>
            </Card>

            {/* Feature 5 */}
            <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
              <div className="flex flex-col space-y-3">
                <Zap className="w-12 h-12 text-secondary" />
                <h3 className="text-xl font-bold text-foreground">
                  Fast Processing
                </h3>
                <p className="text-muted-foreground">
                  Server-side computation for instant simulation results without
                  browser lag or performance issues
                </p>
              </div>
            </Card>

            {/* Feature 6 */}
            <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
              <div className="flex flex-col space-y-3">
                <TrendingUp className="w-12 h-12 text-accent" />
                <h3 className="text-xl font-bold text-foreground">
                  Customizable Inputs
                </h3>
                <p className="text-muted-foreground">
                  Full control over emission rate, source height, stability
                  class, and wind parameters
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-foreground">
              How It Works
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: "1",
                title: "Input Parameters",
                description:
                  "Enter emission rate, source height, stability class, and location",
              },
              {
                step: "2",
                title: "Fetch Weather",
                description:
                  "Automatically retrieve 48-hour meteorological forecast data",
              },
              {
                step: "3",
                title: "Calculate Dispersion",
                description:
                  "Run Gaussian plume model for each hourly forecast step",
              },
              {
                step: "4",
                title: "Visualize Results",
                description:
                  "View animated dispersion maps and concentration charts",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-foreground">
              Ready to Simulate?
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Start modeling pollutant dispersion with our advanced simulator.
              No setup required — begin immediately.
            </p>
            <Link to="/simulator">
              <Button size="lg" className="bg-primary hover:bg-primary/90 mt-4">
                Launch Simulator Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
