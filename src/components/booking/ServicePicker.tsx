"use client";

import { Check } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  priceCents: number;
}

interface Props {
  services: Service[];
  value: string;
  onChange: (id: string) => void;
  onNext: () => void;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function ServicePicker({ services, value, onChange, onNext }: Props) {
  return (
    <div>
      <div className="mb-10">
        <p className="text-eyebrow mb-4">
          <span className="rule-brick mr-4" /> Selecciona
        </p>
        <h2
          className="text-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95]"
          style={{ color: "#f5f1e8" }}
        >
          Elige tu{" "}
          <span className="font-serif-italic italic lowercase tracking-normal">
            servicio.
          </span>
        </h2>
      </div>

      <div
        className="border divide-y"
        style={{ borderColor: "rgba(245,241,232,0.14)" }}
      >
        {services.map((s, i) => {
          const selected = value === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              className="w-full text-left grid grid-cols-12 gap-4 items-center p-5 md:p-6 transition-colors"
              style={{
                backgroundColor: selected ? "rgba(184,52,28,0.08)" : "transparent",
                borderLeft: selected ? "3px solid #b8341c" : "3px solid transparent",
                color: "#f5f1e8",
              }}
            >
              <span
                className="col-span-2 md:col-span-1 text-display text-xl md:text-2xl"
                style={{ color: selected ? "#b8341c" : "#6b6358" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="col-span-7 md:col-span-6">
                <h3
                  className="text-display text-xl md:text-2xl"
                  style={{ color: selected ? "#b8341c" : "#f5f1e8" }}
                >
                  {s.name}
                </h3>
                {s.description && (
                  <p
                    className="text-sm mt-1 hidden md:block"
                    style={{ color: "#6b6358" }}
                  >
                    {s.description}
                  </p>
                )}
                <p
                  className="text-[0.7rem] font-mono uppercase tracking-[0.2em] mt-2 md:mt-1"
                  style={{ color: "#6b6358" }}
                >
                  {s.durationMin} min
                </p>
              </div>

              <div className="col-span-3 md:col-span-4 text-right md:text-left">
                <span
                  className="text-display text-2xl md:text-3xl"
                  style={{ color: "#f5f1e8" }}
                >
                  {formatPrice(s.priceCents)}
                </span>
              </div>

              <div className="col-span-12 md:col-span-1 flex md:justify-end">
                <span
                  className="flex h-8 w-8 items-center justify-center border"
                  style={{
                    borderColor: selected ? "#b8341c" : "rgba(245,241,232,0.22)",
                    backgroundColor: selected ? "#b8341c" : "transparent",
                    color: selected ? "#f5f1e8" : "transparent",
                  }}
                >
                  <Check size={14} strokeWidth={2.5} />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end mt-10">
        <button
          type="button"
          onClick={onNext}
          disabled={!value}
          className="btn-primary"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
