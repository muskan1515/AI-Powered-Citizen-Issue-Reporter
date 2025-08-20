"use client";

import AboutSection from "@/components/common/AboutSection";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-12">
          About Us
        </h1>
        <AboutSection />
      </section>
    </main>
  );
}
