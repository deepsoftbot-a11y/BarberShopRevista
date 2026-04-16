import Link from "next/link";
import { ArrowUpRight, Scissors, UserRound, Sparkles, Droplet } from "lucide-react";
import { prisma } from "@/lib/db";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function pickIcon(i: number) {
  const icons = [Scissors, UserRound, Sparkles, Droplet];
  const Icon = icons[i % icons.length];
  return <Icon size={20} strokeWidth={1.5} />;
}

export async function ServicesSection() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <section id="servicios" className="surface-canvas border-t border-warm-strong">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-28 md:py-36">
        {/* header grid */}
        <div className="grid gap-10 md:grid-cols-12 mb-16 md:mb-24">
          <div className="md:col-span-5">
            <p className="text-eyebrow mb-6">
              <span className="rule-brick mr-4" /> Capítulo 01 · Servicios
            </p>
            <h2
              className="text-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.9]"
              style={{ color: "#f5f1e8" }}
            >
              El oficio
              <br />
              <span style={{ color: "#b8341c" }}>nunca</span>
              <br />
              <span className="font-serif-italic italic lowercase tracking-normal">
                se improvisa.
              </span>
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 flex items-end">
            <p className="text-base leading-relaxed" style={{ color: "#b8b0a0" }}>
              Cada servicio es una conversación entre la silla, la navaja y la
              persona. Precios claros, tiempos respetados, resultado impecable.
            </p>
          </div>
        </div>

        {/* service list */}
        <div
          className="border-t border-b divide-y"
          style={{ borderColor: "rgba(245,241,232,0.14)" }}
        >
          {services.map((s, i) => (
            <Link
              key={s.id}
              href={`/reservar?service=${s.id}`}
              className="group grid grid-cols-12 gap-4 md:gap-8 items-center py-8 md:py-10 px-2 md:px-4 transition-colors"
              style={{ color: "#f5f1e8" }}
            >
              <div
                className="col-span-2 md:col-span-1 text-display text-2xl md:text-3xl"
                style={{ color: "#6b6358" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="col-span-1 flex items-center justify-center" style={{ color: "#b8341c" }}>
                {pickIcon(i)}
              </div>

              <div className="col-span-9 md:col-span-5">
                <h3
                  className="text-display text-2xl md:text-4xl leading-tight transition-colors group-hover:text-[#b8341c]"
                  style={{ color: "#f5f1e8" }}
                >
                  {s.name}
                </h3>
                {s.description && (
                  <p
                    className="mt-1 text-sm leading-relaxed hidden md:block"
                    style={{ color: "#6b6358" }}
                  >
                    {s.description}
                  </p>
                )}
              </div>

              <div
                className="hidden md:block col-span-2 text-[0.72rem] font-mono uppercase tracking-[0.2em]"
                style={{ color: "#b8b0a0" }}
              >
                {s.durationMin} min
              </div>

              <div className="col-span-12 md:col-span-2 flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0">
                <span
                  className="text-display text-2xl md:text-3xl"
                  style={{ color: "#f5f1e8" }}
                >
                  {formatPrice(s.priceCents)}
                </span>
                <span
                  className="flex h-10 w-10 items-center justify-center border transition-all group-hover:bg-[#b8341c] group-hover:border-[#b8341c] group-hover:text-[#f5f1e8]"
                  style={{
                    borderColor: "rgba(245,241,232,0.22)",
                    color: "#f5f1e8",
                  }}
                >
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </Link>
          ))}
          {services.length === 0 && (
            <p
              className="py-12 text-center text-sm"
              style={{ color: "#6b6358" }}
            >
              Servicios próximamente.
            </p>
          )}
        </div>

        {/* footnote */}
        <p
          className="mt-10 text-[0.72rem] font-mono uppercase tracking-[0.22em] flex items-center gap-3"
          style={{ color: "#6b6358" }}
        >
          <span
            aria-hidden
            className="block h-[1px] w-12"
            style={{ backgroundColor: "#b8341c" }}
          />
          Precios incluyen impuestos · Acepta efectivo y tarjeta
        </p>
      </div>
    </section>
  );
}
