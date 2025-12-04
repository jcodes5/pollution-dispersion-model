import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPath={location.pathname} />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
