"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { serviceSchema } from "@/lib/validation/service";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

export async function createServiceAction(data: unknown) {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await prisma.service.create({ data: parsed.data });
  revalidatePath("/admin/servicios");
  revalidatePath("/");
  return { ok: true };
}

export async function updateServiceAction(id: string, data: unknown) {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await prisma.service.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/servicios");
  revalidatePath("/");
  return { ok: true };
}

export async function toggleServiceAction(id: string, active: boolean) {
  await requireAdmin();
  await prisma.service.update({ where: { id }, data: { active } });
  revalidatePath("/admin/servicios");
  revalidatePath("/");
  return { ok: true };
}

export async function reorderServicesAction(ids: string[]) {
  await requireAdmin();
  await Promise.all(
    ids.map((id, idx) =>
      prisma.service.update({ where: { id }, data: { sortOrder: idx } })
    )
  );
  revalidatePath("/admin/servicios");
  revalidatePath("/");
  return { ok: true };
}
