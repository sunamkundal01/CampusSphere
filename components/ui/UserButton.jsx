"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, useAuth } from "../../lib/GoogleAuthContext";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function UserButton() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  if (!user) return null;

  const initial =
    user.fullName?.charAt(0)?.toUpperCase() ||
    user.primaryEmailAddress?.emailAddress?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 overflow-hidden"
      >
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt="avatar"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50 py-2">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium truncate">{user.fullName || "User"}</p>
            <p className="text-xs text-gray-500 truncate">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
