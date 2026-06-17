import { Hero } from "@/components/Hero";
import { AirportList } from "@/components/AirportList";
import { StatsPanel } from "@/components/StatsPanel";
import { Footer } from "@/components/Footer";
import type { Airport } from "@/components/AirportCard";
import airportsData from "@/data/airports.json";

const airports = airportsData as Airport[];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Hero />
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <StatsPanel airports={airports} />
        <AirportList />
        <Footer />
      </div>
    </main>
  );
}
