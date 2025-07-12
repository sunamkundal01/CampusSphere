"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { DEPARTMENTS, BATCHES, SKILLS } from "./communityConstants";
import { Loader2Icon, Plus, X } from "lucide-react";

function ProfileSetup({ isOpen, onClose, onComplete }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [bio, setBio] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");

  const updateProfile = useMutation(api.userProfiles.updateUserProfile);
  const userProfile = useQuery(api.userProfiles.getUserProfile, {
    email: user?.primaryEmailAddress?.emailAddress || "",
  });

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setDepartment(userProfile.department || "");
      setBatch(userProfile.batch || "");
      setLinkedinProfile(userProfile.linkedinProfile || "");
      setBio(userProfile.bio || "");
      setSelectedSkills(userProfile.expertise || []);
    }
  }, [userProfile]);

  const addSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !department || !batch) {
      toast.error(
        "Please fill in all required fields (Name, Department, Batch)"
      );
      return;
    }

    setLoading(true);

    try {
      await updateProfile({
        email: user?.primaryEmailAddress?.emailAddress,
        name: name.trim(),
        department,
        batch,
        linkedinProfile: linkedinProfile.trim(),
        expertise: selectedSkills,
        bio: bio.trim(),
      });

      toast.success("Profile updated successfully!");
      onComplete?.();
      onClose?.();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Help others discover you by completing your profile information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Required Fields */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Required Information</h3>

            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name *
              </label>
              <Input
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Department *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Batch Year *
                </label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Batch</option>
                  {BATCHES.map((batchYear) => (
                    <option key={batchYear} value={batchYear}>
                      {batchYear}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Optional Information</h3>

            <div>
              <label className="block text-sm font-medium mb-2">
                LinkedIn Profile
              </label>
              <Input
                placeholder="https://linkedin.com/in/your-profile"
                value={linkedinProfile}
                onChange={(e) => setLinkedinProfile(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                placeholder="Tell others about yourself, your interests, or what you're working on..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 border rounded-md h-20 resize-none"
                maxLength={200}
              />
              <p className="text-sm text-gray-500 mt-1">
                {bio.length}/200 characters
              </p>
            </div>

            {/* Skills Section */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Skills & Expertise
              </label>

              {/* Selected Skills */}
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add Custom Skill */}
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Add a custom skill..."
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
                />
                <Button onClick={addCustomSkill} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Common Skills */}
              <div className="max-h-40 overflow-y-auto border rounded-md p-3">
                <p className="text-sm text-gray-600 mb-2">Popular skills:</p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.filter((skill) => !selectedSkills.includes(skill))
                    .slice(0, 30)
                    .map((skill) => (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        className="px-2 py-1 text-sm border rounded-md hover:bg-gray-100 transition-colors"
                      >
                        {skill}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileSetup;
