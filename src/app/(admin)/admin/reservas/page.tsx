import { prisma } from "@/lib/db";
import { BookingsManager } from "@/components/admin/BookingsManager";

export const metadata = { title: "Reservas – Admin" };

export default async function ReservasPage() {
  const bookings = await prisma.booking.findMany({
    include: { service: true },
    orderBy: { startAt: "asc" },
  });

  return (
    <div>
      <div className="mb-12 grid gap-6 md:grid-cols-12 items-end">
        <div className="md:col-span-8">
          <p className="text-eyebrow mb-4">
            <span className="rule-brick mr-4" /> Panel · Agenda
          </p>
          <h1
            className="text-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.92]"
            style={{ color: "#f5f1e8" }}
          >
            Reservas
          </h1>
        </div>
        <div className="md:col-span-4 md:text-right">
          <p className="text-sm" style={{ color: "#b8b0a0" }}>
            Administra todas las reservas confirmadas y canceladas.
          </p>
        </div>
      </div>
      <BookingsManager bookings={bookings} />
    </div>
  );
}
