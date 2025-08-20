import { getApiInstance } from "@/lib/axiosInstance";
import { UpdateProfileRequest, UpdateProfileResponse } from "@/types/user";

const api = getApiInstance("AUTH");

export const updateProfile = async (
  profileData: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
  const { data } = await api.put<UpdateProfileResponse>("/profile", profileData);
  return data;
};
