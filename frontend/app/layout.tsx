'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/storeProvider";
import "leaflet/dist/leaflet.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProfileDrawer from "@/components/profile/ProfileDrawer";
import LoginSignupModal from "@/components/auth/LoginSignupModal";
import GlobalLoader from "@/components/common/GlobalLoader";
import GlobalMessage from "@/components/common/GlobalMessage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <Header />
          {children}
          <Footer />
          <ProfileDrawer/>
          <LoginSignupModal/>
          <GlobalLoader/>
          <GlobalMessage/>
        </StoreProvider>
      </body>
    </html>
  );
}
