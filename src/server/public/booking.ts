"use server";

import { prisma } from "@/lib/db";
import { bookingSchema } from "@/lib/validation/booking";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendConfirmationEmail } from "@/lib/email";
import { getAvailableSlots } from "@/lib/availability";
import { format } from "date-fns";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

function formatCode(raw: string): string {
  return `${raw.slice(0, 3)}-${raw.slice(3)}`;
}

export async function createBookingAction(data: unknown) {
  const parsed = bookingSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const { serviceId, date, slotIso, customerName, customerEmail, customerPhone, turnstileToken } =
    parsed.data;

  const turnstileOk = await verifyTurnstile(turnstileToken);
  if (!turnstileOk) {
    return { ok: false, error: "Verificación de seguridad fallida. Inténtalo de nuevo." };
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId, active: true } });
  if (!service) {
    return { ok: false, error: "Servicio no disponible" };
  }

  const startAt = new Date(slotIso);
  const endAt = new Date(startAt.getTime() + service.durationMin * 60 * 1000);

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const slots = await getAvailableSlots(date, service.durationMin);
      if (!slots.includes(slotIso)) {
        throw new Error("El horario seleccionado ya no está disponible");
      }

      const code = formatCode(nanoid());

      return tx.booking.create({
        data: {
          code,
          serviceId,
          startAt,
          endAt,
          customerName,
          customerEmail,
          customerPhone: customerPhone ?? null,
          status: "CONFIRMED",
        },
      });
    });

    void sendConfirmationEmail({
      to: customerEmail,
      customerName,
      serviceName: service.name,
      startAt,
      code: booking.code,
    }).catch(console.error);

    return { ok: true, code: booking.code };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al crear la reserva";
    return { ok: false, error: msg };
  }
}

export async function getAvailableSlotsAction(date: string, serviceId: string) {
  const service = await prisma.service.findUnique({ where: { id: serviceId, active: true } });
  if (!service) return [];
  return getAvailableSlots(date, service.durationMin);
}
