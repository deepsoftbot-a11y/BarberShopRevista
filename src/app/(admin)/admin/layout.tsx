import { AdminNav } from "@/components/admin/AdminNav";
import { Toaster } from "@/components/ui/sonner";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen surface-canvas"
      style={{ color: "#f5f1e8" }}
    >
      <AdminNav />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-[1400px] px-8 lg:px-12 py-10 lg:py-14">
          {children}
        </div>
      </main>
      <Toaster
        toastOptions={{
          style: {
            backgroundColor: "#141210",
            border: "1px solid rgba(245,241,232,0.14)",
            color: "#f5f1e8",
            fontSize: "0.8125rem",
            borderRadius: 0,
          },
        }}
      />
    </div>
  );
}
