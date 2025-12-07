import { Link } from "react-router-dom";
import { Wind } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/50 bg-muted/20">
      <div className="container px-6 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                <Wind className="w-5 h-5" />
              </div>
              <span className="text-lg font-semibold text-foreground">
                DispersionSim
              </span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-sm">
              Advanced air quality modeling made accessible to everyone. Forecast pollutant spread with precision using Gaussian plume modeling and real-time meteorological data.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
              >
                <span className="text-sm font-semibold">GH</span>
              </a>
              <a
                href="https://open-meteo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
              >
                <span className="text-sm font-semibold">OM</span>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Product
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/simulator"
                  className="hover:text-primary transition-colors"
                >
                  Simulator
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Resources
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/how-to-use"
                  className="hover:text-primary transition-colors"
                >
                  How to Use
                </Link>
              </li>
              <li>
                <Link
                  to="/documentation"
                  className="hover:text-primary transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors"
                >
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Support
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors"
                >
                  Status Page
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} DispersionSim. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Powered by Open-Meteo</span>
            <span>•</span>
            <span>Gaussian Plume Theory</span>
            <span>•</span>
            <span>Built with React & TypeScript</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
