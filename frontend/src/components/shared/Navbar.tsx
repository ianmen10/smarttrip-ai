"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
            T
          </div>
          <span className="text-white font-semibold text-lg">
            Trip<span className="text-violet-400">Mind</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            How It Works
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            id="nav-login-btn"
            className="text-slate-300 hover:text-white text-sm transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            id="nav-register-btn"
            className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
