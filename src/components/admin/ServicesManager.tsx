"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import {
  createServiceAction,
  updateServiceAction,
  toggleServiceAction,
} from "@/server/admin/services";

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  priceCents: number;
  active: boolean;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function formatCurrencyInput(cents: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format((cents || 0) / 100);
}

export function ServicesManager({ services }: { services: Service[] }) {
  const [editing, setEditing] = useState<Service | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-8">
      {/* toolbar */}
      <div
        className="flex items-center justify-between border"
        style={{ borderColor: "rgba(245,241,232,0.14)" }}
      >
        <p
          className="px-5 py-3 text-[0.7rem] font-mono uppercase tracking-[0.22em]"
          style={{ color: "#b8b0a0" }}
        >
          <span style={{ color: "#b8341c" }}>
            {String(services.length).padStart(2, "0")}
          </span>{" "}
          servicio{services.length !== 1 ? "s" : ""} en catálogo
        </p>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary flex items-center gap-2"
          style={{ borderRadius: 0, borderLeft: "1px solid #b8341c" }}
        >
          <Plus size={14} />
          Nuevo servicio
        </button>
      </div>

      {showCreate && (
        <ServiceForm
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false);
            toast.success("Servicio creado");
          }}
        />
      )}

      {editing && (
        <ServiceForm
          service={editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            toast.success("Servicio actualizado");
          }}
        />
      )}

      {/* table */}
      {services.length === 0 ? (
        <div
          className="border border-dashed p-12 text-center"
          style={{ borderColor: "rgba(245,241,232,0.14)" }}
        >
          <p
            className="font-serif-italic italic text-2xl mb-2"
            style={{ color: "#b8b0a0" }}
          >
            Sin servicios.
          </p>
          <p className="text-sm" style={{ color: "#6b6358" }}>
            Crea el primero para empezar.
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
                  <TH>Nombre</TH>
                  <TH>Duración</TH>
                  <TH>Precio</TH>
                  <TH>Estado</TH>
                  <TH align="right">Acciones</TH>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t"
                    style={{ borderColor: "rgba(245,241,232,0.08)" }}
                  >
                    <td className="px-5 py-4">
                      <div
                        className="text-display text-lg"
                        style={{ color: "#f5f1e8" }}
                      >
                        {s.name}
                      </div>
                      {s.description && (
                        <p className="text-xs mt-1" style={{ color: "#6b6358" }}>
                          {s.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs" style={{ color: "#b8b0a0" }}>
                      {s.durationMin} min
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-display text-lg" style={{ color: "#b8341c" }}>
                        {formatPrice(s.priceCents)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${s.active ? "badge-active" : "badge-inactive"}`}>
                        {s.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ToggleButton id={s.id} active={s.active} />
                        <button
                          onClick={() => setEditing(s)}
                          className="btn-ghost flex items-center gap-1.5"
                        >
                          <Pencil size={12} />
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleButton({ id, active }: { id: string; active: boolean }) {
  return (
    <form action={async () => { await toggleServiceAction(id, !active); }}>
      <button
        type="submit"
        className="btn-ghost"
        style={{ color: active ? "#b8341c" : "#6b6358" }}
      >
        {active ? "Desactivar" : "Activar"}
      </button>
    </form>
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

function ServiceForm({
  service,
  onClose,
  onSuccess,
}: {
  service?: Service;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(serviceSchema()),
    defaultValues: service
      ? {
          name: service.name,
          description: service.description ?? "",
          durationMin: service.durationMin,
          priceCents: service.priceCents,
        }
      : {
          name: "",
          description: "",
          durationMin: undefined,
          priceCents: undefined,
        },
  });

  const [pending, startTransition] = useTransition();

  function onSubmit(data: Record<string, unknown>) {
    startTransition(async () => {
      const action = service
        ? updateServiceAction(service.id, data)
        : createServiceAction(data);
      const result = await action;
      if (result.ok) onSuccess();
      else toast.error(result.error ?? "Error");
    });
  }

  return (
    <div
      className="border"
      style={{ borderColor: "rgba(245,241,232,0.14)", backgroundColor: "#0a0908" }}
    >
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: "rgba(245,241,232,0.14)", backgroundColor: "#141210" }}
      >
        <p
          className="text-[0.7rem] font-mono uppercase tracking-[0.22em]"
          style={{ color: "#b8341c" }}
        >
          {service ? "Editar servicio" : "Nuevo servicio"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="input-label">Nombre</label>
            <input {...register("name")} className="input-field" />
            {errors.name && (
              <p className="text-xs mt-1 font-mono uppercase tracking-wider" style={{ color: "#e04b2f" }}>
                {String(errors.name.message)}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className="input-label">Descripción (opcional)</label>
            <textarea
              {...register("description")}
              rows={3}
              className="input-field"
              style={{ display: "block", minHeight: "5.5rem", resize: "vertical", lineHeight: 1.5 }}
            />
          </div>
          <div>
            <label className="input-label">Duración (minutos)</label>
            <input
              {...register("durationMin")}
              type="number"
              min="15"
              className="input-field"
            />
            {errors.durationMin && (
              <p className="text-xs mt-1 font-mono uppercase tracking-wider" style={{ color: "#e04b2f" }}>
                {String(errors.durationMin.message)}
              </p>
            )}
          </div>
          <div>
            <label className="input-label">Precio</label>
            <Controller
              control={control}
              name="priceCents"
              render={({ field }) => (
                <input
                  inputMode="numeric"
                  value={field.value ? formatCurrencyInput(Number(field.value)) : ""}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    field.onChange(digits === "" ? undefined : parseInt(digits, 10));
                  }}
                  onBlur={field.onBlur}
                  className="input-field"
                />
              )}
            />
            {errors.priceCents && (
              <p className="text-xs mt-1 font-mono uppercase tracking-wider" style={{ color: "#e04b2f" }}>
                {String(errors.priceCents.message)}
              </p>
            )}
          </div>
        </div>

        <div
          className="flex justify-end gap-3 pt-4 border-t"
          style={{ borderColor: "rgba(245,241,232,0.08)" }}
        >
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={pending} className="btn-primary">
            {pending ? "Guardando…" : service ? "Guardar cambios" : "Crear servicio"}
          </button>
        </div>
      </form>
    </div>
  );
}

function serviceSchema() {
  return z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    durationMin: z.coerce.number().int().min(15).max(240),
    priceCents: z.coerce.number().int().min(0),
    active: z.boolean().optional(),
    sortOrder: z.coerce.number().int().optional(),
  });
}
