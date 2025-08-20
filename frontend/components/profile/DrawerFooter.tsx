"use client";
import React from "react";

interface Props {
  onLogout: () => void;
}

export const DrawerFooter: React.FC<Props> = ({ onLogout }) => {
  return (
    <div className="mt-6 flex justify-between">
      <button
        onClick={onLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};
