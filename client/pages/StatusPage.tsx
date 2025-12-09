import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function StatusPage() {
  const services = [
    {
      name: "Web Application",
      status: "operational",
      uptime: "99.9%",
      lastIncident: "2025-12-01",
      description: "DispersionSim main web interface",
    },
    {
      name: "API Server",
      status: "operational",
      uptime: "99.8%",
      lastIncident: "2025-11-28",
      description: "REST API endpoints for simulations",
    },
    {
      name: "Weather Data Service",
      status: "operational",
      uptime: "99.95%",
      lastIncident: "2025-11-15",
      description: "Open-Meteo integration and data fetching",
    },
    {
      name: "Database",
      status: "operational",
      uptime: "99.99%",
      lastIncident: "2025-10-20",
      description: "Data storage and retrieval",
    },
  ];

  const incidents = [
    {
      date: "2025-12-01",
      title: "Scheduled Maintenance",
      description:
        "Database optimization. Expected duration: 2 hours. Completed on time.",
      severity: "low",
      duration: "2h",
    },
    {
      date: "2025-11-28",
      title: "Brief API Slowdown",
      description:
        "Temporary increase in API response times due to high traffic. Resolved after 15 minutes.",
      severity: "low",
      duration: "15m",
    },
  ];

  const getStatusIcon = (status: string) => {
    if (status === "operational")
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === "degraded")
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    return <AlertCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (status: string) => {
    if (status === "operational")
      return "bg-green-500/10 text-green-700 border-green-200";
    if (status === "degraded")
      return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
    return "bg-red-500/10 text-red-700 border-red-200";
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              System Status
            </h1>
            <p className="text-xl text-muted-foreground mt-4">
              Current status of all DispersionSim services
            </p>
          </div>
        </div>
      </section>

      {/* Overall Status */}
      <section className="w-full py-12 md:py-16">
        <div className="container px-4 md:px-6 max-w-3xl">
          <Card className="p-8 border-2 border-green-200 bg-green-500/5">
            <div className="flex items-center gap-4 mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  All Systems Operational
                </h2>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground">
              All DispersionSim services are running normally. No active
              incidents.
            </p>
          </Card>
        </div>
      </section>

      {/* Services Grid */}
      <section className="w-full py-12 md:py-16 border-t">
        <div className="container px-4 md:px-6 max-w-3xl">
          <h2 className="text-2xl font-bold mb-8">Service Status</h2>
          <div className="space-y-4">
            {services.map((service, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(service.status)}
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {service.description}
                    </p>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground">Uptime: </span>
                        <span className="font-semibold text-foreground">
                          {service.uptime}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Last Incident:{" "}
                        </span>
                        <span className="font-semibold text-foreground">
                          {service.lastIncident}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(service.status)} border`}>
                    {service.status.charAt(0).toUpperCase() +
                      service.status.slice(1)}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Incident History */}
      <section className="w-full py-12 md:py-16 border-t bg-muted/30">
        <div className="container px-4 md:px-6 max-w-3xl">
          <h2 className="text-2xl font-bold mb-8">Incident History</h2>
          <div className="space-y-4">
            {incidents.map((incident, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{incident.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {incident.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-muted-foreground">
                      {incident.duration}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {incident.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Uptime Stats */}
      <section className="w-full py-12 md:py-16 border-t">
        <div className="container px-4 md:px-6 max-w-3xl">
          <h2 className="text-2xl font-bold mb-8">Uptime Statistics</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { label: "Today", value: "100%" },
              { label: "This Week", value: "99.9%" },
              { label: "This Month", value: "99.8%" },
              { label: "This Year", value: "99.9%" },
            ].map((stat, idx) => (
              <Card key={idx} className="p-6 text-center">
                <p className="text-3xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
