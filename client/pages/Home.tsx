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
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Launch Simulator
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 hover:bg-muted/50 transition-all duration-200"
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
              <div className="relative w-full max-w-md h-80 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl">
                <img
                  src="/hero-dispersion.png"
                  alt="Pollution dispersion visualization showing heat map pattern"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 md:py-32 bg-muted/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
              Powerful Features
            </h2>
            <p className="max-w-2xl text-xl text-muted-foreground leading-relaxed">
              Everything you need to model and visualize pollutant dispersion
              patterns with precision
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group p-8 bg-background rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col space-y-4">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Cloud className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Real-Time Weather
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Automatic meteorological data from Open-Meteo API with hourly
                  wind speed, direction, and temperature forecasts
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-background rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col space-y-4">
                <div className="w-14 h-14 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Wind className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Gaussian Plume Model
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Industry-standard dispersion modeling based on Gaussian plume
                  theory with stability class corrections
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-background rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col space-y-4">
                <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Map className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Visual Mapping
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Interactive 2D visualization of dispersion plumes with
                  color-coded concentration levels
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 bg-background rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col space-y-4">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Time-Series Analytics
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track concentration changes over 1-48 hours with interactive
                  charts and detailed statistics
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 bg-background rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col space-y-4">
                <div className="w-14 h-14 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Zap className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Fast Processing
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Server-side computation for instant simulation results without
                  browser lag or performance issues
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 bg-background rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col space-y-4">
                <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <TrendingUp className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Customizable Inputs
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Full control over emission rate, source height, stability
                  class, and wind parameters
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
              How It Works
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-4 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Input Parameters",
                description:
                  "Enter emission rate, source height, stability class, and location",
              },
              {
                step: "02",
                title: "Fetch Weather",
                description:
                  "Automatically retrieve 48-hour meteorological forecast data",
              },
              {
                step: "03",
                title: "Calculate Dispersion",
                description:
                  "Run Gaussian plume model for each hourly forecast step",
              },
              {
                step: "04",
                title: "Visualize Results",
                description:
                  "View animated dispersion maps and concentration charts",
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className="flex flex-col space-y-6 text-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-light text-primary">
                      {item.step}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-px bg-border transform -translate-x-8" />
                  )}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-8 text-center max-w-3xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
                Ready to Simulate?
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Start modeling pollutant dispersion with our advanced simulator.
                No setup required — begin immediately.
              </p>
            </div>
            <Link to="/simulator">
              <Button
                size="lg"
                className="px-10 py-6 text-lg font-medium bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Launch Simulator Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
