"use client";

import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { cancelBookingAction } from "@/server/admin/bookings";
import { formatTZ } from "@/lib/datetime";

interface Booking {
  id: string;
  code: string;
  startAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  status: string;
  service: { name: string };
}

export function BookingsManager({ bookings }: { bookings: Booking[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = bookings.filter((b) => {
    const matchSearch =
      !search ||
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function handleCancel(id: string) {
    startTransition(async () => {
      await cancelBookingAction(id);
      toast.success("Reserva cancelada");
    });
  }

  return (
    <div className="space-y-8">
      {/* filters */}
      <div
        className="flex flex-wrap items-center gap-0 border"
        style={{ borderColor: "rgba(245,241,232,0.14)" }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-[260px] px-4 py-3 border-r" style={{ borderColor: "rgba(245,241,232,0.14)" }}>
          <Search size={16} style={{ color: "#6b6358" }} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm flex-1"
            style={{ color: "#f5f1e8" }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 text-sm bg-transparent outline-none font-mono uppercase tracking-[0.14em] text-xs border-r"
          style={{ color: "#f5f1e8", borderColor: "rgba(245,241,232,0.14)" }}
        >
          <option value="">Todos los estados</option>
          <option value="CONFIRMED">Confirmadas</option>
          <option value="CANCELLED">Canceladas</option>
        </select>

        <span
          className="px-5 py-3 text-[0.7rem] font-mono uppercase tracking-[0.22em]"
          style={{ color: "#b8341c" }}
        >
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* table */}
      {filtered.length === 0 ? (
        <div
          className="border border-dashed p-12 text-center"
          style={{ borderColor: "rgba(245,241,232,0.14)" }}
        >
          <p
            className="font-serif-italic italic text-2xl mb-2"
            style={{ color: "#b8b0a0" }}
          >
            Sin resultados.
          </p>
          <p className="text-sm" style={{ color: "#6b6358" }}>
            Ajusta los filtros o la búsqueda.
          </p>
        </div>
      ) : (
        <div
          className="border overflow-hidden"
          style={{ borderColor: "rgba(245,241,232,0.14)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#141210" }}>
                  <TH>Código</TH>
                  <TH>Cliente</TH>
                  <TH>Servicio</TH>
                  <TH>Fecha · Hora</TH>
                  <TH>Estado</TH>
                  <TH align="right">Acción</TH>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const isCancelled = b.status === "CANCELLED";
                  return (
                    <tr
                      key={b.id}
                      className="border-t"
                      style={{ borderColor: "rgba(245,241,232,0.08)" }}
                    >
                      <td className="px-5 py-4 font-mono text-xs tracking-[0.1em]" style={{ color: "#b8341c" }}>
                        {b.code}
                      </td>
                      <td className="px-5 py-4">
                        <div style={{ color: "#f5f1e8" }}>{b.customerName}</div>
                        <div className="text-xs mt-0.5" style={{ color: "#6b6358" }}>
                          {b.customerEmail}
                        </div>
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
                      <td className="px-5 py-4">
                        <span className={`badge ${isCancelled ? "badge-cancelled" : "badge-confirmed"}`}>
                          {isCancelled ? "Cancelada" : "Confirmada"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {!isCancelled && (
                          <button
                            onClick={() => handleCancel(b.id)}
                            disabled={isPending}
                            className="btn-destructive"
                          >
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function TH({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      className="px-5 py-3 text-[0.66rem] font-mono uppercase tracking-[0.22em]"
      style={{ color: "#6b6358", textAlign: align }}
    >
      {children}
    </th>
  );
}
