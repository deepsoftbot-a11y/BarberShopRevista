"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 surface-canvas"
      style={{ color: "#f5f1e8" }}
    >
      <div className="max-w-md text-center">
        <p
          className="text-[0.7rem] font-mono uppercase tracking-[0.22em] mb-6"
          style={{ color: "#b8341c" }}
        >
          ◆ Error 500
        </p>
        <h1
          className="text-display text-[clamp(3rem,8vw,6rem)] leading-[0.9] mb-6"
          style={{ color: "#f5f1e8" }}
        >
          Algo salió{" "}
          <span className="font-serif-italic italic lowercase tracking-normal">
            mal.
          </span>
        </h1>
        <p className="text-base mb-8" style={{ color: "#b8b0a0" }}>
          Lo sentimos, algo no funcionó bien. Intenta de nuevo en unos segundos.
        </p>
        <button onClick={reset} className="btn-primary">
          Reintentar
        </button>
      </div>
    </div>
  );
}
