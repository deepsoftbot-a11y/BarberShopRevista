import { MapPin, Phone, Clock, MessageCircle, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site";

export function ContactSection() {
  return (
    <section id="contacto" className="surface-canvas border-t border-warm-strong">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-28 md:py-36">
        <div className="grid gap-10 md:grid-cols-12 mb-16">
          <div className="md:col-span-6">
            <p className="text-eyebrow mb-6">
              <span className="rule-brick mr-4" /> Capítulo 05 · Visita
            </p>
            <h2
              className="text-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.9]"
              style={{ color: "#f5f1e8" }}
            >
              Pasa a
              <br />
              <span className="font-serif-italic italic lowercase tracking-normal">
                saludar.
              </span>
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 flex items-end">
            <p className="text-base leading-relaxed" style={{ color: "#b8b0a0" }}>
              Reservar es mejor, pero si vienes caminando también te atendemos.
              Café por cuenta de la casa mientras esperas.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* info column */}
          <div
            className="md:col-span-5 border divide-y"
            style={{ borderColor: "rgba(245,241,232,0.14)" }}
          >
            <InfoRow
              icon={<MapPin size={18} strokeWidth={1.5} />}
              label="Dirección"
              primary={siteConfig.address}
              secondary={siteConfig.city}
            />
            <InfoRow
              icon={<Phone size={18} strokeWidth={1.5} />}
              label="Teléfono"
              primary={siteConfig.phone}
              secondary="Atendemos en horario de tienda"
            />
            <InfoRow
              icon={<Clock size={18} strokeWidth={1.5} />}
              label="Horario"
              primary={`${siteConfig.hours.weekdays} · ${siteConfig.hours.time}`}
              secondary={siteConfig.hours.sunday}
            />

            {siteConfig.whatsapp && (
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-6 p-6 transition-colors"
                style={{ backgroundColor: "#b8341c", color: "#f5f1e8" }}
              >
                <span className="flex items-center gap-4">
                  <MessageCircle size={20} strokeWidth={1.5} />
                  <span className="flex flex-col">
                    <span
                      className="text-[0.7rem] font-mono uppercase tracking-[0.22em]"
                      style={{ color: "rgba(245,241,232,0.75)" }}
                    >
                      Escribe directo
                    </span>
                    <span className="text-display text-xl mt-1">
                      WhatsApp
                    </span>
                  </span>
                </span>
                <ArrowUpRight
                  size={20}
                  className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </a>
            )}
          </div>

          {/* map/visual column */}
          <div
            className="md:col-span-7 relative min-h-[420px] border overflow-hidden"
            style={{ borderColor: "rgba(245,241,232,0.14)" }}
          >
            <iframe
              src={siteConfig.mapEmbedUrl}
              className="absolute inset-0 h-full w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de la barbería"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5" style={{ backgroundColor: "#0a0908", border: "1px solid rgba(245,241,232,0.14)" }}>
              <span aria-hidden className="block h-2 w-2" style={{ backgroundColor: "#b8341c" }} />
              <span className="text-[0.7rem] font-mono uppercase tracking-[0.22em]" style={{ color: "#f5f1e8" }}>
                {siteConfig.city}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  primary,
  secondary,
}: {
  icon: React.ReactNode;
  label: string;
  primary: string;
  secondary?: string;
}) {
  return (
    <div
      className="flex items-start gap-5 p-6"
      style={{ borderColor: "rgba(245,241,232,0.14)" }}
    >
      <span style={{ color: "#b8341c" }}>{icon}</span>
      <div className="flex-1">
        <p
          className="text-[0.7rem] font-mono uppercase tracking-[0.22em] mb-2"
          style={{ color: "#6b6358" }}
        >
          {label}
        </p>
        <p className="text-lg" style={{ color: "#f5f1e8" }}>
          {primary}
        </p>
        {secondary && (
          <p className="text-sm mt-1" style={{ color: "#b8b0a0" }}>
            {secondary}
          </p>
        )}
      </div>
    </div>
  );
}
