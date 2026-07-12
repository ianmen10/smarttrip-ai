"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { tripService } from "@/features/trip/services/tripService";
import type { Trip } from "@/types";

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const loadTrip = async () => {
      try {
        const data = await tripService.getTripById(id);
        setTrip(data);
      } catch {
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTrip();
  }, [id, router]);

  const handleGenerateItinerary = async () => {
    if (!trip) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const updatedTrip = await tripService.generateItinerary({
        trip_id: trip.id,
        preferences: preferences || undefined,
      });
      setTrip(updatedTrip);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { detail?: string } } };
      setError(
        axiosError.response?.data?.detail || "Gagal membuat itinerary. Silakan coba lagi."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    try {
      await tripService.deleteTrip(trip!.id);
      router.push("/dashboard");
    } catch {
      alert("Gagal menghapus trip.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 animate-pulse" />
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <button 
            onClick={handleDeleteTrip}
            className="text-red-400 hover:text-red-300 text-sm px-4 py-2 rounded-lg border border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-200"
          >
            Delete Trip
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">{trip.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {trip.destination}
            </div>
            {(trip.start_date || trip.end_date) && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : '?'} - {trip.end_date ? new Date(trip.end_date).toLocaleDateString() : '?'}
              </div>
            )}
          </div>
          {trip.description && (
            <p className="mt-4 text-slate-300 max-w-3xl">{trip.description}</p>
          )}
        </div>

        {/* Itinerary Section */}
        {!trip.itinerary ? (
          // Empty State & Generate UI
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 max-w-3xl">
            <h2 className="text-xl font-semibold text-white mb-2">No itinerary yet</h2>
            <p className="text-slate-400 mb-6 text-sm">
              Let our AI travel assistant create a personalized day-by-day plan for your trip to {trip.destination}.
            </p>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 mb-6 text-sm">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Travel Preferences (Optional)
              </label>
              <textarea
                rows={3}
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="e.g. I love local food, want to visit museums, traveling with a toddler, medium budget..."
                className="w-full bg-slate-800/50 border border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none"
              />
            </div>

            <button
              onClick={handleGenerateItinerary}
              disabled={isGenerating}
              className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 flex items-center justify-center w-full sm:w-auto min-w-[200px]"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating with AI...
                </>
              ) : (
                <>
                  <span className="text-lg mr-2">✨</span> Generate Itinerary
                </>
              )}
            </button>
          </div>
        ) : (
          // View Itinerary UI
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Daily Plans */}
              {trip.itinerary.daily_plans?.map((day: any, idx: number) => (
                <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-violet-500 to-cyan-500 opacity-50" />
                  <div className="flex items-baseline justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Day {day.day}: {day.theme}</h3>
                      {day.date && <p className="text-sm text-slate-400">{day.date}</p>}
                    </div>
                    <span className="text-sm font-medium text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
                      {day.estimated_budget}
                    </span>
                  </div>
                  
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                    {day.activities?.map((activity: any, aIdx: number) => (
                      <div key={aIdx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Timeline dot */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          <span className="text-xs font-semibold">{activity.time}</span>
                        </div>
                        {/* Content */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-800/30 hover:bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-white">{activity.title}</h4>
                            <span className="text-xs text-slate-500">{activity.duration}</span>
                          </div>
                          <p className="text-sm text-slate-400 mb-2">{activity.description}</p>
                          {activity.tips && (
                            <div className="flex items-start gap-1.5 mt-2 text-xs text-violet-300/80 bg-violet-900/10 p-2 rounded-lg border border-violet-500/10">
                              <span className="shrink-0 mt-0.5">💡</span>
                              <p>{activity.tips}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {day.accommodation && (
                    <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center gap-2 text-sm text-slate-400">
                      <span>🏨</span> <span className="font-medium text-slate-300">Stay:</span> {day.accommodation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar Summary */}
            <div className="space-y-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sticky top-24">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-violet-400">📊</span> Trip Summary
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {trip.itinerary.summary}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Total Budget</h4>
                    <p className="text-white font-medium">{trip.itinerary.total_estimated_budget}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Tips</h4>
                    <ul className="space-y-2">
                      {trip.itinerary.travel_tips?.map((tip: string, idx: number) => (
                        <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                          <span className="text-cyan-500 mt-0.5">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {trip.itinerary.recommended_restaurants && trip.itinerary.recommended_restaurants.length > 0 && (
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Eat</h4>
                      <ul className="space-y-2">
                        {trip.itinerary.recommended_restaurants.map((place: string, idx: number) => (
                          <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                            <span className="text-violet-500 mt-0.5">🍽️</span>
                            <span>{place}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    if(confirm("Generate new itinerary? This will replace the current one.")) {
                      handleGenerateItinerary();
                    }
                  }}
                  className="w-full mt-8 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-sm transition-colors border border-slate-700 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
