"use client";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  closeLoginDrawer,
  loginUser,
  signupUser,
} from "@/store/slices/authSlice";
import { RootState } from "@/store";
import { hideLoader, showLoader, showMessage } from "@/store/slices/uiSlice";
import { Loader2 } from "lucide-react";

export default function LoginSignupModal() {
  const dispatch = useAppDispatch();
  const { showLogin: isOpen, error, successMessage, user, token } = useAppSelector(
    (state: RootState) => state.auth
  );


  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  
  const onClose = () => {
    dispatch(closeLoginDrawer());
  };


  useEffect(() => {
    if (error) {
      dispatch(showMessage({ type: "error", text: error }));
    }
    if (successMessage) {
      dispatch(showMessage({ type: "success", text: successMessage }));
      onClose()
    }
  }, [error, successMessage, dispatch]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(showLoader());

    try {
      if (isLogin) {
        await dispatch(
          loginUser({ email: form.email, password: form.password })
        );
      } else {
        await dispatch(
          signupUser({
            email: form.email,
            password: form.password,
            name: form.name,
          })
        );
      }
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-md shadow-lg relative">
        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md flex items-center justify-center gap-2"
          >
            {/* <Loader2 className="animate-spin w-4 h-4" /> */}
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-blue-600 underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-lg font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
