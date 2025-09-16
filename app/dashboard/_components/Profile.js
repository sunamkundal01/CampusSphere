"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  User,
  Edit3,
  ExternalLink,
  Building,
  GraduationCap,
  Mail,
  Calendar,
  Award,
} from "lucide-react";
import ProfileSetup from "./ProfileSetup";

function Profile({ children }) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const userProfile = useQuery(api.userProfiles.getUserProfile, {
    email: user?.primaryEmailAddress?.emailAddress || "",
  });

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleProfileUpdate = () => {
    setEditMode(false);
    // Profile will be automatically updated via the query
  };

  const formatJoinDate = (timestamp) => {
    if (!timestamp) return "Recently joined";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <div onClick={() => setOpen(true)}>{children}</div>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              My Profile
            </DialogTitle>
            <DialogDescription className="text-sm">
              View and manage your profile information
            </DialogDescription>
          </DialogHeader>

          {userProfile ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0">
                    {userProfile.name?.charAt(0)?.toUpperCase() ||
                      user?.firstName?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 break-words">
                      {userProfile.name ||
                        user?.firstName + " " + user?.lastName ||
                        "User"}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 flex items-center gap-1 break-all">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      Member since {formatJoinDate(userProfile.joinedAt)}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleEditProfile}
                  className="flex items-center gap-2 w-full sm:w-auto text-sm"
                >
                  <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  Edit Profile
                </Button>
              </div>

              {/* Profile Details */}
              <div className="grid gap-4 sm:gap-6">
                {/* Basic Information */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold border-b pb-2">
                    Basic Information
                  </h3>

                  {userProfile.isProfileComplete ? (
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Building className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Department</p>
                          <p className="font-medium">
                            {userProfile.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Batch</p>
                          <p className="font-medium">{userProfile.batch}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800">
                        Complete your profile to connect with fellow students
                        and get personalized recommendations!
                      </p>
                      <Button
                        onClick={handleEditProfile}
                        className="mt-2"
                        size="sm"
                      >
                        Complete Profile
                      </Button>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {userProfile.bio && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      About
                    </h3>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {userProfile.bio}
                    </p>
                  </div>
                )}

                {/* Skills & Expertise */}
                {userProfile.expertise && userProfile.expertise.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Skills & Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* LinkedIn */}
                {userProfile.linkedinProfile && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Connect
                    </h3>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(userProfile.linkedinProfile, "_blank")
                      }
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View LinkedIn Profile
                    </Button>
                  </div>
                )}

                {/* Profile Completion Status */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Profile Completion
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Basic Info (Name, Department, Batch)</span>
                      <span
                        className={
                          userProfile.isProfileComplete
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {userProfile.isProfileComplete
                          ? "✓ Complete"
                          : "✗ Incomplete"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Bio</span>
                      <span
                        className={
                          userProfile.bio ? "text-green-600" : "text-gray-500"
                        }
                      >
                        {userProfile.bio ? "✓ Added" : "Optional"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Skills</span>
                      <span
                        className={
                          userProfile.expertise?.length > 0
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        {userProfile.expertise?.length > 0
                          ? `✓ ${userProfile.expertise.length} skills`
                          : "Optional"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>LinkedIn</span>
                      <span
                        className={
                          userProfile.linkedinProfile
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        {userProfile.linkedinProfile
                          ? "✓ Connected"
                          : "Optional"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <User className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4 text-sm sm:text-base">
                Loading your profile...
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Profile Setup Modal */}
      <ProfileSetup
        isOpen={editMode}
        onClose={() => setEditMode(false)}
        onComplete={handleProfileUpdate}
      />
    </>
  );
}

export default Profile;
