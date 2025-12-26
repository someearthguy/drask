"use client"

import type React from "react"
import { useRef } from "react"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  variant?:
  | "primary"
  | "secondary"
  | "ghost"
  | "accent"
  | "outline"
  | "glass"
  | "destructive"
  | "icon"
  | "disabled"
  size?: "default" | "lg"
  onClick?: () => void
}

export function MagneticButton({
  children,
  className = "",
  variant = "primary",
  size = "default",
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>()

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    positionRef.current = { x: x * 0.15, y: y * 0.15 }

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`
      }
    })
  }

  const handleMouseLeave = () => {
    positionRef.current = { x: 0, y: 0 }
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.style.transform = "translate3d(0px, 0px, 0)"
      }
    })
  }

  const variants = {
    primary:
      "bg-foreground text-background hover:bg-foreground/90 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:gap-2",
    secondary:
      "bg-foreground/5 text-foreground hover:bg-foreground/10 backdrop-blur-xl border border-foreground/10 hover:border-foreground/20 [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:gap-2",
    ghost:
      "bg-transparent text-foreground hover:bg-foreground/5 backdrop-blur-sm [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:gap-2",
    /** High-emphasis medical CTA (Book / Emergency) */
    accent:
      "bg-chart-1 text-white hover:bg-chart-2 shadow-md shadow-chart-2/30 hover:shadow-lg hover:shadow-chart-1/40 hover:scale-[1.03] active:scale-[0.97] [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:gap-2",

    /** Subtle bordered button (Contact / Learn more) */
    outline:
      "bg-transparent text-foreground border border-foreground/20 hover:bg-foreground/5 hover:border-foreground/30 backdrop-blur-md [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:gap-2",

    /** Glass / frosted look (Hero, Header CTAs) */
    glass:
      "bg-white/30 text-foreground backdrop-blur-xl backdrop-saturate-150 border border-white/30 hover:bg-white/40 hover:scale-[1.02] active:scale-[0.98] shadow-sm [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:gap-2",

    /** Destructive / warning actions */
    destructive:
      "bg-red-600 text-white hover:bg-red-500 shadow-sm hover:scale-[1.02] active:scale-[0.97] [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:gap-2",

    /** Icon-only buttons (toolbar / header icons) */
    icon:
      "bg-foreground/5 text-foreground hover:bg-foreground/10 rounded-full p-2 backdrop-blur-md active:scale-[0.95] [&>span]:flex [&>span]:items-center [&>span]:justify-center",

    /** Disabled / loading state */
    disabled:
      "bg-foreground/10 text-foreground/40 cursor-not-allowed pointer-events-none [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:gap-2",

  }

  const sizes = {
    default: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  }

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative overflow-hidden rounded-full font-medium
        transition-all duration-300 ease-out will-change-transform
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      style={{
        transform: "translate3d(0px, 0px, 0)",
        contain: "layout style paint",
      }}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}
