"use client";

import { useUser, useAuth } from "../../lib/GoogleAuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar } from "./avatar";

export function UserButton() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Open account menu"
      >
        <Avatar src={user.imageUrl} name={user.fullName} size="sm" className="h-9 w-9" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-xl p-1.5">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-semibold">{user.fullName || "Student"}</p>
          <p className="truncate text-xs text-muted-foreground">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2">
          <Link href="/dashboard">
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2">
          <Link href="/dashboard/profile">
            <User className="h-4 w-4" aria-hidden="true" />
            My profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={handleSignOut}
          className="cursor-pointer gap-2 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
