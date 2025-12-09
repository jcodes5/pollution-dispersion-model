import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function APIReference() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints = [
    {
      method: "POST",
      path: "/api/simulate",
      description: "Run a pollution dispersion simulation",
      params: [
        {
          name: "latitude",
          type: "number",
          required: true,
          desc: "GPS latitude (-90 to 90)",
        },
        {
          name: "longitude",
          type: "number",
          required: true,
          desc: "GPS longitude (-180 to 180)",
        },
        {
          name: "emissionRate",
          type: "number",
          required: true,
          desc: "Emission rate in g/s",
        },
        {
          name: "sourceHeight",
          type: "number",
          required: true,
          desc: "Stack height in meters",
        },
        {
          name: "stabilityClass",
          type: "string",
          required: true,
          desc: "Pasquill class (A-F)",
        },
        {
          name: "duration",
          type: "number",
          required: true,
          desc: "Simulation hours",
        },
        {
          name: "useAutoWeather",
          type: "boolean",
          required: true,
          desc: "Fetch real weather data",
        },
        {
          name: "windSpeed",
          type: "number",
          required: false,
          desc: "Manual wind speed (m/s)",
        },
        {
          name: "windDirection",
          type: "number",
          required: false,
          desc: "Manual wind direction (degrees)",
        },
      ],
      example: `{
  "latitude": 40.7128,
  "longitude": -74.006,
  "emissionRate": 10,
  "sourceHeight": 50,
  "stabilityClass": "D",
  "duration": 24,
  "useAutoWeather": true
}`,
    },
    {
      method: "POST",
      path: "/api/forecast",
      description: "Get weather forecast data",
      params: [
        {
          name: "latitude",
          type: "number",
          required: true,
          desc: "GPS latitude",
        },
        {
          name: "longitude",
          type: "number",
          required: true,
          desc: "GPS longitude",
        },
        {
          name: "hours",
          type: "number",
          required: false,
          desc: "Hours to forecast (1-48)",
        },
      ],
      example: `{
  "latitude": 40.7128,
  "longitude": -74.006,
  "hours": 24
}`,
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              API Reference
            </h1>
            <p className="text-xl text-muted-foreground mt-4 max-w-2xl">
              Complete documentation for the DispersionSim REST API
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6 max-w-4xl">
          {/* Introduction */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Getting Started</h2>
            <p className="text-muted-foreground mb-4">
              The DispersionSim API allows you to programmatically run pollution
              dispersion simulations and fetch meteorological data.
            </p>
            <Card className="p-6 bg-muted/30">
              <p className="font-mono text-sm">
                Base URL:{" "}
                <code className="bg-muted px-2 py-1 rounded">
                  https://pollution-dispersion-model.vercel.app/api
                </code>
              </p>
            </Card>
          </div>

          {/* Endpoints */}
          <div className="space-y-8">
            {endpoints.map((endpoint, idx) => (
              <div key={idx} className="border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`px-3 py-1 rounded text-sm font-bold text-white ${
                      endpoint.method === "POST"
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                  >
                    {endpoint.method}
                  </div>
                  <code className="text-lg font-mono text-foreground">
                    {endpoint.path}
                  </code>
                </div>

                <p className="text-muted-foreground mb-6">
                  {endpoint.description}
                </p>

                {/* Parameters */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Parameters</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3">Name</th>
                          <th className="text-left py-2 px-3">Type</th>
                          <th className="text-left py-2 px-3">Required</th>
                          <th className="text-left py-2 px-3">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {endpoint.params.map((param, pidx) => (
                          <tr key={pidx} className="border-b">
                            <td className="py-2 px-3 font-mono text-primary">
                              {param.name}
                            </td>
                            <td className="py-2 px-3 text-muted-foreground">
                              {param.type}
                            </td>
                            <td className="py-2 px-3">
                              {param.required ? "✓" : "○"}
                            </td>
                            <td className="py-2 px-3 text-muted-foreground">
                              {param.desc}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Example */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Request Example</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm text-foreground font-mono">
                        {endpoint.example}
                      </code>
                    </pre>
                    <button
                      onClick={() =>
                        copyToClipboard(endpoint.example, `example-${idx}`)
                      }
                      className="absolute top-2 right-2 p-2 rounded bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      {copiedCode === `example-${idx}` ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rate Limits */}
          <div className="mt-12 p-6 border rounded-lg bg-muted/30">
            <h3 className="text-xl font-bold mb-3">Rate Limits</h3>
            <p className="text-muted-foreground">
              There are no rate limits on the DispersionSim API. Feel free to
              make as many requests as you need!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
