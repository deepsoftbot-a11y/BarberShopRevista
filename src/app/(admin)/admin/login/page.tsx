import { loginAction } from "@/server/admin/auth";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { siteConfig } from "@/data/site";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div
      className="grid min-h-screen lg:grid-cols-2 surface-canvas"
      style={{ color: "#f5f1e8" }}
    >
      {/* left column — form */}
      <div className="flex items-center justify-center px-6 md:px-12 py-16">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-10">
            <span
              aria-hidden
              className="block h-2 w-2"
              style={{ backgroundColor: "#b8341c" }}
            />
            <span className="text-display text-xl" style={{ color: "#f5f1e8" }}>
              {siteConfig.name}
            </span>
          </div>

          <p className="text-eyebrow mb-4">
            <span className="rule-brick mr-4" /> Panel · Acceso
          </p>
          <h1
            className="text-display text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] mb-3"
            style={{ color: "#f5f1e8" }}
          >
            Iniciar{" "}
            <span className="font-serif-italic italic lowercase tracking-normal">
              sesión.
            </span>
          </h1>
          <p className="text-sm mb-10" style={{ color: "#b8b0a0" }}>
            Acceso restringido al personal autorizado.
          </p>

          <form action={loginAction} className="space-y-5">
            <div>
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="password" className="input-label">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="input-field"
              />
            </div>

            <button type="submit" className="btn-primary w-full mt-4">
              Ingresar al panel
            </button>
          </form>

          <p
            className="mt-10 text-[0.7rem] font-mono uppercase tracking-[0.22em]"
            style={{ color: "#6b6358" }}
          >
            ← Volver al sitio público
          </p>
        </div>
      </div>

      {/* right column — editorial side */}
      <div
        className="hidden lg:flex relative overflow-hidden flex-col justify-between p-12"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1400&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,9,8,0.35) 0%, rgba(10,9,8,0.85) 100%)",
          }}
        />
        <div className="relative">
          <span
            className="text-[0.65rem] font-mono uppercase tracking-[0.22em] px-2 py-1"
            style={{ backgroundColor: "#b8341c", color: "#f5f1e8" }}
          >
            Figura 01 · Panel
          </span>
        </div>
        <div className="relative max-w-md">
          <p
            className="font-serif-italic italic text-3xl leading-snug mb-4"
            style={{ color: "#f5f1e8" }}
          >
            “La herramienta correcta, en la mano correcta, en el tiempo
            correcto.”
          </p>
          <p
            className="text-[0.72rem] font-mono uppercase tracking-[0.22em]"
            style={{ color: "#b8341c" }}
          >
            — El oficio
          </p>
        </div>
      </div>
    </div>
  );
}
