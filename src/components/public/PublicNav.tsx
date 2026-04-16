"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/data/site";

interface Props {
  variant?: "floating" | "solid";
}

const NAV_LINKS = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#galeria", label: "Galería" },
  { href: "/#oficio", label: "Oficio" },
  { href: "/#contacto", label: "Contacto" },
];

export function PublicNav({ variant = "floating" }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (variant !== "floating") return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const solid = variant === "solid" || scrolled;

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
        style={{
          backgroundColor: solid ? "rgba(10, 9, 8, 0.88)" : "transparent",
          backdropFilter: solid ? "blur(14px) saturate(1.1)" : "none",
          borderBottom: solid ? "1px solid rgba(245,241,232,0.08)" : "1px solid transparent",
        }}
      >
        <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-10">
          <Link href="/" className="flex items-center gap-2 group">
            <span
              aria-hidden
              className="block h-2 w-2"
              style={{ backgroundColor: "#b8341c" }}
            />
            <span
              className="text-display text-lg tracking-[-0.02em] group-hover:text-[#b8341c] transition-colors"
              style={{ color: "#f5f1e8" }}
            >
              {siteConfig.name}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] transition-colors"
                style={{ color: "#b8b0a0" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f5f1e8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#b8b0a0")}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/reservar" className="btn-primary">
              Reservar
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 -mr-2"
            style={{ color: "#f5f1e8" }}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* mobile sheet */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: "rgba(10,9,8,0.98)" }}
        >
          <div className="flex h-full flex-col pt-24 px-8 gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-display text-4xl"
                style={{ color: "#f5f1e8" }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/reservar"
              onClick={() => setOpen(false)}
              className="btn-primary mt-6 self-start"
            >
              Reservar cita
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
