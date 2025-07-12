"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { Layout, Shield, FileText, Upload, Users, User, X } from "lucide-react";
import ViewPyqs from "./ViewPyqs";
import UploadPyq from "./UploadPyq";
import Community from "./Community";
import Profile from "./Profile";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

const Sidebar = ({ onClose }) => {
  const { user } = useUser();

  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress.emailAddress,
  });

  const handleItemClick = () => {
    // Close sidebar on mobile when an item is clicked
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header with logo and close button */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Link href="/" className="cursor-pointer">
            <Image
              src={"/logo.svg"}
              alt="CampusSphere"
              width={120}
              height={90}
              className="logo-primary logo-sidebar"
            />
          </Link>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 px-4 sm:px-6 py-6 overflow-y-auto">
        <nav className="space-y-2">
          <Link href="/dashboard" onClick={handleItemClick}>
            <div className="flex gap-3 items-center p-3 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
              <Layout size={20} />
              <h2 className="text-sm font-medium">Workspace</h2>
            </div>
          </Link>

          <ViewPyqs>
            <div
              className="flex gap-3 items-center p-3 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              onClick={handleItemClick}
            >
              <FileText size={20} />
              <h2 className="text-sm font-medium">View PYQs</h2>
            </div>
          </ViewPyqs>

          <UploadPyq>
            <div
              className="flex gap-3 items-center p-3 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              onClick={handleItemClick}
            >
              <Upload size={20} />
              <h2 className="text-sm font-medium">Upload PYQ</h2>
            </div>
          </UploadPyq>

          <Community>
            <div
              className="flex gap-3 items-center p-3 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              onClick={handleItemClick}
            >
              <Users size={20} />
              <h2 className="text-sm font-medium">Community</h2>
            </div>
          </Community>

          <Profile>
            <div
              className="flex gap-3 items-center p-3 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              onClick={handleItemClick}
            >
              <User size={20} />
              <h2 className="text-sm font-medium">Profile</h2>
            </div>
          </Profile>

          <div
            className="flex gap-3 items-center p-3 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
            onClick={handleItemClick}
          >
            <Shield size={20} />
            <h2 className="text-sm font-medium">Upgrade</h2>
          </div>
        </nav>
      </div>

      {/* Footer with usage stats */}
      <div className="p-4 sm:p-6 border-t border-gray-200">
        <div className="space-y-3">
          <Progress value={(fileList?.length / 10) * 100} className="h-2" />
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-600">
              {fileList?.length || 0} pdf uploaded till date
            </p>
            <p className="text-xs text-gray-400">
              Use for free! No Money required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
