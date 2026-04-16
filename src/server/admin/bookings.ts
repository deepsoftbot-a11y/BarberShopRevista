"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

export async function cancelBookingAction(id: string) {
  await requireAdmin();
  await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
  revalidatePath("/admin/reservas");
  revalidatePath("/admin");
  return { ok: true };
}

export async function getBookingsAction(params?: {
  date?: string;
  serviceId?: string;
  status?: string;
  search?: string;
}) {
  await requireAdmin();

  const where: Record<string, unknown> = {};
  if (params?.status) where.status = params.status;
  if (params?.serviceId) where.serviceId = params.serviceId;
  if (params?.search) {
    where.OR = [
      { customerName: { contains: params.search, mode: "insensitive" } },
      { code: { contains: params.search, mode: "insensitive" } },
    ];
  }
  if (params?.date) {
    const [y, m, d] = params.date.split("-").map(Number);
    where.startAt = {
      gte: new Date(y, m - 1, d),
      lt: new Date(y, m - 1, d + 1),
    };
  }

  return prisma.booking.findMany({
    where,
    include: { service: true },
    orderBy: { startAt: "asc" },
  });
}
