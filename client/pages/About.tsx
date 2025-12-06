import { Card } from "@/components/ui/card";
import { Wind, Users, Target, Lightbulb } from "lucide-react";

export default function About() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-20 lg:py-28 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground mb-4">
              About DispersionSim
            </h1>
            <p className="text-xl text-muted-foreground">
              Advanced air quality modeling made accessible to everyone
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                DispersionSim is dedicated to democratizing air pollution modeling. We believe that understanding how pollutants disperse in the atmosphere should be accessible to researchers, environmental agencies, educators, and concerned citizens worldwide.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                By combining proven atmospheric dispersion modeling techniques with real-time meteorological data and intuitive visualization tools, we empower users to make informed decisions about air quality and environmental impact.
              </p>
              <p className="text-lg text-muted-foreground">
                Our platform removes the complexity and cost barriers of traditional air quality modeling software, making professional-grade analysis available to everyone.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-sm h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-8 left-8 w-24 h-24 bg-primary/30 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute bottom-12 right-8 w-32 h-32 bg-secondary/30 rounded-full blur-2xl animate-pulse" />
                </div>
                <Target className="w-20 h-20 text-primary relative z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground text-center mb-12">
            What We Offer
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <Wind className="w-10 h-10 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">
                Advanced Modeling
              </h3>
              <p className="text-sm text-muted-foreground">
                Industry-standard Gaussian plume dispersion modeling for accurate pollutant spread prediction.
              </p>
            </Card>

            <Card className="p-6">
              <Target className="w-10 h-10 text-secondary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">
                Precision Forecasting
              </h3>
              <p className="text-sm text-muted-foreground">
                Real-time meteorological data integration for accurate up to 48-hour ahead predictions.
              </p>
            </Card>

            <Card className="p-6">
              <Lightbulb className="w-10 h-10 text-accent mb-3" />
              <h3 className="font-semibold text-foreground mb-2">
                Intuitive Design
              </h3>
              <p className="text-sm text-muted-foreground">
                User-friendly interface requiring no specialized knowledge to perform complex simulations.
              </p>
            </Card>

            <Card className="p-6">
              <Users className="w-10 h-10 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">
                Free & Open
              </h3>
              <p className="text-sm text-muted-foreground">
                Completely free to use with no registration required. Community-driven development.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground text-center mb-12">
            Built with Purpose
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-muted-foreground mb-4">
              DispersionSim was created by a team of environmental scientists, software engineers, and data specialists committed to making air quality modeling more accessible and impactful.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              Our platform leverages open-source technology and public weather data to provide accurate, reliable results without any commercial licensing fees or constraints.
            </p>
            <p className="text-lg text-muted-foreground">
              Whether you're an environmental consultant, researcher, educator, or activist, DispersionSim empowers you with the tools you need to understand and address air pollution.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground text-center mb-12">
            Powered By
          </h2>
          <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
            <Card className="p-4 text-center">
              <h3 className="font-semibold text-foreground mb-1">
                Gaussian Plume Theory
              </h3>
              <p className="text-sm text-muted-foreground">
                Industry-standard atmospheric dispersion model
              </p>
            </Card>
            <Card className="p-4 text-center">
              <h3 className="font-semibold text-foreground mb-1">
                Open-Meteo API
              </h3>
              <p className="text-sm text-muted-foreground">
                Real-time meteorological forecasts
              </p>
            </Card>
            <Card className="p-4 text-center">
              <h3 className="font-semibold text-foreground mb-1">
                Modern Web Tech
              </h3>
              <p className="text-sm text-muted-foreground">
                React, Node.js, and advanced visualization
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
