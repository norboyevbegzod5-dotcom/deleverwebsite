import { getTranslations } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import { Link } from "@/i18n/navigation";

export default async function ThankYouPage() {
  const t = await getTranslations("thankYou");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-16">
        <div className="flex max-w-md flex-col items-center gap-3 rounded-2xl bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          <h1 className="text-2xl font-bold text-slate-900">{t("heading")}</h1>
          <p className="text-slate-600">{t("message")}</p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            {t("backButton")}
          </Link>
        </div>
      </main>
    </div>
  );
}
