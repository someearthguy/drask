"use client"

import { useReveal } from "@/hooks/use-reveal"
import { publications } from "@/lib/content"
import { ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"

export function PublicationsSection() {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex min-h-[calc(100vh-64px)] w-screen shrink-0 snap-start items-center px-4 pt-24 pb-20 md:min-h-[calc(100vh-72px)] md:px-12 md:pt-28 md:pb-0 lg:px-16"
>
      <div className="mx-auto w-full max-w-7xl">
        <div className="overflow-visible">
  <div
    className={`mb-8 transition-all duration-700 md:mb-16 ${
      isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
    }`}
  >

          <h2 className="mb-2 font-sans text-3xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Publications
          </h2>
          <p className="font-mono text-xs text-foreground/60 md:text-base">/ Research contributions</p>
        </div>

        <div className="space-y-4 md:space-y-8">
          {publications.map((publication, i) => (
            <PublicationCard key={i} publication={publication} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div></div>
    </section>
  )
}

function PublicationCard({
  publication,
  index,
  isVisible,
}: {
  publication: { title: string; journal: string; year: string; link: string }
  index: number
  isVisible: boolean
}) {
  const [layoutStyles, setLayoutStyles] = useState<{ marginLeft: string; maxWidth: string }>({
    marginLeft: "auto",
    maxWidth: "100%",
  })

  useEffect(() => {
    const updateLayout = () => {
      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        setLayoutStyles({
          marginLeft: index % 2 === 0 ? "0" : "auto",
          maxWidth: index % 2 === 0 ? "90%" : "95%",
        })
      } else {
        setLayoutStyles({
          marginLeft: "auto",
          maxWidth: "100%",
        })
      }
    }

    updateLayout()

    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateLayout)
      return () => window.removeEventListener("resize", updateLayout)
    }
  }, [index])

  const getRevealClass = () => {
    if (!isVisible) {
      return index % 2 === 0 ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
    }
    return "translate-x-0 opacity-100"
  }

  return (
    <a
      href={publication.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-start justify-between gap-3 border-b border-foreground/10 py-4 transition-all duration-700 hover:border-foreground/20 md:gap-4 md:py-8 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 150}ms`,
        ...layoutStyles,
      }}
    >
      <div className="flex flex-1 items-start gap-3 md:gap-8">
        <span className="font-mono text-xs text-foreground/30 transition-colors group-hover:text-foreground/50 md:text-base">
          {publication.year}
        </span>
        <div className="flex-1">
          <h3 className="mb-1 font-sans text-base font-light leading-tight text-foreground transition-transform duration-300 group-hover:translate-x-2 md:mb-2 md:text-2xl lg:text-3xl">
            {publication.title}
          </h3>
          <p className="font-mono text-xs text-foreground/60 md:text-sm">{publication.journal}</p>
        </div>
      </div>
      <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-foreground/40 transition-all duration-300 group-hover:text-foreground/70 md:h-5 md:w-5" />
    </a>
  )
}
