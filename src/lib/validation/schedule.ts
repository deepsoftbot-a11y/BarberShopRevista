import { z } from "zod";

export const weeklyScheduleSchema = z.object({
  schedules: z.array(
    z.object({
      weekday: z.number().int().min(0).max(6),
      startMin: z.coerce.number().int().min(0).max(1439),
      endMin: z.coerce.number().int().min(0).max(1440),
      isClosed: z.boolean(),
    })
  ),
});

export const scheduleExceptionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  startMin: z.coerce.number().int().optional().nullable(),
  endMin: z.coerce.number().int().optional().nullable(),
  reason: z.string().optional(),
});

export type WeeklyScheduleInput = z.infer<typeof weeklyScheduleSchema>;
export type ScheduleExceptionInput = z.infer<typeof scheduleExceptionSchema>;
