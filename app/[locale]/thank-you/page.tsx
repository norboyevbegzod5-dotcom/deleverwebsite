import { getTranslations } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/navigation";

export default async function ThankYouPage() {
  const t = await getTranslations("thankYou");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="flex max-w-md flex-col items-center gap-3 rounded-3xl border border-white/5 bg-surface p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold text-white">{t("heading")}</h1>
          <p className="text-slate-400">{t("message")}</p>
          <Link href="/" className="btn-primary mt-4 px-6 py-3 text-sm">
            {t("backButton")}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
