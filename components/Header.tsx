"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import LeadModal, { openLeadModal } from "./LeadModal";
import { Link } from "@/i18n/navigation";

const navLinks = [
  { href: "/#features", key: "features" },
  { href: "/#process", key: "process" },
  { href: "/#geography", key: "geography" },
  { href: "/#faq", key: "faq" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Delever">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <LanguageSwitcher />
            <button type="button" onClick={openLeadModal} className="btn-primary px-5 py-2.5 text-sm">
              {t("cta")}
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? tc("closeMenu") : tc("openMenu")}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-white/5 bg-background px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-slate-200"
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openLeadModal();
              }}
              className="btn-primary mt-4 w-full px-4 py-2.5 text-sm"
            >
              {t("cta")}
            </button>
          </div>
        )}
      </header>
      <LeadModal />
    </>
  );
}
