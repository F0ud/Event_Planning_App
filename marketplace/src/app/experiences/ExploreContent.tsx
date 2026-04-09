"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ExperienceCard from "@/components/ExperienceCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Search } from "lucide-react";

interface Experience {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  currency: string;
  duration: number;
  maxGroupSize: number;
  location: string;
  images: string[];
  featured: boolean;
  host: {
    name: string;
    image: string | null;
    verified: boolean;
  };
  _count: {
    reviews: number;
  };
}

export default function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [priceRange, setPriceRange] = useState<string>(
    searchParams.get("price") ?? ""
  );
  const [location, setLocation] = useState(
    searchParams.get("location") ?? ""
  );

  useEffect(() => {
    async function fetchExperiences() {
      setLoading(true);
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (search) params.set("search", search);
      if (priceRange) params.set("price", priceRange);
      if (location) params.set("location", location);

      try {
        const res = await fetch(`/api/experiences?${params.toString()}`);
        const data = await res.json();
        setExperiences(data.experiences ?? []);
      } catch {
        setExperiences([]);
      }
      setLoading(false);
    }

    fetchExperiences();
  }, [category, search, priceRange, location]);

  function handleCategoryChange(cat: string | null) {
    setCategory(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat) params.set("category", cat);
    else params.delete("category");
    router.push(`/experiences?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set("search", search);
    else params.delete("search");
    router.push(`/experiences?${params.toString()}`);
  }

  return (
    <>
      {/* Search & Filters */}
      <div className="space-y-4 mb-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search experiences..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-48 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hidden sm:block"
          />
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hidden sm:block"
          >
            <option value="">Any price</option>
            <option value="0-50">Under $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-200">$100 - $200</option>
            <option value="200+">$200+</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Search
          </button>
        </form>

        <CategoryFilter selected={category} onSelect={handleCategoryChange} />
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : experiences.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {experiences.map((exp) => (
            <ExperienceCard
              key={exp.id}
              id={exp.id}
              title={exp.title}
              slug={exp.slug}
              category={exp.category}
              price={exp.price}
              currency={exp.currency}
              duration={exp.duration}
              maxGroupSize={exp.maxGroupSize}
              location={exp.location}
              images={exp.images}
              host={exp.host}
              featured={exp.featured}
              reviewCount={exp._count.reviews}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500">
            No experiences found matching your criteria.
          </p>
          <button
            onClick={() => {
              setCategory(null);
              setSearch("");
              setPriceRange("");
              setLocation("");
              router.push("/experiences");
            }}
            className="mt-4 text-indigo-600 font-medium hover:text-indigo-700"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
