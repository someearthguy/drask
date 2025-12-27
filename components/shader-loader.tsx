"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ShaderLoaderProps {
  visible: boolean;
}

export function ShaderLoader({ visible }: ShaderLoaderProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* ---------- Synced shader-color glow ---------- */}
          <motion.div
            className="absolute inset-0"
            initial={{ filter: "blur(40px)", opacity: 1 }}
            exit={{ filter: "blur(0px)", opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: `
                radial-gradient(circle at 50% 40%, rgba(2,132,199,0.35), transparent 55%),
                radial-gradient(circle at 60% 65%, rgba(6,182,212,0.35), transparent 60%),
                radial-gradient(circle at 40% 70%, rgba(14,165,233,0.25), transparent 65%)
              `,
            }}
          />

          {/* ---------- Blur veil (progressive reveal) ---------- */}
          <motion.div
            className="absolute inset-0 bg-background"
            initial={{ backdropFilter: "blur(30px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* ---------- Loader core ---------- */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Orb */}
            <motion.div
              className="relative flex h-24 w-24 items-center justify-center rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
            >
              <div
                className="absolute inset-0 rounded-full blur-xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(6,182,212,0.6), transparent 70%)",
                }}
              />
              <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_25px_8px_rgba(6,182,212,0.8)]" />
            </motion.div>

            {/* Text */}
            <div className="text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-foreground/60">
                Initializing
              </p>
              <h2 className="mt-1 font-sans text-lg font-light text-foreground">
                Preparing visual experience
              </h2>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
