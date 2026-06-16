import { AirportCard } from "@/components/AirportCard";
import { FilterBar } from "@/components/FilterBar";
import { Hero } from "@/components/Hero";
import airports from "@/data/airports.json";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Hero />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <FilterBar />

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            共收录 {airports.length} 家机场
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {airports.map((airport) => (
            <AirportCard key={airport.id} airport={airport} />
          ))}
        </div>
      </div>
    </main>
  );
}
