"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, Users, CreditCard } from "lucide-react";

interface BookingSectionProps {
  experienceId: string;
  price: number;
  currency: string;
  maxGroupSize: number;
}

export default function BookingSection({
  experienceId,
  price,
  currency,
  maxGroupSize,
}: BookingSectionProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const totalPrice = price * guests;

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceId,
          date,
          guests,
          totalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Booking failed");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  if (success) {
    return (
      <div className="sticky top-24 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-green-600 text-xl">\u2713</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Booking Confirmed!
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            You&apos;ll receive a confirmation email shortly. Your host will
            reach out with details before the experience.
          </p>
          <button
            onClick={() => router.push("/profile")}
            className="mt-4 text-sm text-indigo-600 font-medium hover:text-indigo-700"
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-24 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-2xl font-bold text-gray-900">${price}</span>
        <span className="text-gray-500">/ person</span>
      </div>

      <form onSubmit={handleBooking} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4" />
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
            <Users className="w-4 h-4" />
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {[...Array(maxGroupSize)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">
              ${price} x {guests} {guests === 1 ? "guest" : "guests"}
            </span>
            <span className="text-gray-900">${totalPrice}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t border-gray-100">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <CreditCard className="w-4 h-4" />
          {loading
            ? "Processing..."
            : session
              ? "Book Now"
              : "Sign in to Book"}
        </button>
      </form>
    </div>
  );
}
