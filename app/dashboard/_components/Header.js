"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Header = ({ toggleSidebar }) => {
  return (
    <div className="flex items-center justify-between p-4 sm:p-5 bg-white shadow-md border-b">
      {/* Mobile hamburger menu */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* Logo/Title for mobile */}
      <div className="lg:hidden">
        <Link href="/" className="cursor-pointer">
          <Image
            src={"/logo.svg"}
            alt="CampusSphere"
            width={120}
            height={90}
            className="h-8 w-auto logo-primary"
          />
        </Link>
      </div>

      {/* User button */}
      <div className="ml-auto">
        <UserButton />
      </div>
    </div>
  );
};

export default Header;
