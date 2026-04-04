import "./globals.css";
import { Outfit } from "next/font/google";
import Providere from "./Providere";
import { GoogleAuthProvider } from "../lib/GoogleAuthContext";
import { Toaster } from "../components/ui/sonner";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "CampusSphere - Academic Collaboration Platform",
  description:
    "Connect with peers, share study materials, and manage your academic workspace with CampusSphere",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <GoogleAuthProvider>
          <Providere>{children}</Providere>
          <Toaster />
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
