import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  description: z.string().optional(),
  durationMin: z.coerce
    .number()
    .int()
    .min(15, "Mínimo 15 minutos")
    .max(240, "Máximo 4 horas"),
  priceCents: z.coerce.number().int().min(0, "Precio inválido"),
  active: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
