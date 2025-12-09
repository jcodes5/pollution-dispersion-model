import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  MessageSquare,
  FileQuestion,
  Video,
  Mail,
  Search,
} from "lucide-react";

export default function HelpCenter() {
  const resources = [
    {
      icon: BookOpen,
      title: "Getting Started Guide",
      description:
        "Learn the basics of using DispersionSim and running your first simulation.",
      link: "/how-to-use",
      category: "Tutorial",
    },
    {
      icon: FileQuestion,
      title: "Frequently Asked Questions",
      description:
        "Find answers to common questions about the simulator and dispersion modeling.",
      link: "/faq",
      category: "FAQ",
    },
    {
      icon: Video,
      title: "Understanding Gaussian Plume Model",
      description:
        "Deep dive into the mathematical foundations of the dispersion model.",
      link: "/documentation",
      category: "Science",
    },
    {
      icon: MessageSquare,
      title: "Community Forum",
      description:
        "Connect with other users, ask questions, and share insights.",
      link: "/community",
      category: "Community",
    },
    {
      icon: FileQuestion,
      title: "API Documentation",
      description:
        "Integrate DispersionSim into your own applications with our REST API.",
      link: "/api-reference",
      category: "Development",
    },
    {
      icon: Mail,
      title: "Contact Support",
      description: "Get in touch with our team for technical assistance.",
      link: "/contact",
      category: "Support",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground mt-4 max-w-2xl">
              Find answers and learn how to get the most out of DispersionSim
            </p>

            {/* Search Box */}
            <div className="w-full max-w-md mt-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search help articles..."
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource, idx) => {
              const Icon = resource.icon;
              return (
                <Link key={idx} to={resource.link}>
                  <Card className="h-full p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer">
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-primary/70 mb-2 uppercase tracking-wide">
                        {resource.category}
                      </span>
                      <h3 className="text-lg font-semibold mb-3 text-foreground">
                        {resource.title}
                      </h3>
                      <p className="text-muted-foreground text-sm flex-grow">
                        {resource.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="w-full py-12 md:py-16 bg-muted/30 border-t">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-8">Popular Topics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              "How to set up a simulation",
              "Understanding stability classes",
              "Exporting simulation results",
              "Using real-time weather data",
              "API integration examples",
              "Troubleshooting common issues",
              "Regulatory compliance",
              "Best practices",
            ].map((topic, idx) => (
              <Link key={idx} to="#" className="group">
                <div className="p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {topic}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-16 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold">
              Can't find what you're looking for?
            </h2>
            <p className="text-muted-foreground max-w-md">
              Our support team is here to help. Get in touch with us directly.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
