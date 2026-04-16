"use client";

import { UseFormReturn } from "react-hook-form";
import { BookingInput } from "@/lib/validation/booking";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Service {
  id: string;
  name: string;
  durationMin: number;
  priceCents: number;
}

interface Props {
  form: UseFormReturn<BookingInput>;
  onBack: () => void;
  isPending: boolean;
  selectedService?: Service;
  selectedSlot?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
    };
    onTurnstileLoad?: () => void;
  }
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function CustomerForm({ form, onBack, isPending, selectedService, selectedSlot }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { register, formState: { errors }, setValue } = form;

  const isDev = process.env.NODE_ENV !== "production";

  useEffect(() => {
    function render() {
      if (!containerRef.current || !window.turnstile) return;
      window.turnstile.render(containerRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA",
        callback: (token: string) => setValue("turnstileToken", token),
        theme: "dark",
      });
    }

    if (window.turnstile) render();
    else window.onTurnstileLoad = render;
  }, [setValue]);

  const slotDate = selectedSlot ? new Date(selectedSlot) : null;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      {/* form */}
      <div className="lg:col-span-7">
        <div className="mb-10">
          <p className="text-eyebrow mb-4">
            <span className="rule-brick mr-4" /> Casi listo
          </p>
          <h2
            className="text-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95]"
            style={{ color: "#f5f1e8" }}
          >
            Tus{" "}
            <span className="font-serif-italic italic lowercase tracking-normal">
              datos.
            </span>
          </h2>
          {isDev && (
            <p
              className="mt-4 text-[0.7rem] font-mono uppercase tracking-[0.22em] inline-block px-3 py-1"
              style={{ backgroundColor: "rgba(184,52,28,0.15)", color: "#d14425", border: "1px solid rgba(184,52,28,0.35)" }}
            >
              ◆ Modo desarrollo · Turnstile deshabilitado
            </p>
          )}
        </div>

        {!isDev && (
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad"
            async
            defer
          />
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="customerName" className="input-label">
              Nombre <span>*</span>
            </label>
            <input
              id="customerName"
              {...register("customerName")}
              className="input-field"
            />
            {errors.customerName && (
              <p className="text-xs mt-2 font-mono uppercase tracking-wider" style={{ color: "#e04b2f" }}>
                {errors.customerName.message}
              </p>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="customerEmail" className="input-label">
                Email <span>*</span>
              </label>
              <input
                id="customerEmail"
                type="email"
                {...register("customerEmail")}
                className="input-field"
              />
              {errors.customerEmail && (
                <p className="text-xs mt-2 font-mono uppercase tracking-wider" style={{ color: "#e04b2f" }}>
                  {errors.customerEmail.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="customerPhone" className="input-label">
                Teléfono <span style={{ color: "#6b6358" }}>(opcional)</span>
              </label>
              <input
                id="customerPhone"
                type="tel"
                {...register("customerPhone")}
                className="input-field"
              />
            </div>
          </div>

          {!isDev && <div ref={containerRef} className="pt-2" />}
        </div>

        <div className="flex justify-between mt-10 pt-6 border-t" style={{ borderColor: "rgba(245,241,232,0.08)" }}>
          <button type="button" onClick={onBack} disabled={isPending} className="btn-secondary">
            ← Atrás
          </button>
          <button type="submit" disabled={isPending} className="btn-primary">
            {isPending ? "Reservando…" : "Confirmar reserva"}
          </button>
        </div>
      </div>

      {/* summary */}
      <aside className="lg:col-span-5">
        <div
          className="border sticky top-24"
          style={{ borderColor: "rgba(245,241,232,0.14)", backgroundColor: "#0a0908" }}
        >
          <div
            className="p-5 border-b"
            style={{ borderColor: "rgba(245,241,232,0.14)", backgroundColor: "#b8341c" }}
          >
            <p
              className="text-[0.7rem] font-mono uppercase tracking-[0.22em]"
              style={{ color: "rgba(245,241,232,0.75)" }}
            >
              Tu reserva
            </p>
            <p
              className="text-display text-2xl mt-1"
              style={{ color: "#f5f1e8" }}
            >
              Resumen
            </p>
          </div>

          <dl className="p-6 space-y-5">
            <SummaryRow label="Servicio" value={selectedService?.name ?? "—"} />
            <SummaryRow
              label="Duración"
              value={selectedService ? `${selectedService.durationMin} min` : "—"}
            />
            <SummaryRow
              label="Fecha"
              value={slotDate ? format(slotDate, "EEE d MMM", { locale: es }) : "—"}
            />
            <SummaryRow
              label="Hora"
              value={
                slotDate
                  ? format(slotDate, "HH:mm", { locale: es }) + " hrs"
                  : "—"
              }
              mono
            />
            <div className="pt-5 border-t" style={{ borderColor: "rgba(245,241,232,0.14)" }}>
              <div className="flex items-baseline justify-between">
                <span
                  className="text-[0.7rem] font-mono uppercase tracking-[0.22em]"
                  style={{ color: "#6b6358" }}
                >
                  Total
                </span>
                <span className="text-display text-3xl" style={{ color: "#b8341c" }}>
                  {selectedService ? formatPrice(selectedService.priceCents) : "—"}
                </span>
              </div>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}

function SummaryRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt
        className="text-[0.7rem] font-mono uppercase tracking-[0.22em]"
        style={{ color: "#6b6358" }}
      >
        {label}
      </dt>
      <dd
        className={mono ? "font-mono text-sm" : "text-sm"}
        style={{ color: "#f5f1e8" }}
      >
        {value}
      </dd>
    </div>
  );
}
