"use client";

import React, { useState } from "react";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";
import ProfileChecker from "./_components/ProfileChecker";
import UserInitializer from "./_components/UserInitializer";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <UserInitializer>
      <ProfileChecker>
        <div className="min-h-screen bg-gray-50 flex">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={closeSidebar}
            />
          )}

          {/* Sidebar */}
          <div
            className={`
            fixed top-0 left-0 z-50 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:relative lg:z-auto
            w-64 flex-shrink-0
          `}
          >
            <Sidebar onClose={closeSidebar} />
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0">
            <Header toggleSidebar={toggleSidebar} />
            <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </ProfileChecker>
    </UserInitializer>
  );
};

export default DashboardLayout;
