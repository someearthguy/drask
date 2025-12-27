"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/magnetic-button";
import { LogoIcon } from "./logo-icon";

interface NavbarProps {
  isLoaded: boolean;
  currentSection: number;
  navigationItems: { name: string; index: number }[];
  scrollToSection: (index: number) => void;
}

export function Navbar({
  isLoaded,
  currentSection,
  navigationItems,
  scrollToSection,
}: NavbarProps) {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [bubble, setBubble] = useState<{ left: number; width: number } | null>(
    null
  );

  /* ---------------- Position bubble on active section ---------------- */

  useLayoutEffect(() => {
    snapTo(currentSection);
  }, [currentSection]);

  /* ---------------- Snap helper ---------------- */

  const snapTo = (index: number) => {
    const el = itemRefs.current[index];
    const container = containerRef.current;
    if (!el || !container) return;

    const cRect = container.getBoundingClientRect();
    const rect = el.getBoundingClientRect();

    setBubble({
      left: rect.left - cRect.left,
      width: rect.width,
    });
  };

  return (
    <nav
      className={`sticky top-4 z-30 mx-4 rounded-full
      flex items-center justify-between
      border border-chart-2/40 bg-white/10
      px-4 py-3 md:px-6
      backdrop-blur-md shadow-sm
      transition-opacity duration-700
      ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      {/* ---------- Logo ---------- */}
      <button
        onClick={() => scrollToSection(0)}
        className="flex items-center gap-3"
      >
        <div
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(256,256,256,0.75), transparent 60%), radial-gradient(circle at 80% 30%, rgba(256,256,256,0.65), transparent 65%), radial-gradient(circle at 50% 80%, rgba(230,230,256,0.75), transparent 70%)",
          }}
          className="border p-0.5 border-chart-2/20 h-12 w-12 shrink-0 rounded-full"
        >
          <LogoIcon />
        </div>{" "}
        <span className="font-semibold tracking-tight text-2xl text-gray-900">
          {" "}
          Dr. Anoop Singh Khod{" "}
        </span>
      </button>

      {/* ---------- Desktop Nav ---------- */}
      <div
        ref={containerRef}
        className="relative hidden lg:flex items-center gap-2 px-2 py-1"
        onMouseLeave={() => snapTo(currentSection)}
      >
        {/* ✨ Glow trail */}
        {bubble && (
          <motion.div
            className="absolute inset-y-0 rounded-full"
            style={{
              filter: "blur(18px)",
              background:
                "linear-gradient(90deg, rgba(56,189,248,0.75), rgba(34,211,238,0.85))",
            }}
            animate={{
              left: bubble.left - 6,
              width: bubble.width + 12,
              opacity: 0.9,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 25,
              mass: 0.6,
            }}
          />
        )}

        {/* 🧲 Main bubble */}
        {bubble && (
          <motion.div
            className="absolute inset-y-0 rounded-full bg-white/30 backdrop-blur-md"
            animate={{
              left: bubble.left,
              width: bubble.width,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30, // ← elastic overshoot
              mass: 0.8,
            }}
          />
        )}

        {navigationItems.map((item) => (
          <button
            key={item.name}
            ref={(el) => {
              itemRefs.current[item.index] = el;
            }}
            onMouseEnter={() => snapTo(item.index)}
            onClick={() => scrollToSection(item.index)}
            className={`relative z-10 px-4 py-2 text-sm transition-colors ${
              currentSection === item.index
                ? "text-black"
                : "text-gray-700 hover:text-black"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* ---------- Mobile ---------- */}
      <MagneticButton
        onClick={() => setOpen((v) => !v)}
        variant="accent"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="
    lg:hidden
    relative
    flex h-11 w-11 items-center justify-center
    rounded-full
    border border-chart-2/40
    bg-white/10
    backdrop-blur-md
    transition
    hover:bg-white/20
    active:scale-95
  "
      >
        {/* Top bar */}
        <span
          className={`absolute h-0.5 w-5 bg-gray-900 transition-transform duration-300 ${
            open ? "translate-y-0 rotate-45" : "-translate-y-2"
          }`}
        />

        {/* Middle bar */}
        <span
          className={`absolute h-0.5 w-5 bg-gray-900 transition-opacity duration-200 ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Bottom bar */}
        <span
          className={`absolute h-0.5 w-5 bg-gray-900 transition-transform duration-300 ${
            open ? "translate-y-0 -rotate-45" : "translate-y-2"
          }`}
        />
      </MagneticButton>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-xl p-6 lg:hidden shadow-lg">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                scrollToSection(item.index);
                setOpen(false);
              }}
              className="block py-2 text-gray-800"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
