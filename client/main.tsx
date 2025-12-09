import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot, Root } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator";
import About from "./pages/About";
import HowToUse from "./pages/HowToUse";
import Documentation from "./pages/Documentation";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import APIReference from "./pages/APIReference";
import HelpCenter from "./pages/HelpCenter";
import StatusPage from "./pages/StatusPage";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-to-use" element={<HowToUse />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/api-reference" element={<APIReference />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/status" element={<StatusPage />} />
              <Route path="/community" element={<Community />} />
              <Route path="/contact" element={<Contact />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Store root instance on window to handle HMR and prevent duplicate createRoot calls
declare global {
  interface Window {
    __reactRoot?: Root;
  }
}

const container = document.getElementById("root");
if (container) {
  if (!window.__reactRoot) {
    window.__reactRoot = createRoot(container);
  }
  window.__reactRoot.render(<App />);
}
