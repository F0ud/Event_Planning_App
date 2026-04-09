import Link from "next/link";
import { Clock, Users, MapPin, Star } from "lucide-react";

interface ExperienceCardProps {
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
  host: {
    name: string;
    image: string | null;
    verified: boolean;
  };
  featured?: boolean;
  avgRating?: number;
  reviewCount?: number;
}

const categoryColors: Record<string, string> = {
  CULINARY: "bg-orange-100 text-orange-700",
  ARTISAN: "bg-purple-100 text-purple-700",
  WELLNESS: "bg-green-100 text-green-700",
  CULTURAL: "bg-blue-100 text-blue-700",
};

export default function ExperienceCard({
  id,
  title,
  slug,
  category,
  price,
  currency,
  duration,
  maxGroupSize,
  location,
  images,
  host,
  featured,
  avgRating,
  reviewCount,
}: ExperienceCardProps) {
  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  return (
    <Link href={`/experiences/${id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="relative aspect-[4/3] bg-gray-100">
          {images.length > 0 ? (
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl">
                {category === "CULINARY"
                  ? "\uD83C\uDF73"
                  : category === "ARTISAN"
                    ? "\uD83C\uDFA8"
                    : category === "WELLNESS"
                      ? "\uD83E\uDDD8"
                      : "\uD83C\uDFDB\uFE0F"}
              </span>
            </div>
          )}
          {featured && (
            <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              Featured
            </span>
          )}
          <span
            className={`absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full ${categoryColors[category] ?? "bg-gray-100 text-gray-700"}`}
          >
            {category.charAt(0) + category.slice(1).toLowerCase()}
          </span>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {title}
          </h3>

          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="line-clamp-1">{location}</span>
          </div>

          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(duration)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Up to {maxGroupSize}
            </span>
          </div>

          {avgRating !== undefined && reviewCount !== undefined && reviewCount > 0 && (
            <div className="flex items-center gap-1 mt-2 text-sm">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-gray-900">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-gray-500">({reviewCount})</span>
            </div>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
                {host.name.charAt(0)}
              </div>
              <span className="text-sm text-gray-600">{host.name}</span>
              {host.verified && (
                <span className="text-xs text-indigo-600" title="Verified host">
                  \u2713
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="font-semibold text-gray-900">
                ${price}
              </span>
              <span className="text-sm text-gray-500"> / person</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
