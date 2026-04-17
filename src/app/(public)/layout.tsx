export const dynamic = "force-dynamic";

import { Toaster } from "@/components/ui/sonner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
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
    </>
  );
}
