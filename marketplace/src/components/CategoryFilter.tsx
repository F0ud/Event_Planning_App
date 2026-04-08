"use client";

import { ChefHat, Palette, Heart, Landmark } from "lucide-react";

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

const categories = [
  { value: "CULINARY", label: "Culinary", icon: ChefHat },
  { value: "ARTISAN", label: "Artisan", icon: Palette },
  { value: "WELLNESS", label: "Wellness", icon: Heart },
  { value: "CULTURAL", label: "Cultural", icon: Landmark },
];

export default function CategoryFilter({
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selected === null
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        All
      </button>
      {categories.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => onSelect(selected === value ? null : value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === value
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
