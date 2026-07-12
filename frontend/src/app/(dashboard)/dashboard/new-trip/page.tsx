"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { tripService } from "@/features/trip/services/tripService";

export default function NewTripPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    description: "",
    start_date: "",
    end_date: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const trip = await tripService.createTrip({
        title: formData.title,
        destination: formData.destination,
        description: formData.description || undefined,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
      });
      // Redirect to the trip detail page after creation
      router.push(`/dashboard/trips/${trip.id}`);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { detail?: string } } };
      setError(
        axiosError.response?.data?.detail || "Gagal membuat trip baru. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Plan a New Trip</h1>
        <p className="text-slate-400 text-sm">Tell us where you want to go, and we will help you plan it.</p>
      </div>

      {/* Form */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="trip-title" className="block text-sm font-medium text-slate-300 mb-2">
                Trip Title
              </label>
              <input
                id="trip-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Summer in Bali 2025"
                className="w-full bg-slate-800/50 border border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="trip-destination" className="block text-sm font-medium text-slate-300 mb-2">
                Destination
              </label>
              <input
                id="trip-destination"
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g. Bali, Indonesia"
                className="w-full bg-slate-800/50 border border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-slate-300 mb-2">
                Start Date (Optional)
              </label>
              <input
                id="start-date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all [color-scheme:dark]"
              />
            </div>

            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-slate-300 mb-2">
                End Date (Optional)
              </label>
              <input
                id="end-date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all [color-scheme:dark]"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="trip-description" className="block text-sm font-medium text-slate-300 mb-2">
                Notes / Description (Optional)
              </label>
              <textarea
                id="trip-description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Any special notes for this trip?"
                className="w-full bg-slate-800/50 border border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                "Create Trip"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
