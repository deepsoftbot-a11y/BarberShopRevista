import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatTZ } from "@/lib/datetime";

export default async function AdminDashboard() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [upcoming, todayCount, monthCount, totalConfirmed] = await Promise.all([
    prisma.booking.findMany({
      where: { startAt: { gte: now }, status: "CONFIRMED" },
      include: { service: true },
      orderBy: { startAt: "asc" },
      take: 8,
    }),
    prisma.booking.count({
      where: { startAt: { gte: todayStart, lt: todayEnd }, status: "CONFIRMED" },
    }),
    prisma.booking.count({
      where: { createdAt: { gte: monthStart }, status: "CONFIRMED" },
    }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
  ]);

  return (
    <div className="space-y-14">
      {/* header */}
      <div className="grid gap-8 md:grid-cols-12 items-end">
        <div className="md:col-span-8">
          <p className="text-eyebrow mb-4">
            <span className="rule-brick mr-4" /> Panel · Resumen
          </p>
          <h1
            className="text-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.92]"
            style={{ color: "#f5f1e8" }}
          >
            Hoy en la{" "}
            <span className="font-serif-italic italic lowercase tracking-normal">
              silla.
            </span>
          </h1>
        </div>
        <div className="md:col-span-4 md:text-right">
          <p
            className="text-[0.7rem] font-mono uppercase tracking-[0.22em]"
            style={{ color: "#6b6358" }}
          >
            {formatTZ(now, "EEEE d 'de' MMMM yyyy")}
          </p>
        </div>
      </div>

      {/* stats */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 border"
        style={{ borderColor: "rgba(245,241,232,0.14)" }}
      >
        <StatCard label="Hoy" value={todayCount} accent />
        <StatCard label="Este mes" value={monthCount} />
        <StatCard label="Próximas" value={upcoming.length} muted={upcoming.length === 0} />
        <StatCard label="Total confirmadas" value={totalConfirmed} />
      </div>

      {/* upcoming bookings */}
      <div>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p
              className="text-[0.7rem] font-mono uppercase tracking-[0.22em] mb-2"
              style={{ color: "#6b6358" }}
            >
              Agenda
            </p>
            <h2 className="text-display text-3xl" style={{ color: "#f5f1e8" }}>
              Próximas reservas
            </h2>
          </div>
          <Link
            href="/admin/reservas"
            className="group flex items-center gap-2 text-[0.72rem] font-mono uppercase tracking-[0.22em]"
            style={{ color: "#b8341c" }}
          >
            Ver todas
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div
            className="border border-dashed p-12 text-center"
            style={{ borderColor: "rgba(245,241,232,0.14)" }}
          >
            <p
              className="font-serif-italic italic text-2xl mb-2"
              style={{ color: "#b8b0a0" }}
            >
              Agenda limpia.
            </p>
            <p className="text-sm" style={{ color: "#6b6358" }}>
              No hay reservas próximas todavía.
            </p>
          </div>
        ) : (
          <div
            className="border overflow-hidden"
            style={{ borderColor: "rgba(245,241,232,0.14)" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    borderColor: "rgba(245,241,232,0.14)",
                    backgroundColor: "#141210",
                  }}
                >
                  <TH>Código</TH>
                  <TH>Cliente</TH>
                  <TH>Servicio</TH>
                  <TH>Fecha · Hora</TH>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((b) => (
                  <tr
                    key={b.id}
                    className="border-t transition-colors"
                    style={{ borderColor: "rgba(245,241,232,0.08)" }}
                  >
                    <td className="px-5 py-4 font-mono text-xs tracking-[0.1em]" style={{ color: "#b8341c" }}>
                      {b.code}
                    </td>
                    <td className="px-5 py-4" style={{ color: "#f5f1e8" }}>
                      {b.customerName}
                    </td>
                    <td className="px-5 py-4" style={{ color: "#b8b0a0" }}>
                      {b.service.name}
                    </td>
                    <td
                      className="px-5 py-4 font-mono text-xs capitalize"
                      style={{ color: "#b8b0a0" }}
                    >
                      {formatTZ(b.startAt, "EEE d MMM · HH:mm")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  muted,
  accent,
}: {
  label: string;
  value: number;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className="p-6 md:p-8 border-l first:border-l-0"
      style={{
        backgroundColor: accent ? "#b8341c" : "transparent",
        borderColor: "rgba(245,241,232,0.14)",
        color: accent ? "#f5f1e8" : "#f5f1e8",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-[0.68rem] font-mono uppercase tracking-[0.22em]"
          style={{ color: accent ? "rgba(245,241,232,0.75)" : "#6b6358" }}
        >
          {label}
        </p>
        <TrendingUp size={14} strokeWidth={1.5} style={{ color: accent ? "rgba(245,241,232,0.75)" : "#6b6358" }} />
      </div>
      <p
        className="text-display text-[clamp(2.5rem,4vw,3.5rem)] leading-none"
        style={{ color: muted ? "#6b6358" : accent ? "#f5f1e8" : "#f5f1e8" }}
      >
        {value}
      </p>
    </div>
  );
}

function TH({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="px-5 py-3 text-left text-[0.66rem] font-mono uppercase tracking-[0.22em]"
      style={{ color: "#6b6358" }}
    >
      {children}
    </th>
  );
}
