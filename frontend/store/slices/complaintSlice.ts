import { Complaint } from "@/components/complaints/type";
import { getApiInstance } from "@/lib/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface ComplaintState {
  complaints: Complaint[];
  loading: boolean;
  error: string | null;
}

const initialState: ComplaintState = {
  complaints: [],
  loading: false,
  error: null,
};

const api = getApiInstance("COMPLAINTS");

// ------------------ Async Thunks ------------------

// Fetch all complaints (admin) or user’s own
export const fetchComplaints = createAsyncThunk(
  "complaints/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<Complaint[]>("/");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load complaints");
    }
  }
);

// Add new complaint
export const addComplaint = createAsyncThunk(
  "complaints/add",
  async (
    complaint: { text: string; address: { lat: number; lng: number } },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<Complaint>("/", complaint);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to add complaint");
    }
  }
);

// Update complaint (text, location, status)
export const updateComplaint = createAsyncThunk(
  "complaints/update",
  async (
    {
      id,
      status,
    }: {
      id: string;
      status: 'open' | 'in_progress' | 'resolved';
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<Complaint>(`/${id}`, {status});
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update complaint");
    }
  }
);

// Remove complaint
export const removeComplaint = createAsyncThunk(
  "complaints/remove",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete complaint");
    }
  }
);

// ------------------ Slice ------------------
const complaintSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---------------- fetchComplaints ----------------
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action: PayloadAction<Complaint[]>) => {
        state.loading = false;
        state.complaints = action.payload;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ---------------- addComplaint ----------------
      .addCase(addComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComplaint.fulfilled, (state, action: PayloadAction<Complaint>) => {
        state.loading = false;
        state.complaints.unshift(action.payload);
      })
      .addCase(addComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ---------------- updateComplaint ----------------
      .addCase(updateComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComplaint.fulfilled, (state, action: PayloadAction<Complaint>) => {
        state.loading = false;
        const index = state.complaints.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.complaints[index] = action.payload;
      })
      .addCase(updateComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ---------------- removeComplaint ----------------
      .addCase(removeComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeComplaint.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.complaints = state.complaints.filter((c) => c._id !== action.payload);
      })
      .addCase(removeComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default complaintSlice.reducer;
