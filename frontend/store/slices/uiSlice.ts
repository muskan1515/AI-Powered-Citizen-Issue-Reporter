import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MessageType = "success" | "error" | "warning" | "info";

interface UIState {
  loading: boolean;
  message: {
    type: MessageType;
    text: string;
  } | null;
}

const initialState: UIState = {
  loading: false,
  message: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showLoader: (state) => {
      state.loading = true;
    },
    hideLoader: (state) => {
      state.loading = false;
    },
    showMessage: (
      state,
      action: PayloadAction<{ type: MessageType; text: string }>
    ) => {
      state.message = action.payload;
    },
    hideMessage: (state) => {
      state.message = null;
    },
  },
});

export const { showLoader, hideLoader, showMessage, hideMessage } =
  uiSlice.actions;

export default uiSlice.reducer;
