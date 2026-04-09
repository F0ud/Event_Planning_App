import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Shield, Clock, Star } from "lucide-react";
import EditProfileForm from "./EditProfileForm";

async function getUserData(userId: string) {
  const [user, bookings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
    }),
    prisma.booking.findMany({
      where: { guestId: userId },
      include: {
        experience: {
          include: {
            host: { select: { name: true } },
          },
        },
      },
      orderBy: { date: "desc" },
    }),
  ]);

  return { user, bookings };
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const { user, bookings } = await getUserData(userId);

  if (!user) {
    redirect("/auth/signin");
  }

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.date) > new Date() && b.status !== "CANCELLED"
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.date) <= new Date() || b.status === "CANCELLED"
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              {user.verified && (
                <span className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  <Shield className="w-3 h-3" /> Verified
                </span>
              )}
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {user.role}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
            {user.location && (
              <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {user.location}
              </p>
            )}
            {user.bio && (
              <p className="text-sm text-gray-600 mt-2">{user.bio}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Member since{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <EditProfileForm
          name={user.name}
          bio={user.bio ?? ""}
          location={user.location ?? ""}
        />
      </div>

      {/* Upcoming Bookings */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Upcoming Bookings ({upcomingBookings.length})
        </h2>
        {upcomingBookings.length > 0 ? (
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/experiences/${booking.experienceId}`}
                className="block bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {booking.experience.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Hosted by {booking.experience.host.name}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span>
                        {booking.guests}{" "}
                        {booking.guests === 1 ? "guest" : "guests"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${booking.totalPrice}
                    </p>
                    <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      {booking.status.charAt(0) +
                        booking.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">No upcoming bookings</p>
            <Link
              href="/experiences"
              className="mt-3 inline-block text-sm text-indigo-600 font-medium hover:text-indigo-700"
            >
              Browse experiences
            </Link>
          </div>
        )}
      </div>

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Past Bookings ({pastBookings.length})
          </h2>
          <div className="space-y-3">
            {pastBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white p-4 rounded-lg border border-gray-200 opacity-75"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {booking.experience.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {new Date(booking.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      booking.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-700"
                        : booking.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {booking.status.charAt(0) +
                      booking.status.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
