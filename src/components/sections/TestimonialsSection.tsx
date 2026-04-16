import { testimonials } from "@/data/testimonials";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const featured = testimonials[0];
  const rest = testimonials.slice(1);

  return (
    <section id="testimonios" className="surface-canvas border-t border-warm-strong">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-28 md:py-36">
        <div className="grid gap-8 md:grid-cols-12 mb-16">
          <div className="md:col-span-6">
            <p className="text-eyebrow mb-6">
              <span className="rule-brick mr-4" /> Capítulo 03 · Voces
            </p>
            <h2
              className="text-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.9]"
              style={{ color: "#f5f1e8" }}
            >
              Lo que dicen
              <br />
              <span className="font-serif-italic italic lowercase tracking-normal">
                en la silla.
              </span>
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9 flex items-end">
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill="#b8341c"
                  stroke="#b8341c"
                />
              ))}
              <span
                className="ml-3 text-[0.7rem] font-mono uppercase tracking-[0.2em]"
                style={{ color: "#b8b0a0" }}
              >
                5.0 / Google
              </span>
            </div>
          </div>
        </div>

        {/* featured pull-quote */}
        {featured && (
          <figure
            className="relative border-y py-16 md:py-24 px-4 md:px-12 grid md:grid-cols-12 gap-8"
            style={{ borderColor: "rgba(245,241,232,0.14)" }}
          >
            <span
              aria-hidden
              className="absolute -top-8 left-4 md:left-12 text-display text-[10rem] leading-none select-none"
              style={{ color: "#b8341c", opacity: 0.9 }}
            >
              “
            </span>
            <blockquote
              className="md:col-span-9 font-serif-italic italic text-[clamp(1.6rem,3.5vw,3rem)] leading-[1.15]"
              style={{ color: "#f5f1e8" }}
            >
              {featured.text}
            </blockquote>
            <figcaption className="md:col-span-3 flex flex-col justify-end">
              <span
                className="text-display text-xl"
                style={{ color: "#b8341c" }}
              >
                {featured.name}
              </span>
              <span
                className="text-[0.7rem] font-mono uppercase tracking-[0.2em] mt-1"
                style={{ color: "#6b6358" }}
              >
                Cliente frecuente
              </span>
            </figcaption>
          </figure>
        )}

        {/* grid of rest */}
        <div className="grid gap-px mt-px md:grid-cols-3 bg-[rgba(245,241,232,0.08)]">
          {rest.map((t) => (
            <div
              key={t.id}
              className="surface-canvas p-8 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill="#b8341c"
                    stroke="#b8341c"
                  />
                ))}
              </div>
              <p
                className="font-serif-italic italic text-lg leading-snug mb-6 flex-1"
                style={{ color: "#f5f1e8" }}
              >
                “{t.text}”
              </p>
              <p
                className="text-[0.7rem] font-mono uppercase tracking-[0.22em]"
                style={{ color: "#b8341c" }}
              >
                — {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
