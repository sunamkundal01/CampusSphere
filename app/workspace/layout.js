"use client";

import { AuthGuard } from "../../components/ui/AuthGuard";

export default function WorkspaceLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
