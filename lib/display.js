// Small formatting helpers shared across the dashboard.

export function initials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "U";
}

// Uploaders are stored by email; show the readable part instead of the full address.
export function nameFromEmail(email) {
  if (!email || email === "Anonymous") return "Anonymous";
  return email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\d+/g, "")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Student";
}

// Older uploads stored custom subjects as "Custom:<name>".
export function cleanSubject(subject) {
  return (subject || "").replace(/^Custom:/, "");
}

export function formatDate(timestamp) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function timeAgo(timestamp) {
  if (!timestamp) return "";
  const seconds = Math.round((Date.now() - timestamp) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const steps = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.35, "week"],
    [12, "month"],
    [Infinity, "year"],
  ];
  let value = seconds;
  for (const [size, unit] of steps) {
    if (Math.abs(value) < size) return rtf.format(-Math.round(value), unit);
    value /= size;
  }
  return "";
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// Required fields count most; optional ones round the profile out.
export function profileCompletion(profile) {
  const items = [
    { key: "basics", label: "Name, department and batch", done: !!profile?.isProfileComplete },
    { key: "bio", label: "Short bio", done: !!profile?.bio },
    { key: "skills", label: "At least 3 skills", done: (profile?.expertise?.length || 0) >= 3 },
    { key: "linkedin", label: "LinkedIn profile", done: !!profile?.linkedinProfile },
  ];
  const weights = { basics: 55, bio: 15, skills: 20, linkedin: 10 };
  const percent = items.reduce((sum, i) => sum + (i.done ? weights[i.key] : 0), 0);
  return { percent, items };
}
