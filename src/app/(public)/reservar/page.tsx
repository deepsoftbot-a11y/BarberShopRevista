import { prisma } from "@/lib/db";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { PublicNav } from "@/components/public/PublicNav";
import { PublicFooter } from "@/components/public/PublicFooter";
import { siteConfig } from "@/data/site";

interface Props {
  searchParams: Promise<{ service?: string }>;
}

export default async function ReservarPage({ searchParams }: Props) {
  const { service: initialServiceId } = await searchParams;

  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      durationMin: true,
      priceCents: true,
    },
  });

  return (
    <>
      <PublicNav variant="solid" />
      <main className="surface-canvas min-h-screen pt-16">
        {/* header band */}
        <section className="border-b border-warm-strong">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24">
            <div className="grid gap-8 md:grid-cols-12 items-end">
              <div className="md:col-span-8">
                <p className="text-eyebrow mb-6">
                  <span className="rule-brick mr-4" /> Agenda · {siteConfig.name}
                </p>
                <h1
                  className="text-display text-[clamp(3rem,9vw,8rem)] leading-[0.88]"
                  style={{ color: "#f5f1e8" }}
                >
                  Reserva
                  <br />
                  <span className="font-serif-italic italic lowercase tracking-normal">
                    tu ritual.
                  </span>
                </h1>
              </div>
              <div className="md:col-span-4 md:text-right">
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#b8b0a0" }}
                >
                  Tres pasos, un minuto. Recibirás confirmación por correo con
                  el código de reserva.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* wizard area */}
        <section className="surface-1 border-b border-warm-strong">
          <div className="mx-auto max-w-4xl px-6 md:px-10 py-16 md:py-24">
            {services.length === 0 ? (
              <p
                className="text-center font-serif-italic italic text-2xl"
                style={{ color: "#b8b0a0" }}
              >
                No hay servicios disponibles.
              </p>
            ) : (
              <BookingWizard services={services} initialServiceId={initialServiceId} />
            )}
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
