"use client";
import { Users, Cpu, Globe } from "lucide-react";
import AboutUs from "@/public/images/about-us.png";
import Image from "next/image";

export default function AboutSection() {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Empowering Citizens with AI
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          <span className="font-medium text-blue-600">Citizen Reporter</span> is
          an AI-powered platform designed to bridge the gap between citizens and
          local authorities. Our goal is to make issue reporting faster,
          smarter, and more effective.
        </p>

        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <Users className="w-6 h-6 text-blue-600 mt-1" />
            <p className="text-gray-700">
              <span className="font-semibold">Citizen First:</span> Easy-to-use
              interface for reporting local issues with just a few clicks.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <Cpu className="w-6 h-6 text-blue-600 mt-1" />
            <p className="text-gray-700">
              <span className="font-semibold">AI-Powered:</span> Issues are
              categorized automatically using AI & ML for faster resolution.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <Globe className="w-6 h-6 text-blue-600 mt-1" />
            <p className="text-gray-700">
              <span className="font-semibold">Scalable Impact:</span> Built for
              communities of all sizes, from small towns to large cities.
            </p>
          </li>
        </ul>
      </div>

      {/* Right side - illustration */}
      <div className="bg-white shadow-lg rounded-2xl p-8">
        <Image
          src={AboutUs}
          alt="AI Citizen Reporter"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
