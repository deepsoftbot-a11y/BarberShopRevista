import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";
import { siteConfig } from "@/data/site";

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-canvas border-t border-warm-strong">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-20 pb-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <span
                aria-hidden
                className="block h-2 w-2"
                style={{ backgroundColor: "#b8341c" }}
              />
              <span
                className="text-display text-2xl"
                style={{ color: "#f5f1e8" }}
              >
                {siteConfig.name}
              </span>
            </div>
            <p
              className="font-serif-italic text-xl leading-snug max-w-md"
              style={{ color: "#b8b0a0" }}
            >
              Corte, barba y oficio. Un ritual masculino con raíces antiguas y
              manos de hoy.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-eyebrow mb-5">Visita</p>
            <p className="text-sm leading-relaxed" style={{ color: "#b8b0a0" }}>
              {siteConfig.address}
              <br />
              {siteConfig.city}
            </p>
            <p className="mt-4 text-sm font-mono" style={{ color: "#f5f1e8" }}>
              {siteConfig.hours.weekdays}
              <br />
              {siteConfig.hours.time}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-eyebrow mb-5">Contacto</p>
            <p className="text-sm font-mono" style={{ color: "#b8b0a0" }}>
              {siteConfig.phone}
            </p>
            <p className="text-sm mt-1" style={{ color: "#b8b0a0" }}>
              {siteConfig.email}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-eyebrow mb-5">Social</p>
            <div className="flex gap-3">
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center border transition-colors"
                style={{ borderColor: "rgba(245,241,232,0.14)", color: "#b8b0a0" }}
              >
                <Instagram size={16} />
              </a>
              <a
                href={siteConfig.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center border transition-colors"
                style={{ borderColor: "rgba(245,241,232,0.14)", color: "#b8b0a0" }}
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>
        </div>

        <hr className="divider my-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-[0.7rem] font-mono"
            style={{ color: "#6b6358" }}
          >
            © {year} {siteConfig.name} — Todos los derechos reservados
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/reservar"
              className="text-[0.7rem] font-semibold uppercase tracking-[0.22em]"
              style={{ color: "#b8b0a0" }}
            >
              Reservar cita
            </Link>
            <span
              className="text-[0.7rem] font-mono"
              style={{ color: "#6b6358" }}
            >
              MX · ES
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
