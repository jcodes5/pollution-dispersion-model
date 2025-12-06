import { Link } from "react-router-dom";
import { Wind, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface HeaderProps {
  currentPath?: string;
}

export default function Header({ currentPath = "/" }: HeaderProps) {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/simulator", label: "Simulator" },
    { path: "/about", label: "About" },
  ];

  const resourceItems = [
    { path: "/how-to-use", label: "How to Use" },
    { path: "/documentation", label: "Documentation" },
    { path: "/faq", label: "FAQ" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and brand */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
            <Wind className="w-6 h-6" />
          </div>
          <span className="hidden text-lg font-bold text-foreground sm:inline">
            DispersionSim
          </span>
          <span className="text-lg font-bold text-foreground sm:hidden">
            PDS
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 md:gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                currentPath === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted",
              )}
            >
              {item.label}
            </Link>
          ))}

          {/* Resources Dropdown */}
          <div className="relative group">
            <button
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1",
                resourceItems.some((item) => currentPath === item.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted",
              )}
              onMouseEnter={() => setIsResourcesOpen(true)}
              onMouseLeave={() => setIsResourcesOpen(false)}
            >
              Resources
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {isResourcesOpen && (
              <div
                className="absolute top-full right-0 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50"
                onMouseEnter={() => setIsResourcesOpen(true)}
                onMouseLeave={() => setIsResourcesOpen(false)}
              >
                {resourceItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "block px-4 py-2 text-sm transition-colors",
                      currentPath === item.path
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
