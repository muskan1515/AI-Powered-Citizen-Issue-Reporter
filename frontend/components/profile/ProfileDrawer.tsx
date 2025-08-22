"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  closeProfileDrawer,
  getUserProfile,
  logoutUser,
  updateUserProfile,
} from "@/store/slices/authSlice";
import { showLoader, hideLoader, showMessage } from "@/store/slices/uiSlice";
import { UpdateProfileRequest } from "@/types/user";

import { DrawerHeader } from "./DrawerHeader";
import { DrawerFooter } from "./DrawerFooter";
import { AuthLinks } from "./AuthLinks";
import { ProfileView } from "./ProfileView";
import { ProfileEditForm } from "./ProfileEditForm";

export default function ProfileDrawer() {
  const dispatch = useAppDispatch();
  const { user, error, loading, showProfile } = useSelector(
    (state: RootState) => state.auth
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    name: user?.name || "",
    gender: user?.gender || "other",
    birthDate: user?.birthDate || "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  useEffect(() => {
    if (showProfile) dispatch(getUserProfile());
  }, [dispatch, showProfile]);

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      gender: user?.gender || "other",
      birthDate: user?.birthDate || "",
      address: {
        line1: user?.address?.line1 || "",
        line2: user?.address?.line2 || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        postalCode: user?.address?.postalCode || "",
        country: user?.address?.country || "",
      },
    });
  }, [user]);

  useEffect(() => {
    if (loading) dispatch(showLoader());
    else dispatch(hideLoader());
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) dispatch(showMessage({ type: "error", text: error }));
  }, [error, dispatch]);

  type AddressKeys = keyof UpdateProfileRequest["address"];
  type TopLevelKeys = Exclude<keyof UpdateProfileRequest, "address">;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev: UpdateProfileRequest): UpdateProfileRequest => {
      if (
        ["line1", "line2", "city", "state", "postalCode", "country"].includes(
          name
        )
      ) {
        // Field is part of address
        const key = name as AddressKeys;
        return {
          ...prev,
          address: {
            ...prev.address,
            [key]: value,
          },
        };
      } else {
        // Top-level field
        const key = name as TopLevelKeys;
        return {
          ...prev,
          [key]: value as any, // can cast safely here
        };
      }
    });
  };

  const handleSave = () => {
    dispatch(updateUserProfile(formData)).then((res: any) => {
      if (!res.error) {
        dispatch(
          showMessage({ type: "success", text: "Profile updated successfully" })
        );
        setIsEditing(false);
      }
    });
  };

  const handleClose = () => dispatch(closeProfileDrawer());

  const handleLogout = () => {
    dispatch(logoutUser());
    handleClose();
  };

  if (!showProfile) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-900 shadow-lg z-50 p-6 transition-transform duration-300">
      <DrawerHeader title="Profile" onClose={handleClose} />

      {!user ? (
        <AuthLinks />
      ) : isEditing ? (
        <ProfileEditForm
          formData={formData}
          setFormDataHandle={handleChange}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <ProfileView user={user} onEdit={() => setIsEditing(true)} />
      )}

      {user && <DrawerFooter onLogout={handleLogout} />}
    </div>
  );
}
