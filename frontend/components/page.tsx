"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          AI Powered Citizen Issue Reporter
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          Report civic issues easily, track progress, and let AI help analyze
          and prioritize problems in your city.
        </p>
        <Link
          href="/complaints"
          className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold shadow hover:bg-gray-100"
        >
          Report an Issue
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-gray-600">
              Our system uses AI to categorize and prioritize complaints for
              quicker resolution.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
            <p className="text-gray-600">
              Track the status of your complaints and get updates directly.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
            <p className="text-gray-600">
              Pinpoint exact problem locations on the map and adjust them easily.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-blue-50 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-semibold mb-2">Step 1: Locate</h3>
            <p className="text-gray-600">
              Select or drag the map to set the exact location of the issue.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Step 2: Describe</h3>
            <p className="text-gray-600">
              Add complaint details such as type, description, and image proof.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Step 3: Submit</h3>
            <p className="text-gray-600">
              AI analyzes and forwards your issue to the concerned department.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-lg mb-6">
          Join thousands of citizens in improving your city with just a few
          clicks.
        </p>
        <Link
          href="/complaints"
          className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold shadow hover:bg-gray-100"
        >
          File a Complaint Now
        </Link>
      </section>
    </main>
  );
}
