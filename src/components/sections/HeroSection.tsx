import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/data/site";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1800&q=85";

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden surface-canvas">
      {/* top meta bar */}
      <div
        className="absolute left-0 right-0 top-16 z-20 hidden md:flex items-center justify-between px-10 pt-4 text-[0.68rem] font-mono uppercase tracking-[0.24em]"
        style={{ color: "#6b6358" }}
      >
        <span>Est. 2014 · {siteConfig.city}</span>
        <span className="flex items-center gap-3">
          <span
            aria-hidden
            className="block h-[1px] w-8"
            style={{ backgroundColor: "#b8341c" }}
          />
          Vol. 01 — Edición 2026
        </span>
      </div>

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1400px] grid-cols-1 lg:grid-cols-12 gap-8 px-6 md:px-10 pt-28 pb-16">
        {/* LEFT — copy */}
        <div className="lg:col-span-7 flex flex-col justify-end z-10">
          <p className="text-eyebrow mb-8">
            <span className="rule-brick mr-4" /> Barbería editorial · Núm. 01
          </p>

          <h1
            className="text-display text-[clamp(3.5rem,13vw,11rem)] leading-[0.85] tracking-[-0.03em]"
            style={{ color: "#f5f1e8" }}
          >
            Corte,
            <br />
            <span style={{ color: "#b8341c" }}>barba</span>
            <br />
            <span className="font-serif-italic italic lowercase tracking-normal" style={{ color: "#f5f1e8" }}>
              &amp; oficio.
            </span>
          </h1>

          <p
            className="mt-10 max-w-xl text-lg leading-relaxed"
            style={{ color: "#b8b0a0" }}
          >
            {siteConfig.description}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/reservar" className="btn-primary group">
              Reservar cita
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link href="#servicios" className="btn-secondary">
              Ver servicios
            </Link>
          </div>

          {/* bottom stats */}
          <div
            className="mt-16 grid grid-cols-3 max-w-lg divide-x"
            style={{ borderColor: "rgba(245,241,232,0.1)" }}
          >
            <Stat k="10+" v="años de oficio" />
            <Stat k="5.0" v="rating Google" />
            <Stat k="3k+" v="cortes al año" />
          </div>
        </div>

        {/* RIGHT — image */}
        <div className="lg:col-span-5 relative min-h-[420px] lg:min-h-[75vh]">
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={HERO_IMAGE}
              alt="Cliente en la silla de barbería, retrato editorial en blanco y negro"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              style={{ filter: "grayscale(0.25) contrast(1.05)" }}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10,9,8,0.15) 0%, rgba(10,9,8,0.55) 100%)",
              }}
            />
            {/* image label */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <span
                className="text-[0.65rem] font-mono uppercase tracking-[0.22em] px-2 py-1"
                style={{ backgroundColor: "#b8341c", color: "#f5f1e8" }}
              >
                Figura 01
              </span>
              <span
                className="text-[0.65rem] font-mono uppercase tracking-[0.22em]"
                style={{ color: "#f5f1e8" }}
              >
                El ritual
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* bottom ticker */}
      <div
        className="absolute bottom-0 left-0 right-0 ticker-line overflow-hidden"
        style={{ backgroundColor: "rgba(10,9,8,0.6)" }}
      >
        <div className="marquee-track py-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="mx-8 text-[0.72rem] font-mono uppercase tracking-[0.24em] flex items-center gap-8"
              style={{ color: "#b8b0a0" }}
            >
              Corte clásico <span style={{ color: "#b8341c" }}>●</span>
              Perfilado de barba <span style={{ color: "#b8341c" }}>●</span>
              Afeitado con navaja <span style={{ color: "#b8341c" }}>●</span>
              Diseño personalizado <span style={{ color: "#b8341c" }}>●</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="px-4 first:pl-0">
      <p className="text-display text-3xl" style={{ color: "#f5f1e8" }}>
        {k}
      </p>
      <p
        className="mt-1 text-[0.7rem] font-mono uppercase tracking-[0.2em]"
        style={{ color: "#6b6358" }}
      >
        {v}
      </p>
    </div>
  );
}
