import Image from "next/image";
import Logo from "@/public/images/logo.svg";

export default function Loading() {
  return (
    <div className="relative isolate flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 py-16 text-slate-200">
      {/* Technical Grid Background (New) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#0f172a,transparent)]" />
      </div>

      {/* Original Content (Preserved) */}
      <div
        aria-live="polite"
        className="relative z-10 flex flex-col items-center text-center"
        role="status"
      >
        {/* Original Spinner */}
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-slate-900/50 shadow-[0_25px_80px_rgba(15,23,42,0.25)] backdrop-blur-3xl">
          <div className="absolute inset-2 rounded-full border border-primary/40" />
          <div className="absolute inset-0 animate-[spin_10s_linear_infinite] rounded-full border border-primary/30 border-dashed" />
          <div className="absolute inset-4 animate-[spin_6s_linear_infinite] rounded-full border border-white/20 border-dashed" />
          <div className="-translate-y-20 absolute h-4 w-4 animate-[spin_4s_linear_infinite] rounded-full bg-primary/80 shadow-lg shadow-primary/40" />
          <Image
            alt="Aleatica"
            className="relative h-14 w-auto drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
            priority
            src={Logo}
          />
        </div>

        {/* Original Text (Colors adjusted for dark background) */}
        <div className="mt-8 space-y-2">
          <p className="font-semibold text-slate-500 text-sm uppercase tracking-[0.35em]">
            Aleatica Suite
          </p>
          <p className="font-medium text-lg text-slate-100">
            Preparando paneles inteligentes...
          </p>
          <p className="text-slate-400 text-sm">
            Sincronizando operaciones críticas en tiempo real
          </p>
        </div>

        {/* Original Dots */}
        <div className="mt-8 flex items-center gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <span
              className="h-2.5 w-2.5 animate-dot-pulse rounded-full bg-primary/60"
              key={`loading-dot-${index}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
