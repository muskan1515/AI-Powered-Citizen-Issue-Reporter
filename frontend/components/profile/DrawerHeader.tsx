"use client";
import React from "react";

interface Props {
  title: string;
  onClose: () => void;
}

export const DrawerHeader: React.FC<Props> = ({ title, onClose }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
      >
        ✕
      </button>
    </div>
  );
};
