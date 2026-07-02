"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, Layers } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

const navLinks = [
  { href: "#features", key: "features" },
  { href: "#clients", key: "clients" },
  { href: "#geography", key: "geography" },
  { href: "#cta-bottom", key: "contact" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Layers className="h-4.5 w-4.5" />
          </span>
          Delever
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-primary"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher />
          <a
            href="#cta-bottom"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            {t("cta")}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? tc("closeMenu") : tc("openMenu")}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                {t(link.key)}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between gap-4">
            <LanguageSwitcher />
            <a
              href="#cta-bottom"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white"
            >
              {t("cta")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
