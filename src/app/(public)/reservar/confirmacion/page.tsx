import { prisma } from "@/lib/db";
import { formatTZ } from "@/lib/datetime";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, Copy, Phone } from "lucide-react";
import { PublicNav } from "@/components/public/PublicNav";
import { PublicFooter } from "@/components/public/PublicFooter";
import { siteConfig } from "@/data/site";

interface Props {
  searchParams: Promise<{ code?: string }>;
}

export default async function ConfirmacionPage({ searchParams }: Props) {
  const { code } = await searchParams;

  if (!code) notFound();

  const booking = await prisma.booking.findUnique({
    where: { code },
    include: { service: true },
  });

  if (!booking) notFound();

  const fechaStr = formatTZ(booking.startAt, "EEEE d 'de' MMMM yyyy");
  const horaStr = formatTZ(booking.startAt, "HH:mm");

  return (
    <>
      <PublicNav variant="solid" />
      <main className="surface-canvas min-h-screen pt-16">
        <section className="border-b border-warm-strong">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24">
            <div className="grid gap-8 md:grid-cols-12 items-end">
              <div className="md:col-span-8">
                <p className="text-eyebrow mb-6 flex items-center gap-3">
                  <span
                    className="flex h-6 w-6 items-center justify-center"
                    style={{ backgroundColor: "#b8341c", color: "#f5f1e8" }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                  Confirmada · Código {booking.code}
                </p>
                <h1
                  className="text-display text-[clamp(3rem,9vw,8rem)] leading-[0.88]"
                  style={{ color: "#f5f1e8" }}
                >
                  Te{" "}
                  <span className="font-serif-italic italic lowercase tracking-normal">
                    esperamos,
                  </span>
                  <br />
                  <span style={{ color: "#b8341c" }}>
                    {booking.customerName.split(" ")[0]}.
                  </span>
                </h1>
              </div>
              <div className="md:col-span-4 md:text-right">
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#b8b0a0" }}
                >
                  Enviamos los detalles a{" "}
                  <span style={{ color: "#f5f1e8" }}>
                    {booking.customerEmail}
                  </span>
                  . Guarda el código de reserva por si necesitas cancelar o
                  reprogramar.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="surface-1 border-b border-warm-strong">
          <div className="mx-auto max-w-4xl px-6 md:px-10 py-16 md:py-24">
            <div
              className="border"
              style={{ borderColor: "rgba(245,241,232,0.14)" }}
            >
              {/* code banner */}
              <div
                className="p-8 flex items-center justify-between gap-6"
                style={{ backgroundColor: "#0a0908", borderBottom: "1px solid rgba(245,241,232,0.14)" }}
              >
                <div>
                  <p
                    className="text-[0.7rem] font-mono uppercase tracking-[0.22em] mb-3"
                    style={{ color: "#6b6358" }}
                  >
                    Código de reserva
                  </p>
                  <p
                    className="text-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-[0.08em]"
                    style={{ color: "#b8341c" }}
                  >
                    {booking.code}
                  </p>
                </div>
                <Copy
                  size={20}
                  strokeWidth={1.5}
                  style={{ color: "#6b6358" }}
                  aria-label="Copiar código"
                />
              </div>

              {/* details grid */}
              <dl className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: "rgba(245,241,232,0.14)" }}>
                <DetailCell
                  label="Servicio"
                  value={booking.service.name}
                />
                <DetailCell
                  label="Duración"
                  value={`${booking.service.durationMin} min`}
                  mono
                />
                <DetailCell
                  label="Fecha"
                  value={fechaStr.charAt(0).toUpperCase() + fechaStr.slice(1)}
                />
                <DetailCell
                  label="Hora"
                  value={`${horaStr} hrs`}
                  mono
                />
                <DetailCell
                  label="Cliente"
                  value={booking.customerName}
                />
                <DetailCell
                  label="Contacto"
                  value={booking.customerEmail}
                />
              </dl>
            </div>

            {/* footer row */}
            <div className="grid gap-6 md:grid-cols-2 mt-8">
              <div
                className="flex items-start gap-4 border p-5"
                style={{ borderColor: "rgba(245,241,232,0.14)" }}
              >
                <Phone size={18} strokeWidth={1.5} style={{ color: "#b8341c" }} />
                <div>
                  <p
                    className="text-[0.7rem] font-mono uppercase tracking-[0.22em] mb-1"
                    style={{ color: "#6b6358" }}
                  >
                    Cancelar o reprogramar
                  </p>
                  <p className="text-sm" style={{ color: "#f5f1e8" }}>
                    {siteConfig.phone}
                  </p>
                </div>
              </div>

              <Link
                href="/"
                className="flex items-center justify-between gap-4 p-5 transition-colors group"
                style={{ backgroundColor: "#b8341c", color: "#f5f1e8" }}
              >
                <span>
                  <p
                    className="text-[0.7rem] font-mono uppercase tracking-[0.22em] mb-1"
                    style={{ color: "rgba(245,241,232,0.75)" }}
                  >
                    Siguiente
                  </p>
                  <p className="text-display text-xl">
                    Volver al inicio
                  </p>
                </span>
                <span
                  aria-hidden
                  className="text-2xl transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}

function DetailCell({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="p-6" style={{ borderColor: "rgba(245,241,232,0.14)" }}>
      <dt
        className="text-[0.7rem] font-mono uppercase tracking-[0.22em] mb-3"
        style={{ color: "#6b6358" }}
      >
        {label}
      </dt>
      <dd
        className={mono ? "font-mono text-base" : "text-base capitalize"}
        style={{ color: "#f5f1e8" }}
      >
        {value}
      </dd>
    </div>
  );
}
