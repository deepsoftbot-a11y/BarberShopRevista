"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarCheck, Scissors, Clock, LogOut, ExternalLink } from "lucide-react";
import { logoutAction } from "@/server/admin/auth";
import { siteConfig } from "@/data/site";

const links = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/admin/reservas", label: "Reservas", icon: CalendarCheck, exact: false },
  { href: "/admin/servicios", label: "Servicios", icon: Scissors, exact: false },
  { href: "/admin/horario", label: "Horario", icon: Clock, exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-screen flex-col sticky top-0 shrink-0"
      style={{
        width: "260px",
        backgroundColor: "#0a0908",
        borderRight: "1px solid rgba(245,241,232,0.08)",
      }}
    >
      {/* brand */}
      <div
        className="px-6 py-6 border-b"
        style={{ borderColor: "rgba(245,241,232,0.08)" }}
      >
        <Link href="/admin" className="flex items-center gap-2 mb-2 group">
          <span
            aria-hidden
            className="block h-2 w-2"
            style={{ backgroundColor: "#b8341c" }}
          />
          <span
            className="text-display text-xl tracking-[-0.02em]"
            style={{ color: "#f5f1e8" }}
          >
            {siteConfig.name}
          </span>
        </Link>
        <p
          className="text-[0.65rem] font-mono uppercase tracking-[0.22em]"
          style={{ color: "#6b6358" }}
        >
          Panel de control · v1
        </p>
      </div>

      {/* nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <p
          className="px-3 mb-3 text-[0.65rem] font-mono uppercase tracking-[0.22em]"
          style={{ color: "#6b6358" }}
        >
          Menú
        </p>
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm transition-colors"
              style={{
                backgroundColor: active ? "rgba(184,52,28,0.1)" : "transparent",
                color: active ? "#f5f1e8" : "#b8b0a0",
                borderLeft: active ? "3px solid #b8341c" : "3px solid transparent",
                fontWeight: active ? 600 : 400,
              }}
            >
              <Icon size={16} strokeWidth={1.75} style={{ color: active ? "#b8341c" : "#6b6358" }} />
              <span className="uppercase tracking-[0.08em] text-[0.78rem]">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* go to site */}
      <div className="px-3 py-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 text-[0.75rem] font-mono uppercase tracking-[0.18em] transition-colors"
          style={{ color: "#6b6358" }}
          target="_blank"
        >
          <ExternalLink size={14} strokeWidth={1.75} />
          Ver sitio
        </Link>
      </div>

      {/* logout */}
      <div
        className="px-3 py-4 border-t"
        style={{ borderColor: "rgba(245,241,232,0.08)" }}
      >
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm transition-colors"
            style={{ color: "#b8b0a0" }}
          >
            <LogOut size={16} strokeWidth={1.75} />
            <span className="uppercase tracking-[0.08em] text-[0.78rem]">Cerrar sesión</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
