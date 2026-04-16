"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  weeklyScheduleSchema,
  scheduleExceptionSchema,
} from "@/lib/validation/schedule";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

export async function updateWeeklyScheduleAction(data: unknown) {
  await requireAdmin();
  const parsed = weeklyScheduleSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  for (const s of parsed.data.schedules) {
    await prisma.weeklySchedule.upsert({
      where: { weekday: s.weekday },
      update: s,
      create: s,
    });
  }

  revalidatePath("/admin/horario");
  revalidatePath("/");
  return { ok: true };
}

export async function createExceptionAction(data: unknown) {
  await requireAdmin();
  const parsed = scheduleExceptionSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const [y, m, d] = parsed.data.date.split("-").map(Number);

  await prisma.scheduleException.create({
    data: {
      date: new Date(y, m - 1, d),
      startMin: parsed.data.startMin ?? null,
      endMin: parsed.data.endMin ?? null,
      reason: parsed.data.reason,
    },
  });

  revalidatePath("/admin/horario");
  return { ok: true };
}

export async function deleteExceptionAction(id: string) {
  await requireAdmin();
  await prisma.scheduleException.delete({ where: { id } });
  revalidatePath("/admin/horario");
  return { ok: true };
}
