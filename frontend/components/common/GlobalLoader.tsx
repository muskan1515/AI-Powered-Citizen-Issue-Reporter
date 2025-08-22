"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function GlobalLoader() {
  const loading = useSelector((state: RootState) => state.ui.loading);
  
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
      <div className="h-16 w-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
