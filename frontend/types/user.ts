import { User } from "@/store/slices/authSlice";

export interface loginUserType {
  email: string;
  password: string;
}

export interface signupUserProps {
  email: string;
  password: string;
  name: string;
}

export interface UpdateProfileRequest {
  name?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  gender?: "male" | "female" | "other";
  birthDate?: string;
}

export interface UpdateProfileResponse {
  user: User;
}
