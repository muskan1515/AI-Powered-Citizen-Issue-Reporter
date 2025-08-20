import { getApiInstance } from "@/lib/axiosInstance";
import { UpdateProfileRequest, UpdateProfileResponse } from "@/types/user";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ---------------- User & State Types ----------------
export interface User {
  _id: string;
  email: string;
  name: string;
  gender: "male" | "female" | "other";
  birthDate?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  role: "user" | "admin";
}

interface AuthResponse {
  user: User;
  message: string;
  accessToken: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  successMessage: string;
  error: string | null;
  showProfile: boolean;
  showLogin: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  successMessage: "",
  showProfile: false,
  showLogin: false,
};

// ---------------- API Instance ----------------
const api = getApiInstance("AUTH");
const userApi = getApiInstance("USER");
// ---------------- Async Thunks ----------------

// Login
export const loginUser = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async (credentials, thunkAPI) => {
  try {
    const { data } = await api.post<AuthResponse>("/login", credentials);
    return data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
    return thunkAPI.rejectWithValue("Something went wrong");
  }
});

// Signup
export const signupUser = createAsyncThunk<
  AuthResponse,
  { email: string; password: string; name: string }
>("auth/signupUser", async (userData, thunkAPI) => {
  try {
    const { data } = await api.post<AuthResponse>("/signup", userData);
    return data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
    return thunkAPI.rejectWithValue("Something went wrong");
  }
});

// Get Current User Profile
export const getUserProfile = createAsyncThunk<
  User,
  void,
  { state: { auth: AuthState } }
>("auth/getUserProfile", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue("No token found");
  }

  try {
    const { data } = await userApi.get<User>("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
    return thunkAPI.rejectWithValue("Something went wrong");
  }
});

export const updateUserProfile = createAsyncThunk<
  UpdateProfileResponse,
  UpdateProfileRequest
>("auth/updateUserProfile", async (profileData, thunkAPI) => {
  try {
    const { data } = await userApi.put<UpdateProfileResponse>(
      "/me",
      profileData
    );
    return data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
    return thunkAPI.rejectWithValue("Something went wrong");
  }
});

//logout user
export const logoutUser = createAsyncThunk<null, void>(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.post<null>("/logout");
      return data; // should be null
    } catch (error: any) {
      const message = error.response?.data?.error || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ---------------- Slice ----------------
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    openProfileDrawer: (state) => {
      state.showProfile = true;
    },
    closeProfileDrawer: (state) => {
      state.showProfile = false;
    },
    openLoginDrawer: (state) => {
      state.showLogin = true;
    },
    closeLoginDrawer: (state) => {
      state.showLogin = false;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Login ---
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.successMessage = action.payload.message;
        state.token = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      })

      // --- Signup ---
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.successMessage = action.payload.message;
        state.token = action.payload.accessToken;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Signup failed";
      })

      // --- Get User Profile ---
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch profile";
      })
      // --- update user profile ---
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Update failed";
      })
      // --- update user profile ---
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.successMessage = "";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Update failed";
      });
  },
});

// ---------------- Exports ----------------
export const {
  logout,
  openProfileDrawer,
  closeProfileDrawer,
  openLoginDrawer,
  closeLoginDrawer,
  setToken,
} = authSlice.actions;
export default authSlice.reducer;
