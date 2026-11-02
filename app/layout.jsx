import "./globals.css";
import { Inter, Outfit } from "next/font/google";
import Providere from "./Providere";
import { GoogleAuthProvider } from "../lib/GoogleAuthContext";
import { Toaster } from "../components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata = {
  title: "CampusSphere - PYQs, AI study notes and classmates in one place",
  description:
    "Find previous year papers, chat with your PDFs using AI, and connect with classmates by skill. Free for students.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <GoogleAuthProvider>
          <Providere>{children}</Providere>
          <Toaster />
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
