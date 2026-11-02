"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Select } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { useUser } from "../../../lib/GoogleAuthContext";
import { toast } from "sonner";
import { DEPARTMENTS, BATCHES, SKILLS } from "./communityConstants";
import { Loader2Icon, Plus, X } from "lucide-react";

const BIO_MAX = 200;

function ProfileSetup({ isOpen, onClose, onComplete }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  const isOnboarding = userProfile !== undefined && !userProfile?.isProfileComplete;

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || user?.fullName || "");
      setDepartment(userProfile.department || "");
      setBatch(userProfile.batch || "");
      setLinkedinProfile(userProfile.linkedinProfile || "");
      setBio(userProfile.bio || "");
      setSelectedSkills(userProfile.expertise || []);
    } else if (user?.fullName) {
      setName((n) => n || user.fullName);
    }
  }, [userProfile, user?.fullName]);

  const errors = {
    name: !name.trim() && "Enter your name.",
    department: !department && "Choose your department.",
    batch: !batch && "Choose your graduating batch.",
    linkedin:
      linkedinProfile.trim() && !/^https?:\/\/(www\.)?linkedin\.com\//i.test(linkedinProfile.trim())
        ? "Use a full LinkedIn URL, like https://linkedin.com/in/your-name"
        : null,
  };

  const addSkill = (skill) => {
    const s = skill.trim();
    if (s && !selectedSkills.some((x) => x.toLowerCase() === s.toLowerCase())) {
      setSelectedSkills([...selectedSkills, s]);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter((skill) => skill !== skillToRemove));
  };

  const addCustomSkill = () => {
    addSkill(customSkill);
    setCustomSkill("");
  };

  const suggestions = SKILLS.filter(
    (skill) =>
      !selectedSkills.includes(skill) &&
      (!customSkill.trim() || skill.toLowerCase().includes(customSkill.trim().toLowerCase()))
  ).slice(0, 24);

  const handleSubmit = async () => {
    setSubmitted(true);
    if (errors.name || errors.department || errors.batch || errors.linkedin) {
      toast.error("A few details need attention", { description: "Check the highlighted fields." });
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

      toast.success(isOnboarding ? "You're all set!" : "Profile updated");
      setSubmitted(false);
      onComplete?.();
      onClose?.();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Couldn't save your profile", { description: "Please try again." });
    }

    setLoading(false);
  };

  const fieldError = (key) =>
    submitted && errors[key] ? (
      <p id={`profile-${key}-error`} className="mt-1.5 text-sm text-destructive">
        {errors[key]}
      </p>
    ) : null;

  const describedBy = (key) => (submitted && errors[key] ? `profile-${key}-error` : undefined);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !loading && onClose?.()}>
      <DialogContent className="max-h-[90dvh] w-[calc(100vw-2rem)] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isOnboarding ? "Welcome to CampusSphere" : "Edit your profile"}</DialogTitle>
          <DialogDescription>
            {isOnboarding
              ? "Tell classmates who you are. It takes a minute and unlocks study-partner recommendations."
              : "Changes show up in the community directory right away."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              The basics
            </legend>

            <div>
              <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium">
                Full name <span className="text-destructive" aria-hidden="true">*</span>
              </label>
              <Input
                id="profile-name"
                autoComplete="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-required="true"
                aria-invalid={submitted && !!errors.name}
                aria-describedby={describedBy("name")}
              />
              {fieldError("name")}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="profile-department" className="mb-1.5 block text-sm font-medium">
                  Department <span className="text-destructive" aria-hidden="true">*</span>
                </label>
                <Select
                  id="profile-department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  aria-required="true"
                  aria-invalid={submitted && !!errors.department}
                  aria-describedby={describedBy("department")}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </Select>
                {fieldError("department")}
              </div>
              <div>
                <label htmlFor="profile-batch" className="mb-1.5 block text-sm font-medium">
                  Batch (graduating year) <span className="text-destructive" aria-hidden="true">*</span>
                </label>
                <Select
                  id="profile-batch"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  aria-required="true"
                  aria-invalid={submitted && !!errors.batch}
                  aria-describedby={describedBy("batch")}
                >
                  <option value="">Select batch</option>
                  {BATCHES.map((batchYear) => (
                    <option key={batchYear} value={batchYear}>
                      {batchYear}
                    </option>
                  ))}
                </Select>
                {fieldError("batch")}
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Skills <span className="font-normal normal-case tracking-normal">(used for recommendations)</span>
            </legend>

            {selectedSkills.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Your skills">
                {selectedSkills.map((skill) => (
                  <li
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 py-1 pl-3 pr-1 text-sm font-medium text-primary"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-primary/15"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div>
              <label htmlFor="profile-skill" className="sr-only">
                Find or add a skill
              </label>
              <div className="flex gap-2">
                <Input
                  id="profile-skill"
                  placeholder="Search or add a skill, e.g. Python"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomSkill();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addCustomSkill} disabled={!customSkill.trim()}>
                  <Plus aria-hidden="true" /> Add
                </Button>
              </div>
            </div>

            {suggestions.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {customSkill.trim() ? "Matching skills" : "Popular with students"}
                </p>
                <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto">
                  {suggestions.map((skill) => (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => addSkill(skill)}
                      className="inline-flex h-8 items-center gap-1 rounded-full border px-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
                    >
                      <Plus className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Optional
            </legend>
            <div>
              <label htmlFor="profile-bio" className="mb-1.5 block text-sm font-medium">
                Short bio
              </label>
              <Textarea
                id="profile-bio"
                placeholder="What are you studying, building or looking for help with?"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="resize-none"
                maxLength={BIO_MAX}
                aria-describedby="profile-bio-count"
              />
              <p id="profile-bio-count" className="mt-1.5 text-right text-xs tabular-nums text-muted-foreground">
                {bio.length}/{BIO_MAX}
              </p>
            </div>
            <div>
              <label htmlFor="profile-linkedin" className="mb-1.5 block text-sm font-medium">
                LinkedIn profile URL
              </label>
              <Input
                id="profile-linkedin"
                type="url"
                inputMode="url"
                placeholder="https://linkedin.com/in/your-name"
                value={linkedinProfile}
                onChange={(e) => setLinkedinProfile(e.target.value)}
                aria-invalid={submitted && !!errors.linkedin}
                aria-describedby={describedBy("linkedin")}
              />
              {fieldError("linkedin")}
            </div>
          </fieldset>
        </div>

        <DialogFooter className="border-t pt-5">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {isOnboarding ? "Skip for now" : "Cancel"}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2Icon className="animate-spin" aria-hidden="true" /> Saving…
              </>
            ) : isOnboarding ? (
              "Finish setup"
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileSetup;
