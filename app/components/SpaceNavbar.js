'use client';
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Mission Control", href: "/dashboard" },
  { label: "Asteroids", href: "/dashboard/neo" },
  { label: "Red Planet Feed", href: "/dashboard/mars" },
  { label: "Deep Space Learn", href: "/dashboard/learn" },
  { label: "Launch Pad", href: "/dashboard/space-weather" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-[#0b1023e6] fixed top-0 left-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo/Brand (add your logo or name here) */}
        <div className="text-sky-300 text-xl font-extrabold tracking-wide select-none">
          SONAR
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6 md:gap-10 text-slate-100 font-semibold text-base md:text-lg uppercase tracking-wider">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={`transition pb-1 border-b-2 ${
                  pathname === href
                    ? "border-sky-300 text-sky-300"
                    : "border-transparent hover:border-orange-300 hover:text-orange-200"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden focus:outline-none text-slate-100 hover:text-sky-300"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>
      {/* Mobile nav menu */}
      {menuOpen && (
        <ul className="md:hidden bg-[#0b1023] shadow-lg mx-2 rounded-xl py-4 mt-1 flex flex-col gap-1">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`block w-full px-6 py-3 rounded text-base font-semibold uppercase tracking-wider transition ${
                  pathname === href
                    ? "bg-sky-700/30 text-sky-300"
                    : "bg-transparent hover:bg-orange-900/40 hover:text-orange-200"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
