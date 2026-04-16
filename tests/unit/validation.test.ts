import { describe, it, expect } from "vitest";
import { bookingSchema } from "@/lib/validation/booking";
import { serviceSchema } from "@/lib/validation/service";
import { loginSchema } from "@/lib/validation/login";

describe("bookingSchema", () => {
  it("valida input válido", () => {
    const result = bookingSchema.safeParse({
      serviceId: "abc123",
      date: "2026-04-20",
      slotIso: "2026-04-20T15:00:00.000Z",
      customerName: "Juan",
      customerEmail: "juan@mail.com",
      customerPhone: "+52155",
      turnstileToken: "token",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza email inválido", () => {
    const result = bookingSchema.safeParse({
      serviceId: "abc123",
      date: "2026-04-20",
      slotIso: "2026-04-20T15:00:00.000Z",
      customerName: "Juan",
      customerEmail: "no-email",
      customerPhone: "",
      turnstileToken: "token",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza nombre muy corto", () => {
    const result = bookingSchema.safeParse({
      serviceId: "abc123",
      date: "2026-04-20",
      slotIso: "2026-04-20T15:00:00.000Z",
      customerName: "J",
      customerEmail: "juan@mail.com",
      customerPhone: "",
      turnstileToken: "token",
    });
    expect(result.success).toBe(false);
  });

  it("requiere email (no opcional)", () => {
    const result = bookingSchema.safeParse({
      serviceId: "abc123",
      date: "2026-04-20",
      slotIso: "2026-04-20T15:00:00.000Z",
      customerName: "Juan",
      customerEmail: "",
      customerPhone: "",
      turnstileToken: "token",
    });
    expect(result.success).toBe(false);
  });
});

describe("serviceSchema", () => {
  it("valida servicio con campos requeridos", () => {
    const result = serviceSchema.safeParse({ name: "Corte", durationMin: 30, priceCents: 15000 });
    expect(result.success).toBe(true);
  });

  it("rechaza duración menor a 15", () => {
    const result = serviceSchema.safeParse({ name: "Corte", durationMin: 10, priceCents: 15000 });
    expect(result.success).toBe(false);
  });

  it("rechaza nombre vacío", () => {
    const result = serviceSchema.safeParse({ name: "", durationMin: 30, priceCents: 15000 });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("valida credenciales correctas", () => {
    const result = loginSchema.safeParse({ email: "a@b.com", password: "secreto" });
    expect(result.success).toBe(true);
  });

  it("rechaza email sin @", () => {
    const result = loginSchema.safeParse({ email: "noemail", password: "secreto" });
    expect(result.success).toBe(false);
  });

  it("rechaza contraseña vacía", () => {
    const result = loginSchema.safeParse({ email: "a@b.com", password: "" });
    expect(result.success).toBe(false);
  });
});