"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  label: string;
  href: string;
  external?: boolean;
};

const ITEMS: Item[] = [
  { label: "GAMES", href: "/feed#games" },
  { label: "TRANSMISSIONS", href: "/feed#signal" },
  { label: "PRINT LAB", href: "#", external: true },
  { label: "AUSTINGREGORY.TECH", href: "https://austingregory.tech", external: true },
];

export function TerminalNav() {
  const pathname = usePathname();

  // For internal links: if we're already on the target route, smooth-scroll
  // to the anchor; otherwise let Next.js client-navigate.
  const handleInternal = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const [path, hash] = href.split("#");
    const targetPath = path || "/";
    if (pathname === targetPath && hash) {
      e.preventDefault();
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // else: default Link behavior — Next.js client-navigates and the browser
    // handles the hash on load.
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-phosphor-dim/40 bg-black/75 backdrop-blur-md">
      {/* Scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div className="relative mx-auto flex h-12 max-w-[1400px] items-center justify-between px-4 sm:px-6">
        {/* Brand — back to the room */}
        <Link
          href="/"
          className="group flex items-center gap-2 font-mono text-[12px] tracking-[0.3em] text-phosphor text-glow-green"
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-phosphor"
            style={{ boxShadow: "0 0 6px #00ff41" }}
          />
          <span className="hidden sm:inline">DARK_GAME_FACTORY</span>
          <span className="sm:hidden">DGF</span>
        </Link>

        {/* Links */}
        <ul className="flex items-center gap-1 sm:gap-2">
          {ITEMS.map((it) => (
            <li key={it.label}>
              {it.external ? (
                <a
                  href={it.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-1 px-2 py-1.5 font-mono text-[10px] tracking-[0.25em] text-phosphor/70 transition-colors hover:text-phosphor hover:text-glow-green sm:text-[11px] sm:px-3"
                >
                  {it.label}
                  <span className="text-phosphor/40 transition-colors group-hover:text-phosphor">
                    ↗
                  </span>
                </a>
              ) : (
                <Link
                  href={it.href}
                  onClick={(e) => handleInternal(e, it.href)}
                  className="group relative inline-flex items-center px-2 py-1.5 font-mono text-[10px] tracking-[0.25em] text-phosphor/70 transition-colors hover:text-phosphor hover:text-glow-green sm:text-[11px] sm:px-3"
                >
                  {it.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
