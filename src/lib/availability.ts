import { prisma } from "./db";
import { buildSlotDateTime, nowInTZ, toTZ } from "./datetime";
import { addMinutes, isBefore } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { TIMEZONE } from "./datetime";

interface Range {
  startMin: number;
  endMin: number;
}

function subtractRanges(base: Range, exceptions: Range[]): Range[] {
  let result: Range[] = [base];

  for (const exc of exceptions) {
    const next: Range[] = [];
    for (const r of result) {
      if (exc.endMin <= r.startMin || exc.startMin >= r.endMin) {
        next.push(r);
      } else {
        if (r.startMin < exc.startMin) next.push({ startMin: r.startMin, endMin: exc.startMin });
        if (r.endMin > exc.endMin) next.push({ startMin: exc.endMin, endMin: r.endMin });
      }
    }
    result = next;
  }

  return result;
}

export async function getAvailableSlots(
  dateStr: string,
  durationMin: number
): Promise<string[]> {
  const [year, month, day] = dateStr.split("-").map(Number);
  const jsDate = new Date(year, month - 1, day);
  const weekday = jsDate.getDay();

  const [schedule, exceptions, bookings] = await Promise.all([
    prisma.weeklySchedule.findUnique({ where: { weekday } }),
    prisma.scheduleException.findMany({
      where: {
        date: {
          gte: new Date(year, month - 1, day),
          lt: new Date(year, month - 1, day + 1),
        },
      },
    }),
    prisma.booking.findMany({
      where: {
        status: "CONFIRMED",
        startAt: {
          gte: buildSlotDateTime(dateStr, 0),
          lt: buildSlotDateTime(dateStr, 1440),
        },
      },
      select: { startAt: true, endAt: true },
    }),
  ]);

  if (!schedule || schedule.isClosed) return [];

  type ScheduleException = { startMin: number | null; endMin: number | null };

  const fullDayClosed = exceptions.some(
    (e: ScheduleException) => e.startMin === null && e.endMin === null
  );
  if (fullDayClosed) return [];

  const partialExceptions = exceptions
    .filter((e: ScheduleException) => e.startMin !== null && e.endMin !== null)
    .map((e: ScheduleException) => ({ startMin: e.startMin as number, endMin: e.endMin as number }));

  const openRanges = subtractRanges(
    { startMin: schedule.startMin, endMin: schedule.endMin },
    partialExceptions
  );

  const now = nowInTZ();
  const slots: string[] = [];

  for (const range of openRanges) {
    let cursor = range.startMin;
    while (cursor + durationMin <= range.endMin) {
      const slotStart = buildSlotDateTime(dateStr, cursor);
      const slotEnd = addMinutes(slotStart, durationMin);

      const isPast = isBefore(slotStart, now);
      if (!isPast) {
        const conflict = bookings.some(
          (b: { startAt: Date; endAt: Date }) => b.startAt < slotEnd && b.endAt > slotStart
        );
        if (!conflict) {
          slots.push(slotStart.toISOString());
        }
      }

      cursor += durationMin;
    }
  }

  return slots;
}
