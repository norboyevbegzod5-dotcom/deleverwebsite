"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import LeadForm from "./LeadForm";

const OPEN_EVENT = "open-lead-modal";

export function openLeadModal() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export default function LeadModal() {
  const tForm = useTranslations("form");
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const open = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-surface p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="pr-8 text-xl font-bold text-white">{tForm("heading")}</h2>
        <p className="mt-1.5 mb-6 text-sm text-slate-400">{tForm("subheading")}</p>
        <LeadForm idPrefix="lead-modal" variant="dark" />
      </div>
    </div>
  );
}
