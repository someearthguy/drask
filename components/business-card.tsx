"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { LogoIcon } from "./logo-icon";
import { doctorInfo } from "@/lib/content";

export default function BusinessCard() {
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setRotation((r) => r + (isHovered ? 0.4 : 0.9));
      }
    }, 16);

    return () => clearInterval(interval);
  }, [isHovered, isPaused]);

  return (
    <div className="flex flex-col items-center">
      {/* 3D Scene */}
      <div
        className="relative"
        style={{ perspective: "1000px" }}
      >
        <div
          className="
            relative cursor-pointer
            w-[280px] h-[170px]
            sm:w-[340px] sm:h-[200px]
          "
          style={{
            transformStyle: "preserve-3d",
            transform: `
              rotateX(6deg)
              rotateZ(3deg)
              rotateY(${rotation}deg)
            `,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsPaused((v) => !v)}
        >
          {/* ================= FRONT ================= */}
          <div
            className="absolute inset-0 rounded-xl bg-white shadow-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex h-full">
              {/* ---------- IMAGE ---------- */}
              <div className="relative h-full w-[110px] sm:w-[140px]">
                <div className="absolute inset-2 sm:inset-3 rounded-lg overflow-hidden border border-black/10">
                  <Image
                    src={doctorInfo.profilepic}
                    alt={doctorInfo.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* ---------- TEXT ---------- */}
              <div className="flex flex-col justify-center px-3 sm:px-4 flex-1">
                <h2 className="text-sm sm:text-base font-semibold leading-tight text-gray-900">
                  {doctorInfo.name}
                </h2>

                <p className="mt-0.5 text-[11px] sm:text-xs text-gray-600">
                  {doctorInfo.title}
                </p>

                <div className="my-1.5 sm:my-2 h-px w-8 sm:w-10 bg-gray-300" />

                <p className="text-[11px] sm:text-xs leading-relaxed text-gray-700 line-clamp-3">
                  {doctorInfo.tagline}
                </p>
              </div>
            </div>
          </div>

          {/* ================= BACK ================= */}
          <div
            className="absolute inset-0 rounded-xl shadow-2xl flex items-center justify-center bg-chart-1"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div
              className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border border-white/30 p-1"
              style={{
                background: `
                  radial-gradient(circle at 20% 20%, rgba(255,255,255,0.75), transparent 60%),
                  radial-gradient(circle at 80% 30%, rgba(255,255,255,0.65), transparent 65%),
                  radial-gradient(circle at 50% 80%, rgba(230,230,255,0.75), transparent 70%)
                `,
              }}
            >
              <LogoIcon className="h-full w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 sm:mt-6 text-[10px] sm:text-xs font-mono text-white/40 text-center">
        Tap to {isPaused ? "resume" : "pause"} · Hover slows on desktop
      </div>
    </div>
  );
}
