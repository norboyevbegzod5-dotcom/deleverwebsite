import { useTranslations } from "next-intl";
import Logo from "./Logo";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <Logo muted />
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Delever. {t("rights")}.
        </p>
      </div>
    </footer>
  );
}
