"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { bookingSchema, type BookingInput } from "@/lib/validation/booking";
import { createBookingAction } from "@/server/public/booking";
import { ServicePicker } from "./ServicePicker";
import { DateSlotPicker } from "./DateSlotPicker";
import { CustomerForm } from "./CustomerForm";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  priceCents: number;
}

const STEPS = [
  { n: "01", label: "Servicio" },
  { n: "02", label: "Fecha y hora" },
  { n: "03", label: "Tus datos" },
];

export function BookingWizard({ services, initialServiceId }: Props) {
  const [step, setStep] = useState(initialServiceId ? 1 : 0);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isDev = process.env.NODE_ENV !== "production";

  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: initialServiceId ?? "",
      date: "",
      slotIso: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      turnstileToken: isDev ? "test-bypass" : "",
    },
  });

  const selectedService = services.find((s) => s.id === form.watch("serviceId"));

  async function onSubmit(data: BookingInput) {
    startTransition(async () => {
      const result = await createBookingAction(data);
      if (result.ok) {
        router.push(`/reservar/confirmacion?code=${result.code}`);
      } else {
        toast.error(result.error ?? "Error al crear la reserva");
      }
    });
  }

  return (
    <div>
      {/* stepper */}
      <div className="mb-16">
        <div className="grid grid-cols-3 gap-0 border" style={{ borderColor: "rgba(245,241,232,0.14)" }}>
          {STEPS.map((s, idx) => {
            const done = idx < step;
            const active = idx === step;
            return (
              <button
                type="button"
                key={s.label}
                onClick={() => {
                  if (idx < step) setStep(idx);
                }}
                disabled={idx > step}
                className="group relative text-left p-5 transition-colors border-l first:border-l-0 cursor-pointer disabled:cursor-default"
                style={{
                  backgroundColor: active ? "#b8341c" : "transparent",
                  color: active ? "#f5f1e8" : done ? "#f5f1e8" : "#6b6358",
                  borderColor: "rgba(245,241,232,0.14)",
                }}
              >
                <span
                  className="text-[0.7rem] font-mono uppercase tracking-[0.22em]"
                  style={{
                    color: active
                      ? "rgba(245,241,232,0.75)"
                      : done
                      ? "#b8341c"
                      : "#6b6358",
                  }}
                >
                  Paso {s.n} {done && "·  ✓"}
                </span>
                <p
                  className="text-display text-xl md:text-2xl mt-1"
                  style={{ color: active ? "#f5f1e8" : done ? "#f5f1e8" : "#b8b0a0" }}
                >
                  {s.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        {step === 0 && (
          <ServicePicker
            services={services}
            value={form.watch("serviceId")}
            onChange={(id) => {
              form.setValue("serviceId", id);
              form.setValue("date", "");
              form.setValue("slotIso", "");
            }}
            onNext={() => setStep(1)}
          />
        )}

        {step === 1 && selectedService && (
          <DateSlotPicker
            serviceId={selectedService.id}
            selectedDate={form.watch("date")}
            selectedSlot={form.watch("slotIso")}
            onDateChange={(d) => {
              form.setValue("date", d);
              form.setValue("slotIso", "");
            }}
            onSlotChange={(s) => form.setValue("slotIso", s)}
            onBack={() => setStep(0)}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <CustomerForm
            form={form}
            onBack={() => setStep(1)}
            isPending={isPending}
            selectedService={selectedService}
            selectedSlot={form.watch("slotIso")}
          />
        )}
      </form>
    </div>
  );
}

interface Props {
  services: Service[];
  initialServiceId?: string;
}
