"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  updateWeeklyScheduleAction,
  createExceptionAction,
  deleteExceptionAction,
} from "@/server/admin/schedule";

const DAYS = [
  { label: "Domingo", short: "Dom", value: 0 },
  { label: "Lunes", short: "Lun", value: 1 },
  { label: "Martes", short: "Mar", value: 2 },
  { label: "Miércoles", short: "Mié", value: 3 },
  { label: "Jueves", short: "Jue", value: 4 },
  { label: "Viernes", short: "Vie", value: 5 },
  { label: "Sábado", short: "Sáb", value: 6 },
];

interface Schedule {
  weekday: number;
  startMin: number;
  endMin: number;
  isClosed: boolean;
}

interface Exception {
  id: string;
  date: Date;
  startMin: number | null;
  endMin: number | null;
  reason: string | null;
}

function minutesToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function ScheduleManager({
  schedules,
  exceptions,
}: {
  schedules: Schedule[];
  exceptions: Exception[];
}) {
  const [isPending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);

  const scheduleMap = Object.fromEntries(schedules.map((s) => [s.weekday, s]));

  return (
    <div className="space-y-14">
      {/* Weekly schedule */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p
              className="text-[0.7rem] font-mono uppercase tracking-[0.22em] mb-2"
              style={{ color: "#6b6358" }}
            >
              Capítulo 01
            </p>
            <h2 className="text-display text-3xl" style={{ color: "#f5f1e8" }}>
              Horario semanal
            </h2>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const data = DAYS.map((d) => ({
              weekday: d.value,
              startMin: parseInt((fd.get(`start_${d.value}`) as string) || "540"),
              endMin: parseInt((fd.get(`end_${d.value}`) as string) || "1140"),
              isClosed: fd.get(`closed_${d.value}`) === "on",
            }));
            startTransition(async () => {
              const result = await updateWeeklyScheduleAction({ schedules: data });
              if (result.ok) toast.success("Horario guardado");
              else toast.error(result.error ?? "Error");
            });
          }}
        >
          <div
            className="border overflow-hidden"
            style={{ borderColor: "rgba(245,241,232,0.14)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#141210" }}>
                    <TH>Día</TH>
                    <TH>Cerrado</TH>
                    <TH>Inicio (min)</TH>
                    <TH>Fin (min)</TH>
                    <TH>Rango</TH>
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map((d) => {
                    const s = scheduleMap[d.value] ?? { startMin: 540, endMin: 1140, isClosed: d.value === 0 };
                    return (
                      <tr
                        key={d.value}
                        className="border-t"
                        style={{ borderColor: "rgba(245,241,232,0.08)" }}
                      >
                        <td className="px-5 py-4">
                          <span
                            className="text-display text-lg"
                            style={{ color: "#f5f1e8" }}
                          >
                            {d.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <input
                            type="checkbox"
                            name={`closed_${d.value}`}
                            defaultChecked={s.isClosed}
                            className="h-4 w-4"
                            style={{ accentColor: "#b8341c" }}
                          />
                        </td>
                        <td className="px-5 py-4">
                          <input
                            type="number"
                            name={`start_${d.value}`}
                            defaultValue={s.startMin}
                            min="0"
                            max="1439"
                            className="input-field w-24 py-2 text-xs"
                          />
                        </td>
                        <td className="px-5 py-4">
                          <input
                            type="number"
                            name={`end_${d.value}`}
                            defaultValue={s.endMin}
                            min="0"
                            max="1440"
                            className="input-field w-24 py-2 text-xs"
                          />
                        </td>
                        <td
                          className="px-5 py-4 font-mono text-xs"
                          style={{ color: s.isClosed ? "#6b6358" : "#b8341c" }}
                        >
                          {s.isClosed
                            ? "Cerrado"
                            : `${minutesToTime(s.startMin)} – ${minutesToTime(s.endMin)}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button type="submit" disabled={isPending} className="btn-primary">
              {isPending ? "Guardando…" : "Guardar horario"}
            </button>
          </div>
        </form>
      </section>

      {/* Exceptions */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p
              className="text-[0.7rem] font-mono uppercase tracking-[0.22em] mb-2"
              style={{ color: "#6b6358" }}
            >
              Capítulo 02
            </p>
            <h2 className="text-display text-3xl" style={{ color: "#f5f1e8" }}>
              Excepciones <span style={{ color: "#b8341c" }}>· {exceptions.length}</span>
            </h2>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className={showAdd ? "btn-secondary" : "btn-primary"}
          >
            {showAdd ? (
              "Cancelar"
            ) : (
              <span className="flex items-center gap-2">
                <Plus size={14} />
                Agregar
              </span>
            )}
          </button>
        </div>

        {showAdd && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              startTransition(async () => {
                const result = await createExceptionAction({
                  date: fd.get("date"),
                  startMin: fd.get("startMin") ? parseInt(fd.get("startMin") as string) : null,
                  endMin: fd.get("endMin") ? parseInt(fd.get("endMin") as string) : null,
                  reason: fd.get("reason") || null,
                });
                if (result.ok) {
                  setShowAdd(false);
                  toast.success("Excepción creada");
                } else {
                  toast.error(result.error ?? "Error");
                }
              });
            }}
            className="border mb-6"
            style={{ borderColor: "rgba(245,241,232,0.14)", backgroundColor: "#0a0908" }}
          >
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: "rgba(245,241,232,0.14)", backgroundColor: "#141210" }}
            >
              <p
                className="text-[0.7rem] font-mono uppercase tracking-[0.22em]"
                style={{ color: "#b8341c" }}
              >
                Nueva excepción
              </p>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="input-label">Fecha</label>
                  <input name="date" type="date" required className="input-field" />
                </div>
                <div>
                  <label className="input-label">Motivo (opcional)</label>
                  <input
                    name="reason"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Inicio (min · vacío = cerrado)</label>
                  <input
                    name="startMin"
                    type="number"
                    min="0"
                    max="1439"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Fin (min)</label>
                  <input
                    name="endMin"
                    type="number"
                    min="0"
                    max="1440"
                    className="input-field"
                  />
                </div>
              </div>
              <p
                className="text-[0.7rem] font-mono uppercase tracking-[0.18em]"
                style={{ color: "#6b6358" }}
              >
                Si dejas inicio/fin vacíos, el día queda completamente cerrado.
              </p>
              <div
                className="pt-4 border-t flex justify-end"
                style={{ borderColor: "rgba(245,241,232,0.08)" }}
              >
                <button type="submit" disabled={isPending} className="btn-primary">
                  {isPending ? "Guardando…" : "Agregar excepción"}
                </button>
              </div>
            </div>
          </form>
        )}

        {exceptions.length === 0 ? (
          <div
            className="border border-dashed p-12 text-center"
            style={{ borderColor: "rgba(245,241,232,0.14)" }}
          >
            <p
              className="font-serif-italic italic text-2xl mb-2"
              style={{ color: "#b8b0a0" }}
            >
              Sin excepciones.
            </p>
            <p className="text-sm" style={{ color: "#6b6358" }}>
              Tu agenda sigue el horario semanal.
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
                    <TH>Fecha</TH>
                    <TH>Tipo</TH>
                    <TH>Motivo</TH>
                    <TH align="right">Acción</TH>
                  </tr>
                </thead>
                <tbody>
                  {exceptions.map((e) => {
                    const isClosed = e.startMin === null;
                    return (
                      <tr
                        key={e.id}
                        className="border-t"
                        style={{ borderColor: "rgba(245,241,232,0.08)" }}
                      >
                        <td
                          className="px-5 py-4 font-mono text-xs"
                          style={{ color: "#f5f1e8" }}
                        >
                          {e.date.toLocaleDateString("es-MX", { timeZone: "UTC" })}
                        </td>
                        <td className="px-5 py-4">
                          {isClosed ? (
                            <span className="badge badge-cancelled">Día cerrado</span>
                          ) : (
                            <span
                              className="font-mono text-xs"
                              style={{ color: "#b8341c" }}
                            >
                              {minutesToTime(e.startMin!)} – {minutesToTime(e.endMin!)}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4" style={{ color: "#b8b0a0" }}>
                          {e.reason ?? "—"}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <form
                            onSubmit={(ev) => {
                              ev.preventDefault();
                              startTransition(async () => {
                                await deleteExceptionAction(e.id);
                                toast.success("Excepción eliminada");
                              });
                            }}
                          >
                            <button type="submit" className="btn-destructive flex items-center gap-1.5">
                              <Trash2 size={12} />
                              Eliminar
                            </button>
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
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
