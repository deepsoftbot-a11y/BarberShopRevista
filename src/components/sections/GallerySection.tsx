import Image from "next/image";

interface GalleryItem {
  src: string;
  alt: string;
  label: string;
  span: string;
}

const items: GalleryItem[] = [
  {
    src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=85",
    alt: "Perfilado de barba con navaja",
    label: "Navaja · Perfilado",
    span: "md:col-span-5 md:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=85",
    alt: "Tijeras y peine de barbería",
    label: "Herramientas",
    span: "md:col-span-3 md:row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=900&q=85",
    alt: "Interior de la barbería",
    label: "Salón",
    span: "md:col-span-4 md:row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=85",
    alt: "Corte con tijeras",
    label: "Corte clásico",
    span: "md:col-span-4 md:row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=85",
    alt: "Silla de barbería vintage",
    label: "La silla",
    span: "md:col-span-3 md:row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85",
    alt: "Corte terminado",
    label: "El resultado",
    span: "md:col-span-7 md:row-span-1",
  },
];

export function GallerySection() {
  return (
    <section id="galeria" className="surface-1 border-t border-warm-strong">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-28 md:py-36">
        {/* heading */}
        <div className="grid gap-8 md:grid-cols-12 mb-14">
          <div className="md:col-span-6">
            <p className="text-eyebrow mb-6">
              <span className="rule-brick mr-4" /> Capítulo 02 · Archivo visual
            </p>
            <h2
              className="text-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.9]"
              style={{ color: "#f5f1e8" }}
            >
              Fragmentos
              <br />
              <span className="font-serif-italic italic lowercase tracking-normal">
                del taller.
              </span>
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-8 flex items-end">
            <p className="text-sm leading-relaxed" style={{ color: "#b8b0a0" }}>
              Manos, herramientas y rostros que pasan por la silla. Un archivo
              abierto de lo que hacemos todos los días.
            </p>
          </div>
        </div>

        {/* bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-8 md:auto-rows-[220px] gap-2">
          {items.map((it, i) => (
            <figure
              key={i}
              className={`relative overflow-hidden group ${it.span}`}
              style={{ backgroundColor: "#0a0908" }}
            >
              <Image
                src={it.src}
                alt={it.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: "grayscale(0.3) contrast(1.05)" }}
              />
              <div
                aria-hidden
                className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,9,8,0.1) 60%, rgba(10,9,8,0.75) 100%)",
                }}
              />
              <figcaption
                className="absolute bottom-3 left-3 text-[0.65rem] font-mono uppercase tracking-[0.2em] px-2 py-1"
                style={{ backgroundColor: "rgba(10,9,8,0.75)", color: "#f5f1e8" }}
              >
                <span style={{ color: "#b8341c" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>{" "}
                — {it.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
