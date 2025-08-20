"use client";
import React from "react";
import { UpdateProfileRequest } from "@/types/user";

interface Props {
  formData: UpdateProfileRequest;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileEditForm: React.FC<Props> = ({
  formData,
  onChange,
  onSave,
  onCancel,
}) => (
  <div className="space-y-3">
    <input
      type="text"
      name="name"
      placeholder="Name"
      value={formData.name}
      onChange={onChange}
      className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
    />
    <input
      type="text"
      name="line1"
      placeholder="Address Line 1"
      value={formData?.address?.line1 || ""}
      onChange={(e) =>
        onChange({
          ...formData,
          address: { ...formData.address, line1: e.target.value },
        })
      }
      className="w-full border px-3 py-2 rounded"
    />
    <input
      type="text"
      name="line2"
      placeholder="Address Line 2"
      value={formData?.address?.line2 || ''}
      onChange={(e) =>
        setFormData({
          ...formData,
          address: { ...formData.address, line2: e.target.value },
        })
      }
      className="w-full border px-3 py-2 rounded"
    />
    <input
      type="text"
      name="city"
      placeholder="City"
      value={formData?.address?.city || ''}
      onChange={(e) =>
        setFormData({
          ...formData,
          address: { ...formData.address, city: e.target.value },
        })
      }
      className="w-full border px-3 py-2 rounded"
    />
    <input
      type="text"
      name="state"
      placeholder="State"
      value={formData?.address?.state || ''}
      onChange={(e) =>
        setFormData({
          ...formData,
          address: { ...formData.address, state: e.target.value },
        })
      }
      className="w-full border px-3 py-2 rounded"
    />
    <input
      type="text"
      name="postalCode"
      placeholder="Postal Code"
      value={formData?.address?.postalCode || ''}
      onChange={(e) =>
        setFormData({
          ...formData,
          address: { ...formData.address, postalCode: e.target.value },
        })
      }
      className="w-full border px-3 py-2 rounded"
    />
    <input
      type="text"
      name="country"
      placeholder="Country"
      value={formData?.address?.country || ''}
      onChange={(e) =>
        setFormData({
          ...formData,
          address: { ...formData.address, country: e.target.value },
        })
      }
      className="w-full border px-3 py-2 rounded"
    />

    <select
      name="gender"
      value={formData.gender}
      onChange={onChange}
      className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
    >
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
    <input
      type="date"
      name="birthDate"
      value={formData.birthDate?.split("T")[0] || ""}
      onChange={onChange}
      className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
    />

    <div className="flex gap-2 mt-4">
      <button
        onClick={onSave}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
      >
        Cancel
      </button>
    </div>
  </div>
);
