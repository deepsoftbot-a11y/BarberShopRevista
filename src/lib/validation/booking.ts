import { z } from "zod";

export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Selecciona un servicio"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  slotIso: z.string().min(1, "Selecciona un horario"),
  customerName: z.string().min(2, "Ingresa tu nombre"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().optional(),
  turnstileToken: z.string().min(1, "Verifica que no eres un robot"),
});

export type BookingInput = z.infer<typeof bookingSchema>;
