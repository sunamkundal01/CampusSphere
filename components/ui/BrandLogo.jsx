import Image from "next/image";
import Link from "next/link";
import { cn } from "../../lib/utils";

export function BrandLogo({ href = "/", className, priority = false }) {
  return (
    <Link
      href={href}
      aria-label="CampusSphere home"
      className="inline-flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Image
        src="/logo.svg"
        alt="CampusSphere"
        width={855}
        height={133}
        priority={priority}
        className={cn("h-7 w-auto sm:h-8", className)}
      />
    </Link>
  );
}
