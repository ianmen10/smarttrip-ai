import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "TripMind AI — Your AI Travel Companion",
  description:
    "Plan your perfect trip with the power of AI. Get personalized itineraries, local recommendations, and travel tips powered by GPT-4.",
};

const features = [
  {
    icon: "🗺️",
    title: "AI Itinerary Generator",
    description:
      "Describe your dream trip and our AI will create a detailed day-by-day itinerary tailored to your preferences, budget, and travel style.",
  },
  {
    icon: "💬",
    title: "Smart Travel Chat",
    description:
      "Ask anything about your destination. Get real-time answers about local culture, hidden gems, transport options, and more.",
  },
  {
    icon: "📋",
    title: "Trip Dashboard",
    description:
      "Organize all your trips in one place. Save, edit, and share your travel plans with ease from any device.",
  },
  {
    icon: "🌍",
    title: "Local Insights",
    description:
      "Discover local restaurants, cultural tips, safety advice, and money-saving hacks curated by AI from thousands of travel experiences.",
  },
  {
    icon: "⚡",
    title: "Instant Planning",
    description:
      "No more hours of research. Generate a complete travel plan in seconds and focus on enjoying your journey.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    description:
      "Your travel data is encrypted and private. We never share your personal information with third parties.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Your Trip",
    description: "Enter your destination, travel dates, and any preferences you have.",
  },
  {
    step: "02",
    title: "AI Generates Your Plan",
    description: "Our AI analyzes thousands of travel data points to create your perfect itinerary.",
  },
  {
    step: "03",
    title: "Explore & Customize",
    description: "Review your plan, ask questions, and refine it until it is exactly right.",
  },
];

const stats = [
  { value: "50K+", label: "Trips Planned" },
  { value: "120+", label: "Destinations" },
  { value: "4.9★", label: "User Rating" },
  { value: "< 10s", label: "Plan Generation" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-violet-950/30 to-slate-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-8 text-sm text-violet-300">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
            Powered by GPT-4o AI
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Plan Your Perfect
            <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Journey with AI
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            TripMind AI creates personalized travel itineraries in seconds.
            Just tell us where you want to go — we will handle the rest.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              id="hero-cta-register"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:shadow-2xl hover:shadow-violet-500/30 transition-all duration-300 hover:scale-105"
            >
              Start Planning for Free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="#how-it-works"
              id="hero-cta-learn"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-medium px-8 py-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-all duration-200"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-6 text-slate-500 text-sm">No credit card required</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-slate-800/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="block bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Travel Smarter
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              From destination discovery to day-by-day planning, TripMind AI has every tool you need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-slate-900/50 border border-slate-800 hover:border-violet-500/50 rounded-2xl p-6 transition-all duration-300 hover:bg-slate-900 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg">Three simple steps to your perfect trip</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 text-white font-bold text-xl mb-6 shadow-lg shadow-violet-500/30">
                  {step.step}
                </div>
                <h3 className="text-white font-semibold text-xl mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-900/80 via-purple-900/80 to-slate-900/80 border border-violet-800/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
            <div className="relative z-10 text-center py-16 px-8">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Travel Smarter?</h2>
              <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of travelers who use TripMind AI to plan unforgettable journeys.
              </p>
              <Link
                href="/register"
                id="bottom-cta-register"
                className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-8 py-4 rounded-xl text-lg hover:bg-slate-100 transition-all duration-200 hover:scale-105 hover:shadow-2xl"
              >
                Get Started for Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
