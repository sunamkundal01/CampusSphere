"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Menu, Plus } from "lucide-react";
import { UserButton } from "../../../components/ui/UserButton";
import { Button } from "../../../components/ui/button";
import UploadPrivatePdf from "./UploadPrivatePdf";
import { currentNavItem } from "./navigation";

const Header = ({ toggleSidebar }) => {
  const pathname = usePathname();
  const current = currentNavItem(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-lg sm:px-6 lg:px-8">
      <button
        onClick={toggleSidebar}
        className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-secondary lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <p className="truncate font-display text-lg font-semibold">{current?.label || "Dashboard"}</p>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <UploadPrivatePdf>
          <Button size="sm" className="h-9">
            <Plus aria-hidden="true" />
            <span className="hidden sm:inline">Upload PDF</span>
            <span className="sr-only sm:hidden">Upload PDF</span>
          </Button>
        </UploadPrivatePdf>
        <UserButton />
      </div>
    </header>
  );
};

export default Header;
