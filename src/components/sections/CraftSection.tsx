import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CRAFT_IMAGE =
  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1400&q=85";

const pillars = [
  {
    n: "01",
    t: "Navaja caliente",
    d: "Afeitado tradicional con toalla vapor y aceite pre-shave. Cinco pasadas, sin atajos.",
  },
  {
    n: "02",
    t: "Tijera a mano",
    d: "Texturizado punto por punto. Sin máquinas donde la mano decide mejor.",
  },
  {
    n: "03",
    t: "Productos de autor",
    d: "Pomadas, tónicos y fragancias seleccionadas para cabello latino, piel real, uso diario.",
  },
];

export function CraftSection() {
  return (
    <section id="oficio" className="surface-1 border-t border-warm-strong">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-28 md:py-36 grid gap-16 md:grid-cols-12">
        {/* image column */}
        <div className="md:col-span-5 relative min-h-[480px]">
          <div className="sticky top-24">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src={CRAFT_IMAGE}
                alt="Barbero trabajando con navaja"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
                style={{ filter: "grayscale(0.2) contrast(1.05)" }}
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,9,8,0) 40%, rgba(10,9,8,0.5) 100%)",
                }}
              />
              <span
                className="absolute top-4 left-4 text-[0.65rem] font-mono uppercase tracking-[0.22em] px-2 py-1"
                style={{ backgroundColor: "#b8341c", color: "#f5f1e8" }}
              >
                Figura 02
              </span>
              <span
                className="absolute bottom-4 right-4 text-[0.65rem] font-mono uppercase tracking-[0.22em]"
                style={{ color: "#f5f1e8" }}
              >
                El pulso
              </span>
            </div>
            <p
              className="mt-5 text-[0.72rem] font-mono uppercase tracking-[0.2em] flex items-center gap-3"
              style={{ color: "#6b6358" }}
            >
              <span
                aria-hidden
                className="block h-[1px] w-8"
                style={{ backgroundColor: "#b8341c" }}
              />
              Oficio · Desde 2014
            </p>
          </div>
        </div>

        {/* content column */}
        <div className="md:col-span-7 flex flex-col">
          <p className="text-eyebrow mb-6">
            <span className="rule-brick mr-4" /> Capítulo 04 · El oficio
          </p>
          <h2
            className="text-display text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.9] mb-10"
            style={{ color: "#f5f1e8" }}
          >
            Tres reglas
            <br />
            <span style={{ color: "#b8341c" }}>que no</span>
            <br />
            <span className="font-serif-italic italic lowercase tracking-normal">
              rompemos.
            </span>
          </h2>

          <p
            className="text-lg leading-relaxed max-w-xl mb-12"
            style={{ color: "#b8b0a0" }}
          >
            Diez años afinando la misma disciplina: cortar bien, escuchar mejor,
            cuidar lo que dejamos en la cara y la cabeza de quien se sienta.
          </p>

          <div
            className="border-t divide-y"
            style={{ borderColor: "rgba(245,241,232,0.14)" }}
          >
            {pillars.map((p) => (
              <div
                key={p.n}
                className="grid grid-cols-12 gap-4 py-8 md:py-10 items-baseline"
                style={{ borderColor: "rgba(245,241,232,0.14)" }}
              >
                <span
                  className="col-span-2 text-display text-2xl"
                  style={{ color: "#b8341c" }}
                >
                  {p.n}
                </span>
                <div className="col-span-10">
                  <h3
                    className="text-display text-2xl md:text-3xl mb-2"
                    style={{ color: "#f5f1e8" }}
                  >
                    {p.t}
                  </h3>
                  <p
                    className="text-sm md:text-base leading-relaxed"
                    style={{ color: "#b8b0a0" }}
                  >
                    {p.d}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link href="/reservar" className="btn-primary group">
              Reservar tu ritual
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
