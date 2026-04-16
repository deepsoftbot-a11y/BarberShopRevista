"use client";

import { useEffect, useState, useTransition } from "react";
import { Calendar } from "@/components/ui/calendar";
import { getAvailableSlotsAction } from "@/server/public/booking";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  serviceId: string;
  selectedDate: string;
  selectedSlot: string;
  onDateChange: (date: string) => void;
  onSlotChange: (slot: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function DateSlotPicker({
  serviceId,
  selectedDate,
  selectedSlot,
  onDateChange,
  onSlotChange,
  onBack,
  onNext,
}: Props) {
  const [slots, setSlots] = useState<string[]>([]);
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    if (!selectedDate) return;
    startTransition(async () => {
      const result = await getAvailableSlotsAction(selectedDate, serviceId);
      setSlots(result);
    });
  }, [selectedDate, serviceId]);

  function handleDateSelect(date: Date | undefined) {
    if (!date) return;
    onDateChange(format(date, "yyyy-MM-dd"));
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div>
      <div className="mb-10">
        <p className="text-eyebrow mb-4">
          <span className="rule-brick mr-4" /> Agenda
        </p>
        <h2
          className="text-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95]"
          style={{ color: "#f5f1e8" }}
        >
          Fecha y{" "}
          <span className="font-serif-italic italic lowercase tracking-normal">
            horario.
          </span>
        </h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* calendar */}
        <div
          className="lg:col-span-3 border p-5"
          style={{ borderColor: "rgba(245,241,232,0.14)", backgroundColor: "#0a0908" }}
        >
          <p
            className="text-[0.7rem] font-mono uppercase tracking-[0.22em] mb-5"
            style={{ color: "#6b6358" }}
          >
            01 · Selecciona un día
          </p>
          <Calendar
            mode="single"
            selected={selectedDate ? new Date(selectedDate + "T12:00:00") : undefined}
            onSelect={handleDateSelect}
            disabled={(date) => date < today}
            locale={es}
            className="[&&]:text-foreground"
          />
        </div>

        {/* slots */}
        <div className="lg:col-span-2">
          <p
            className="text-[0.7rem] font-mono uppercase tracking-[0.22em] mb-5"
            style={{ color: "#6b6358" }}
          >
            02 · {selectedDate
              ? format(new Date(selectedDate + "T12:00:00"), "EEEE d 'de' MMMM", { locale: es })
              : "Primero selecciona un día"}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse"
                  style={{ backgroundColor: "#141210" }}
                />
              ))}
            </div>
          ) : selectedDate && slots.length === 0 ? (
            <div
              className="border p-6"
              style={{ borderColor: "rgba(245,241,232,0.14)", backgroundColor: "#141210" }}
            >
              <p
                className="font-serif-italic italic text-lg"
                style={{ color: "#b8b0a0" }}
              >
                Sin horarios disponibles este día.
              </p>
              <p className="text-sm mt-2" style={{ color: "#6b6358" }}>
                Prueba otra fecha.
              </p>
            </div>
          ) : !selectedDate ? (
            <div
              className="border border-dashed p-8 text-center"
              style={{ borderColor: "rgba(245,241,232,0.14)" }}
            >
              <p
                className="font-serif-italic italic text-lg"
                style={{ color: "#6b6358" }}
              >
                Los horarios aparecerán aquí.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => {
                const time = new Date(slot).toLocaleTimeString("es-MX", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: process.env.NEXT_PUBLIC_TIMEZONE ?? "America/Mexico_City",
                });
                const selected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onSlotChange(slot)}
                    className="py-3 text-sm font-mono uppercase tracking-[0.1em] border transition-colors"
                    style={{
                      borderColor: selected ? "#b8341c" : "rgba(245,241,232,0.14)",
                      backgroundColor: selected ? "#b8341c" : "transparent",
                      color: selected ? "#f5f1e8" : "#f5f1e8",
                    }}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-10 pt-6 border-t" style={{ borderColor: "rgba(245,241,232,0.08)" }}>
        <button type="button" onClick={onBack} className="btn-secondary">
          ← Atrás
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedSlot}
          className="btn-primary"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
