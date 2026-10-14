import { Layers } from "lucide-react";

export default function Logo({ muted = false }: { muted?: boolean }) {
  return (
    <span className={`flex items-center gap-2 text-lg font-bold tracking-tight ${muted ? "text-slate-400" : "text-white"}`}>
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          muted ? "bg-white/10 text-slate-300" : "bg-brand-gradient text-navy"
        }`}
      >
        <Layers className="h-4.5 w-4.5" />
      </span>
      Delever
    </span>
  );
}
