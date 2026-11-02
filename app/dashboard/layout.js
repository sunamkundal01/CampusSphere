"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";
import ProfileChecker from "./_components/ProfileChecker";
import UserInitializer from "./_components/UserInitializer";
import { AuthGuard } from "../../components/ui/AuthGuard";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e) => e.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  return (
    <AuthGuard>
    <UserInitializer>
      <ProfileChecker>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <div className="flex min-h-dvh bg-background">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
              onClick={closeSidebar}
              aria-hidden="true"
            />
          )}

          <aside
            className={`
            fixed inset-y-0 left-0 z-50 w-64 shrink-0 transform transition-transform duration-300 ease-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0
          `}
          >
            <Sidebar onClose={closeSidebar} />
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <Header toggleSidebar={() => setSidebarOpen((v) => !v)} />
            <main id="main" className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              <div className="mx-auto max-w-6xl">{children}</div>
            </main>
          </div>
        </div>
      </ProfileChecker>
    </UserInitializer>
    </AuthGuard>
  );
};

export default DashboardLayout;
