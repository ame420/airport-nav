import { Hero } from "@/components/Hero";
import { AirportList } from "@/components/AirportList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Hero />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AirportList />
      </div>
    </main>
  );
}
