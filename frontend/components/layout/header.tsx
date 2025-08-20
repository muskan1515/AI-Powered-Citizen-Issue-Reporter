"use client";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { openLoginDrawer, openProfileDrawer } from "@/store/slices/authSlice";
import placeholder from "@/public/images/placeholder.png";
import { RootState } from "@/store";

export default function Header() {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);

  const openDrawer = () => {
    dispatch(openProfileDrawer());
  };

  const openLoginModal = () => {
    dispatch(openLoginDrawer());
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-700">
          Citizen Reporter
        </Link>

        {/* Navigation */}
        <nav className="flex gap-6 items-center">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/complaints" className="hover:text-blue-600">
            Complaints
          </Link>
          <Link href="/about" className="hover:text-blue-600">
            About Us
          </Link>

          {/* Auth section */}
          {!token ? (
            // Show Login & Signup if no token
            <div className="flex gap-4">
              <button
                onClick={openLoginModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </button>
            </div>
          ) : (
            // Show Profile drawer button if logged in
            <button
              onClick={openDrawer}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600"
            >
              <Image
                src={placeholder}
                alt="User Avatar"
                width={40}
                height={40}
              />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
