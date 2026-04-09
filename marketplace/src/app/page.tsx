import Link from "next/link";
import ExperienceCard from "@/components/ExperienceCard";
import { prisma } from "@/lib/db";
import { ChefHat, Palette, Heart, Landmark, ArrowRight } from "lucide-react";

const categories = [
  {
    value: "CULINARY",
    label: "Culinary",
    icon: ChefHat,
    description: "Cooking classes, food tours, and tasting experiences",
    color: "bg-orange-50 text-orange-600 border-orange-200",
  },
  {
    value: "ARTISAN",
    label: "Artisan",
    icon: Palette,
    description: "Pottery, weaving, painting, and craft workshops",
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    value: "WELLNESS",
    label: "Wellness",
    icon: Heart,
    description: "Yoga retreats, meditation, and healing practices",
    color: "bg-green-50 text-green-600 border-green-200",
  },
  {
    value: "CULTURAL",
    label: "Cultural",
    icon: Landmark,
    description: "Heritage tours, music, dance, and local traditions",
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
];

async function getFeaturedExperiences() {
  try {
    const experiences = await prisma.experience.findMany({
      where: { published: true, featured: true },
      include: {
        host: {
          select: { id: true, name: true, image: true, verified: true },
        },
        _count: { select: { bookings: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    return experiences;
  } catch {
    return [];
  }
}

async function getLatestExperiences() {
  try {
    const experiences = await prisma.experience.findMany({
      where: { published: true },
      include: {
        host: {
          select: { id: true, name: true, image: true, verified: true },
        },
        _count: { select: { bookings: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    return experiences;
  } catch {
    return [];
  }
}

export default async function Home() {
  const [featured, latest] = await Promise.all([
    getFeaturedExperiences(),
    getLatestExperiences(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Discover Authentic
              <br />
              Cultural Experiences
            </h1>
            <p className="mt-6 text-lg md:text-xl text-indigo-100 max-w-2xl">
              Connect with local hosts offering artisan workshops, culinary
              classes, wellness retreats, and cultural immersion — curated for
              quality, not volume.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/experiences"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Explore Experiences
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Become a Host
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900">
          Explore by Category
        </h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(({ value, label, icon: Icon, description, color }) => (
            <Link
              key={value}
              href={`/experiences?category=${value}`}
              className={`flex flex-col items-start p-6 rounded-xl border ${color} hover:shadow-md transition-shadow`}
            >
              <Icon className="w-8 h-8" />
              <h3 className="mt-3 font-semibold text-lg">{label}</h3>
              <p className="mt-1 text-sm opacity-80">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Experiences */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Experiences
            </h2>
            <Link
              href="/experiences"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((exp) => (
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
        </section>
      )}

      {/* Latest Experiences */}
      {latest.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Latest Experiences
            </h2>
            <Link
              href="/experiences"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.map((exp) => (
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
                reviewCount={exp._count.reviews}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty state when no experiences */}
      {featured.length === 0 && latest.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            No experiences yet
          </h2>
          <p className="mt-2 text-gray-500">
            Be the first to share your culture with the world.
          </p>
          <Link
            href="/auth/signup"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Your First Experience
          </Link>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-indigo-50 border-t border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Share Your Passion With the World
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you&apos;re a chef, artisan, yoga instructor, or cultural
            guide — turn your skills into memorable experiences for travelers
            seeking authenticity.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Start Hosting Today
          </Link>
        </div>
      </section>
    </div>
  );
}
