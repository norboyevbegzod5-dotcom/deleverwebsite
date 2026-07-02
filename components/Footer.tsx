import { useTranslations } from "next-intl";
import { Layers, Send, Globe } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

const navLinks = [
  { href: "#features", key: "features" },
  { href: "#clients", key: "clients" },
  { href: "#geography", key: "geography" },
] as const;

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy py-12 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Layers className="h-4.5 w-4.5" />
              </span>
              Delever
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">{t("description")}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              {t("navHeading")}
            </h4>
            <nav className="mt-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a key={link.key} href={link.href} className="text-sm text-slate-300 hover:text-white">
                  {tNav(link.key)}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              {t("contactHeading")}
            </h4>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href="#cta-bottom"
                className="inline-flex w-fit rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                {t("contactCta")}
              </a>
              {/* TODO: point these at real social/Telegram profiles */}
              <div className="flex gap-3">
                <a
                  href="#"
                  aria-label="Telegram"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-slate-300 hover:border-primary hover:text-primary"
                >
                  <Send className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="Website"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-slate-300 hover:border-primary hover:text-primary"
                >
                  <Globe className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {year} Delever. {t("rights")}.
          </p>
          <LanguageSwitcher dark />
        </div>
      </div>
    </footer>
  );
}
