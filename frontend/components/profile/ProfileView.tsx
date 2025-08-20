"use client";
import React from "react";
import { User } from "@/store/slices/authSlice";

interface Props {
  user: User;
  onEdit: () => void;
}

export const ProfileView: React.FC<Props> = ({ user, onEdit }) => {
  return (
    <div className="space-y-2">
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Gender:</strong> {user.gender}</p>
      {user.birthDate && (
        <p><strong>DOB:</strong> {new Date(user.birthDate).toDateString()}</p>
      )}
      <p><strong>Role:</strong> {user.role}</p>

      <button
        onClick={onEdit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Edit Profile
      </button>
    </div>
  );
};
