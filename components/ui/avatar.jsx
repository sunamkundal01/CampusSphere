"use client";

import { useState } from "react";
import { cn } from "../../lib/utils";
import { initials } from "../../lib/display";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-20 w-20 text-2xl",
};

export function Avatar({ src, name, size = "md", className }) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-cyan-500 font-semibold text-white",
        SIZES[size],
        className
      )}
    >
      {src && !failed ? (
        // Google profile photos come from many hosts, so a plain img avoids next/image domain config.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </span>
  );
}
