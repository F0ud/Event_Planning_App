import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Clock, Users, MapPin, Star, Shield } from "lucide-react";
import BookingSection from "./BookingSection";

async function getExperience(id: string) {
  const experience = await prisma.experience.findUnique({
    where: { id },
    include: {
      host: {
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
          verified: true,
          location: true,
          createdAt: true,
        },
      },
      reviews: {
        include: {
          author: {
            select: { name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: {
        select: { bookings: true, reviews: true },
      },
    },
  });

  return experience;
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experience = await getExperience(id);

  if (!experience) {
    notFound();
  }

  const avgRating =
    experience.reviews.length > 0
      ? experience.reviews.reduce((sum, r) => sum + r.rating, 0) /
        experience.reviews.length
      : null;

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
    }
    return `${minutes} minutes`;
  };

  const categoryLabel =
    experience.category.charAt(0) +
    experience.category.slice(1).toLowerCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
          {experience.images.length > 0 ? (
            <img
              src={experience.images[0]}
              alt={experience.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
              {experience.category === "CULINARY"
                ? "\uD83C\uDF73"
                : experience.category === "ARTISAN"
                  ? "\uD83C\uDFA8"
                  : experience.category === "WELLNESS"
                    ? "\uD83E\uDDD8"
                    : "\uD83C\uDFDB\uFE0F"}
            </div>
          )}
        </div>
        {experience.images.length > 1 && (
          <div className="grid grid-cols-2 gap-4">
            {experience.images.slice(1, 5).map((img, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100"
              >
                <img
                  src={img}
                  alt={`${experience.title} ${i + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              {categoryLabel}
            </span>
            {experience.featured && (
              <span className="text-sm font-medium text-white bg-indigo-600 px-2.5 py-0.5 rounded-full">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            {experience.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {experience.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDuration(experience.duration)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Up to {experience.maxGroupSize} guests
            </span>
            {avgRating && (
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {avgRating.toFixed(1)} ({experience._count.reviews} reviews)
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              About This Experience
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 whitespace-pre-line">
                {experience.description}
              </p>
            </div>
          </div>

          {/* Host Info */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Host
            </h2>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-semibold text-indigo-600 flex-shrink-0">
                {experience.host.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {experience.host.name}
                  </h3>
                  {experience.host.verified && (
                    <span className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      <Shield className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                {experience.host.location && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {experience.host.location}
                  </p>
                )}
                {experience.host.bio && (
                  <p className="text-sm text-gray-600 mt-2">
                    {experience.host.bio}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Host since{" "}
                  {new Date(experience.host.createdAt).toLocaleDateString(
                    "en-US",
                    { month: "long", year: "numeric" }
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Reviews */}
          {experience.reviews.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Reviews ({experience._count.reviews})
              </h2>
              <div className="space-y-4">
                {experience.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                        {review.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {review.author.name}
                        </p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <BookingSection
            experienceId={experience.id}
            price={experience.price}
            currency={experience.currency}
            maxGroupSize={experience.maxGroupSize}
          />
        </div>
      </div>
    </div>
  );
}
