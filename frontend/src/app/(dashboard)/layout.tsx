import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — TripMind AI",
  description: "Manage and plan your trips with TripMind AI.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {children}
    </div>
  );
}
