"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/events", label: "Events" },
  { href: "/volunteers", label: "Volunteers" },
  { href: "/incidents", label: "Incidents" },
];

export default function Nav() {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary inline-block" />
          <span className="text-gray-900 font-semibold text-base tracking-tight">
            Beacon
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={[
                "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                isActive(href)
                  ? "text-primary border-b-2 border-primary rounded-none"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              ].join(" ")}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
