import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is the Gaussian Plume Model?",
    answer:
      "The Gaussian Plume Model is an industry-standard mathematical model used to estimate the dispersion of air pollutants from a point source. It assumes that the concentration of pollutants follows a Gaussian (normal) distribution both horizontally and vertically as it travels downwind. This model is widely used by environmental agencies and is computationally efficient for regulatory compliance and planning purposes.",
  },
  {
    question: "What weather data does DispersionSim use?",
    answer:
      "DispersionSim uses real-time meteorological forecasts from the Open-Meteo API, a free and open-source weather data service. For each simulation location and time period, we fetch hourly wind speed, wind direction, temperature, and cloud cover data. This ensures your simulations are based on current and predicted atmospheric conditions.",
  },
  {
    question: "What is the accuracy of the simulations?",
    answer:
      "The accuracy of DispersionSim results depends on several factors: the quality of input parameters, the accuracy of meteorological data, and the applicability of the Gaussian plume model to your specific conditions. For regulatory compliance, consult local environmental agencies. DispersionSim is ideal for educational purposes, preliminary assessment, and general understanding of pollutant dispersion patterns.",
  },
  {
    question: "Can I simulate multiple pollutants simultaneously?",
    answer:
      "Currently, DispersionSim simulates one pollutant type per simulation (PM2.5, PM10, or other particulates). If you need to model multiple pollutants, you can run separate simulations for each and compare results. This approach also allows you to evaluate the specific behavior of each pollutant under identical conditions.",
  },
  {
    question: "What is the maximum simulation duration?",
    answer:
      "DispersionSim provides simulations for up to 48 hours in the future. This is limited by the availability of accurate meteorological forecast data. The 48-hour window provides sufficient time to observe how dispersion patterns change as weather conditions evolve, making it ideal for short-term air quality assessment and planning.",
  },
  {
    question: "How do I choose the right stability class?",
    answer:
      "Atmospheric stability class depends on time of day and cloud cover: Class A (very unstable) occurs during day with clear skies, Class B (unstable) during day with some clouds, Class D (neutral) during night or overcast conditions, and Class E-F (stable) during clear nights. Each class affects how much the plume spreads vertically. For best results, research atmospheric stability classifications for your region.",
  },
  {
    question: "Can I export the simulation results?",
    answer:
      "Yes! DispersionSim allows you to download results as CSV files directly from the Details tab. The exported data includes hourly concentrations, wind speed, direction, and other relevant metrics. You can then use this data in spreadsheets, statistical software, or other analysis tools.",
  },
  {
    question: "Is DispersionSim free to use?",
    answer:
      "Yes, DispersionSim is completely free to use. There are no subscription fees, no registration required, and no API usage limits. We're committed to making air quality modeling accessible to everyone. The project uses open-source software and free weather data from Open-Meteo.",
  },
  {
    question: "What are the system requirements?",
    answer:
      "DispersionSim is web-based and works on any modern browser (Chrome, Firefox, Safari, Edge). No installation is required. For the best experience, use a desktop or tablet with a screen size of at least 768px wide. Mobile phones are supported but may provide a compressed interface.",
  },
  {
    question: "Can I use DispersionSim for regulatory compliance?",
    answer:
      "DispersionSim is designed as an educational and preliminary assessment tool. While it uses industry-standard models, regulatory compliance often requires specialized software and EPA-approved models. Always consult your local environmental regulatory agency for compliance requirements. DispersionSim is excellent for understanding fundamentals and initial impact assessment.",
  },
  {
    question: "How do I report a bug or suggest a feature?",
    answer:
      "We appreciate your feedback! Please visit our Contact page to report issues or suggest features. You can also check our GitHub repository for the latest updates and contribute to the project if you're interested in development.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "DispersionSim simulations are performed on your browser and our secure servers. We don't store simulation results or personal data beyond the duration of your session. Weather data is fetched from Open-Meteo's public API. For detailed information about data handling, please review our Privacy Policy.",
  },
];

function FAQItem({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      className="p-6 cursor-pointer hover:border-primary/50 transition-colors"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold text-foreground text-lg">
          {item.question}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isOpen && (
        <p className="text-muted-foreground mt-4 leading-relaxed">
          {item.answer}
        </p>
      )}
    </Card>
  );
}

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFAQs = faqs.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-20 lg:py-28 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers to common questions about DispersionSim
            </p>

            {/* Search */}
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((item, index) => (
                <FAQItem key={index} item={item} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No questions found matching your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Didn't find your answer?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help. Reach out with your question or
              concern.
            </p>
            <a
              href="/contact"
              className="text-primary font-semibold hover:underline"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
