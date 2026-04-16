import { prisma } from "@/lib/db";
import { ScheduleManager } from "@/components/admin/ScheduleManager";

export const metadata = { title: "Horario – Admin" };

export default async function HorarioPage() {
  const [schedules, exceptions] = await Promise.all([
    prisma.weeklySchedule.findMany({ orderBy: { weekday: "asc" } }),
    prisma.scheduleException.findMany({ orderBy: { date: "desc" }, take: 50 }),
  ]);

  return (
    <div>
      <div className="mb-12 grid gap-6 md:grid-cols-12 items-end">
        <div className="md:col-span-8">
          <p className="text-eyebrow mb-4">
            <span className="rule-brick mr-4" /> Panel · Calendario
          </p>
          <h1
            className="text-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.92]"
            style={{ color: "#f5f1e8" }}
          >
            Horario
          </h1>
        </div>
        <div className="md:col-span-4 md:text-right">
          <p className="text-sm" style={{ color: "#b8b0a0" }}>
            Configura el horario semanal y las excepciones de la agenda.
          </p>
        </div>
      </div>
      <ScheduleManager schedules={schedules} exceptions={exceptions} />
    </div>
  );
}
