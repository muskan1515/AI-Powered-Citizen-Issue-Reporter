"use client";
import React from "react";
import Link from "next/link";

export const AuthLinks = () => (
  <div className="flex flex-col gap-4">
    <p className="text-gray-600 dark:text-gray-300">You are not logged in</p>
    <Link
      href="/login"
      className="bg-blue-500 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-600"
    >
      Login
    </Link>
    <Link
      href="/signup"
      className="bg-green-500 text-white px-4 py-2 rounded-lg text-center hover:bg-green-600"
    >
      Sign Up
    </Link>
  </div>
);
