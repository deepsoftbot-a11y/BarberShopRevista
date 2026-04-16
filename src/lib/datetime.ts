import {
  toZonedTime,
  fromZonedTime,
  formatInTimeZone,
} from "date-fns-tz";
import { format, addMinutes, isBefore, parseISO } from "date-fns";

export const TIMEZONE = process.env.TIMEZONE ?? "America/Mexico_City";

export function nowInTZ(): Date {
  return toZonedTime(new Date(), TIMEZONE);
}

export function toUTC(date: Date): Date {
  return fromZonedTime(date, TIMEZONE);
}

export function toTZ(date: Date): Date {
  return toZonedTime(date, TIMEZONE);
}

export function formatTZ(date: Date, fmt: string): string {
  return formatInTimeZone(date, TIMEZONE, fmt);
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function buildSlotDateTime(dateStr: string, startMin: number): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const h = Math.floor(startMin / 60);
  const m = startMin % 60;
  return fromZonedTime(new Date(year, month - 1, day, h, m, 0), TIMEZONE);
}

export { format, addMinutes, isBefore, parseISO };
