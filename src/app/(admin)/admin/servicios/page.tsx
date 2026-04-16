import { prisma } from "@/lib/db";
import { ServicesManager } from "@/components/admin/ServicesManager";

export const metadata = { title: "Servicios – Admin" };

export default async function ServiciosPage() {
  const services = await prisma.service.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <div className="mb-12 grid gap-6 md:grid-cols-12 items-end">
        <div className="md:col-span-8">
          <p className="text-eyebrow mb-4">
            <span className="rule-brick mr-4" /> Panel · Catálogo
          </p>
          <h1
            className="text-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.92]"
            style={{ color: "#f5f1e8" }}
          >
            Servicios
          </h1>
        </div>
        <div className="md:col-span-4 md:text-right">
          <p className="text-sm" style={{ color: "#b8b0a0" }}>
            Define el catálogo visible para los clientes al reservar.
          </p>
        </div>
      </div>
      <ServicesManager services={services} />
    </div>
  );
}
