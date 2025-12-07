import { Link } from "react-router-dom";
import { Wind, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  currentPath?: string;
}

export default function Header({ currentPath = "/" }: HeaderProps) {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

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

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-4 md:px-8">
        {/* Logo and brand */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 group" onClick={closeMobileMenu}>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg group-hover:shadow-xl transition-all duration-200">
            <Wind className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="hidden text-xl font-semibold text-foreground sm:inline leading-tight">
              DispersionSim
            </span>
            <span className="text-xs text-muted-foreground sm:hidden font-medium">
              PDS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                currentPath === item.path
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground hover:bg-muted/80 hover:text-primary",
              )}
            >
              {item.label}
            </Link>
          ))}

          {/* Resources Dropdown */}
          <div className="relative group">
            <button
              className={cn(
                "px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2",
                resourceItems.some((item) => currentPath === item.path)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground hover:bg-muted/80 hover:text-primary",
              )}
              onMouseEnter={() => setIsResourcesOpen(true)}
              onMouseLeave={() => setIsResourcesOpen(false)}
              onClick={() => setIsResourcesOpen(!isResourcesOpen)}
            >
              Resources
              <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>

            {/* Dropdown Menu */}
            {isResourcesOpen && (
              <div
                className="absolute top-full right-0 mt-2 w-52 bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl py-3 z-50"
                onMouseEnter={() => setIsResourcesOpen(true)}
                onMouseLeave={() => setIsResourcesOpen(false)}
              >
                {resourceItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "block px-4 py-3 text-sm transition-all duration-200 rounded-lg mx-2",
                      currentPath === item.path
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground hover:bg-muted/80 hover:text-primary",
                    )}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted/80 transition-colors"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <nav className="container px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  currentPath === item.path
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground hover:bg-muted/80 hover:text-primary",
                )}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Resources Section */}
            <div className="pt-2 border-t border-border/50">
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Resources
              </div>
              {resourceItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "block px-4 py-3 text-sm transition-all duration-200 rounded-lg",
                    currentPath === item.path
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-muted/80 hover:text-primary",
                  )}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
