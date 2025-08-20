import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

import authReducer from "./slices/authSlice";
import complaintReducer from "./slices/complaintSlice";
import uiReducer from "./slices/uiSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; 

// ---------------- Persist Config ----------------
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user"], 
};

// Wrap the auth reducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// ---------------- Store ----------------
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    complaint: complaintReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Persistor
export const persistor = persistStore(store);

// ---------------- Types ----------------
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ---------------- Hooks ----------------
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
