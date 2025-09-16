import localFont from "next/font/local";
import "./globals.css";
import { Outfit } from "next/font/google";
import Providere from "./Providere";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "../components/ui/sonner";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "CampusSphere - Academic Collaboration Platform",
  description:
    "Connect with peers, share study materials, and manage your academic workspace with CampusSphere",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.className}>
          <Providere>{children}</Providere>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
