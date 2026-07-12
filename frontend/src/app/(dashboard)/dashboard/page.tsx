"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/features/auth/services/authService";
import { tripService } from "@/features/trip/services/tripService";
import type { Trip, User } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [userData, tripsData] = await Promise.all([
          authService.getMe(),
          tripService.getTrips(),
        ]);
        setUser(userData);
        setTrips(tripsData);
      } catch {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 animate-pulse" />
          <p className="text-slate-400 text-sm">Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            <span className="text-white font-semibold text-lg">
              Trip<span className="text-violet-400">Mind</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-slate-400 text-sm hidden md:block">
              Welcome, <span className="text-white font-medium">{user?.full_name}</span>
            </div>
            <button
              id="dashboard-logout-btn"
              onClick={() => authService.logout()}
              className="text-slate-400 hover:text-white text-sm px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-500 transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">My Trips</h1>
            <p className="text-slate-400 text-sm">
              {trips.length === 0
                ? "You haven't planned any trips yet. Start your first adventure!"
                : `${trips.length} trip${trips.length > 1 ? "s" : ""} planned`}
            </p>
          </div>
          <Link
            href="/dashboard/new-trip"
            id="create-trip-btn"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Trip
          </Link>
        </div>

        {/* Empty State */}
        {trips.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-6">✈️</div>
            <h2 className="text-xl font-semibold text-white mb-3">No trips yet</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto text-sm">
              Create your first trip and let our AI generate a personalized itinerary for you.
            </p>
            <Link
              href="/dashboard/new-trip"
              id="empty-state-create-btn"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium px-6 py-3 rounded-xl text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-200"
            >
              Plan Your First Trip
            </Link>
          </div>
        ) : (
          /* Trip Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const hasItinerary = !!trip.itinerary;

  return (
    <Link
      href={`/dashboard/trips/${trip.id}`}
      className="group block bg-slate-900/50 border border-slate-800 hover:border-violet-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1"
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border border-violet-500/20 flex items-center justify-center text-2xl">
          🌍
        </div>
        {hasItinerary && (
          <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            AI Generated
          </span>
        )}
      </div>

      {/* Trip Info */}
      <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-violet-300 transition-colors">
        {trip.title}
      </h3>
      <p className="text-slate-400 text-sm mb-4 flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {trip.destination}
      </p>

      {/* Dates */}
      {(trip.start_date || trip.end_date) && (
        <div className="flex items-center gap-1 text-slate-500 text-xs">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(trip.start_date)} {trip.end_date && `→ ${formatDate(trip.end_date)}`}
        </div>
      )}
    </Link>
  );
}
