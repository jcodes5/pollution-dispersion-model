import { Link } from "react-router-dom";
import { Wind } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  currentPath?: string;
}

export default function Header({ currentPath = "/" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and brand */}
        <Link to="/" className="flex items-center gap-2">
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
          <Link
            to="/"
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors",
              currentPath === "/"
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            )}
          >
            Home
          </Link>
          <Link
            to="/simulator"
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors",
              currentPath === "/simulator"
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            )}
          >
            Simulator
          </Link>
        </nav>
      </div>
    </header>
  );
}
