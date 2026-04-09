import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";

async function getHostData(userId: string) {
  const [experiences, bookings, user] = await Promise.all([
    prisma.experience.findMany({
      where: { hostId: userId },
      include: {
        _count: { select: { bookings: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.findMany({
      where: {
        experience: { hostId: userId },
      },
      include: {
        experience: { select: { title: true } },
        guest: { select: { name: true, email: true } },
      },
      orderBy: { date: "desc" },
      take: 20,
    }),
    prisma.user.findUnique({
      where: { id: userId },
    }),
  ]);

  const totalEarnings = bookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.date) > new Date() && b.status !== "CANCELLED"
  );

  return {
    experiences,
    bookings,
    user,
    stats: {
      totalExperiences: experiences.length,
      totalBookings,
      totalEarnings,
      upcomingCount: upcomingBookings.length,
    },
  };
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const { experiences, bookings, stats } = await getHostData(userId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
          <p className="mt-1 text-gray-500">
            Manage your experiences and track bookings
          </p>
        </div>
        <Link
          href="/experiences/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Experience
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Experiences</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalExperiences}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalBookings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.totalEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.upcomingCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Experiences */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Experiences
          </h2>
          {experiences.length > 0 ? (
            <div className="space-y-3">
              {experiences.map((exp) => (
                <Link
                  key={exp.id}
                  href={`/experiences/${exp.id}`}
                  className="block bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{exp.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {exp.category.charAt(0) +
                          exp.category.slice(1).toLowerCase()}{" "}
                        &middot; ${exp.price}/person &middot;{" "}
                        {exp.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {exp._count.bookings}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          exp.published
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {exp.published ? "Live" : "Draft"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">No experiences yet</p>
              <Link
                href="/experiences/new"
                className="mt-3 inline-flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-700"
              >
                <Plus className="w-4 h-4" />
                Create your first experience
              </Link>
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Bookings
          </h2>
          {bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.guest.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {booking.experience.title}
                      </p>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        &middot;{" "}
                        <Users className="w-3 h-3 inline" /> {booking.guests}{" "}
                        {booking.guests === 1 ? "guest" : "guests"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${booking.totalPrice}
                      </p>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          booking.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-700"
                              : booking.status === "CANCELLED"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {booking.status.charAt(0) +
                          booking.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">No bookings yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
