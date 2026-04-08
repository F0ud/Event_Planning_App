export interface ExperienceWithHost {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: "CULINARY" | "ARTISAN" | "WELLNESS" | "CULTURAL";
  price: number;
  currency: string;
  maxGroupSize: number;
  duration: number;
  location: string;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  hostId: string;
  host: {
    id: string;
    name: string;
    image: string | null;
    verified: boolean;
    bio: string | null;
  };
  _count?: {
    bookings: number;
    reviews: number;
  };
  avgRating?: number;
}

export const CATEGORIES = [
  { value: "CULINARY", label: "Culinary", icon: "ChefHat" },
  { value: "ARTISAN", label: "Artisan", icon: "Palette" },
  { value: "WELLNESS", label: "Wellness", icon: "Heart" },
  { value: "CULTURAL", label: "Cultural", icon: "Landmark" },
] as const;
