"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Users,
  Search,
  Filter,
  ExternalLink,
  Star,
  GraduationCap,
  Building,
  Calendar,
  User,
} from "lucide-react";

function Community({ children }) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [showRecommended, setShowRecommended] = useState(false);

  const allUsers = useQuery(api.userProfiles.getAllUsers);
  const recommendedUsers = useQuery(api.userProfiles.getRecommendedUsers, {
    userEmail: user?.primaryEmailAddress?.emailAddress || "",
  });

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const filteredUsers =
    allUsers?.filter((u) => {
      const matchesSearch =
        !searchTerm ||
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.expertise?.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesDepartment =
        !filterDepartment || u.department === filterDepartment;
      const matchesBatch = !filterBatch || u.batch === filterBatch;

      return matchesSearch && matchesDepartment && matchesBatch;
    }) || [];

  const displayUsers = showRecommended ? recommendedUsers : filteredUsers;

  const departments =
    [...new Set(allUsers?.map((u) => u.department).filter(Boolean))] || [];
  const batches =
    [...new Set(allUsers?.map((u) => u.batch).filter(Boolean))] || [];

  const UserCard = ({ user: profileUser, isRecommended = false }) => (
    <div className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
            {profileUser.name?.charAt(0)?.toUpperCase() ||
              profileUser.userName?.charAt(0)?.toUpperCase() ||
              "U"}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm sm:text-lg flex items-center gap-2 break-words">
              {profileUser.name || profileUser.userName}
              {isRecommended && (
                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current flex-shrink-0" />
              )}
            </h3>
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <p className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                {profileUser.department}
              </p>
              <p className="flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                Batch {profileUser.batch}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {profileUser.linkedinProfile && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(profileUser.linkedinProfile, "_blank")}
              className="flex items-center gap-1 w-full sm:w-auto text-xs sm:text-sm"
            >
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
              Connect
            </Button>
          )}
        </div>
      </div>

      {profileUser.bio && (
        <p className="text-xs sm:text-sm text-gray-700 mt-3 leading-relaxed">
          {profileUser.bio}
        </p>
      )}

      {profileUser.expertise && profileUser.expertise.length > 0 && (
        <div className="mt-3">
          <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Skills & Expertise:
          </p>
          <div className="flex flex-wrap gap-1">
            {profileUser.expertise.slice(0, 6).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
              >
                {skill}
              </span>
            ))}
            {profileUser.expertise.length > 6 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                +{profileUser.expertise.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div onClick={() => setOpen(true)}>{children}</div>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Community
          </DialogTitle>
          <DialogDescription className="text-sm">
            Discover and connect with fellow students across your college
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filters */}
        <div className="space-y-4 border-b pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, department, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Button
              variant={showRecommended ? "default" : "outline"}
              onClick={() => setShowRecommended(!showRecommended)}
              className="flex items-center gap-2 w-full sm:w-auto text-sm"
            >
              <Star className="h-4 w-4" />
              Recommended
            </Button>
          </div>

          {!showRecommended && (
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <select
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All Batches</option>
                {batches.map((batch) => (
                  <option key={batch} value={batch}>
                    Batch {batch}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterDepartment("");
                  setFilterBatch("");
                }}
                className="col-span-1 sm:col-span-1 text-sm"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h3 className="font-semibold text-sm sm:text-base">
              {showRecommended ? "Recommended for You" : "All Members"}
              <span className="text-gray-500 font-normal ml-2">
                ({displayUsers?.length || 0} found)
              </span>
            </h3>
            {showRecommended && recommendedUsers?.length > 0 && (
              <p className="text-xs sm:text-sm text-gray-600">
                Based on your skills and interests
              </p>
            )}
          </div>

          {displayUsers?.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <User className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-sm sm:text-base">
                {showRecommended
                  ? "No recommendations available. Complete your profile to get personalized recommendations!"
                  : "No members found matching your criteria."}
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
              {displayUsers?.map((profileUser) => (
                <UserCard
                  key={profileUser._id}
                  user={profileUser}
                  isRecommended={showRecommended}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Community;
