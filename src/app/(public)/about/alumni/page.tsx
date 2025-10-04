"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";

export default function AboutAlumniPage() {
  const t = useTranslations("about.pages.alumni");
  return (
    <div className="space-y-6">
      <PublicPageHeader
        title={t("title")}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About BISO", href: "/about" }, { label: t("title") }]}
      />
      <p className="text-primary-70">{t("intro")}</p>
      <p className="text-primary-70">{t("content")}</p>
      <Button asChild>
        <Link href="/alumni">{t("cta")}</Link>
      </Button>
    </div>
  );
}


