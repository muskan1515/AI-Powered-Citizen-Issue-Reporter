"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { hideMessage } from "@/store/slices/uiSlice";
import { useEffect } from "react";

export default function GlobalMessage() {
  const dispatch = useDispatch();
  const message = useSelector((state: RootState) => state.ui.message);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(hideMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;

  const base =
    "fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white z-[1001] transition-all";

  const styles = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-600",
  };

  return (
    <div className={`${base} ${styles[message.type]}`}>
      <p className="font-medium">{message.text}</p>
    </div>
  );
}
