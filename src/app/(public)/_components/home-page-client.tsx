"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { SelectCampus } from "@/components/select-campus";
import { useCampus } from "@/components/context/campus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatDateReadable } from "@/lib/utils";

import type { Event } from "@/lib/types/event";
import type { Job } from "@/lib/types/job";
import type { NewsItem } from "@/lib/types/alumni";
import { Models } from "node-appwrite";
import { useTranslations } from "next-intl";

type Product = Models.Document & {
  name: string;
  images?: string[];
  price?: number;
  description?: string;
  slug?: string;
  url?: string;
};

type HomePageClientProps = {
  events: Event[];
  news: NewsItem[];
  jobs: Job[];
  products: Product[];
};

const SectionHeader = ({
  title,
  description,
  href,
  linkLabel,
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) => (
  <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h2 className="text-2xl font-semibold text-primary-100 lg:text-3xl">{title}</h2>
      {description ? (
        <p className="text-sm text-muted-foreground lg:text-base">{description}</p>
      ) : null}
    </div>
    {href && linkLabel ? (
      <Button asChild variant="ghost" size="sm" className="h-9 text-primary-30 hover:text-primary-20">
        <Link href={href}>{linkLabel}</Link>
      </Button>
    ) : null}
  </div>
);

const StatPill = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-left shadow-glow">
    <div className="text-2xl font-semibold text-white drop-shadow-sm">{value}</div>
    <div className="text-xs uppercase tracking-wide text-white/70">{label}</div>
  </div>
);

export const HomePageClient = ({ events, news, jobs, products }: HomePageClientProps) => {
  const { campuses, activeCampus, activeCampusId } = useCampus();
  const t = useTranslations("home");
  const commonT = useTranslations("common");

  const campusLookup = useMemo(() => {
    return campuses.reduce<Record<string, string>>((acc, campus) => {
      acc[campus.$id] = campus.name;
      return acc;
    }, {});
  }, [campuses]);

  const eventsForCampus = useMemo(() => {
    if (!activeCampusId) return events;
    return events.filter((event) => event.campus === activeCampusId);
  }, [events, activeCampusId]);

  const jobsForCampus = useMemo(() => {
    if (!activeCampusId) return jobs;
    return jobs.filter((job) => job.campus === activeCampusId);
  }, [jobs, activeCampusId]);

  const heroStats = useMemo(() => {
    return [
      { label: t("hero.stats.campuses"), value: campuses.length || "—" },
      { label: t("hero.stats.events"), value: eventsForCampus.length || "—" },
      { label: t("hero.stats.jobs"), value: jobsForCampus.length || "—" },
    ];
  }, [campuses.length, eventsForCampus.length, jobsForCampus.length]);

  const spotlightProducts = useMemo(() => products.slice(0, 3), [products]);
  const spotlightNews = useMemo(() => news.slice(0, 3), [news]);
  const spotlightEvents = useMemo(() => eventsForCampus.slice(0, 6), [eventsForCampus]);
  const spotlightJobs = useMemo(() => jobsForCampus.slice(0, 6), [jobsForCampus]);

  const heroSubtitle = activeCampus
    ? t("hero.subtitleActive", { campusName: activeCampus.name })
    : t("hero.subtitleDefault");

  return (
    <div className="space-y-20 text-primary-100">
      <section className="relative overflow-hidden rounded-[32px] bg-linear-to-br from-primary-100 via-blue-strong to-blue-accent text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(61,169,224,0.35),transparent_55%)]" />
        <div className="relative grid gap-10 px-6 py-12 md:px-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:py-16 xl:px-14">
          <div className="space-y-6">
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-white drop-shadow md:text-5xl">
              {activeCampus
                ? t("hero.titleActive", { campusName: activeCampus.name })
                : t("hero.titleDefault")}
            </h1>
            <p className="max-w-2xl text-base text-white/80 md:text-lg">{heroSubtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-white text-primary-100 hover:bg-white/90">
                <Link href="/membership">{commonT("buttons.becomeMember")}</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="border-white/60 bg-transparent text-white hover:bg-white/10">
                <Link href="/events">{t("hero.primaryCtaSecondary")}</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              {heroStats.map((stat) => (
                <StatPill key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
          </div>

          <div className="relative hidden h-full min-h-[320px] rounded-3xl border border-white/20 bg-white/10 shadow-glow lg:flex lg:flex-col lg:justify-between">
            <div className="relative flex-1 overflow-hidden rounded-3xl">
              <Image
                src="/images/placeholder.jpg"
                alt={t("hero.imageAlt")}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-strong/80 via-blue-strong/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-sm">
                <p className="text-white/90">{t("hero.promo.tagline")}</p>
                <p className="text-lg font-semibold text-white">{t("hero.promo.headline")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: t("quickLinks.units.title"),
            description: t("quickLinks.units.description"),
            href: "/units",
            cta: t("quickLinks.units.cta"),
          },
          {
            title: t("quickLinks.highlights.title"),
            description: t("quickLinks.highlights.description"),
            href: "/events",
            cta: t("quickLinks.highlights.cta"),
          },
          {
            title: t("quickLinks.roles.title"),
            description: t("quickLinks.roles.description"),
            href: "/jobs",
            cta: t("quickLinks.roles.cta"),
          },
          {
            title: t("quickLinks.benefits.title"),
            description: t("quickLinks.benefits.description"),
            href: "/shop",
            cta: t("quickLinks.benefits.cta"),
          },
        ].map((item) => (
          <Card key={item.title} className="group relative overflow-hidden border border-primary/10 bg-white/80 shadow-card-hover transition hover:-translate-y-1 hover:shadow-xl">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-1 rounded-b-full bg-linear-to-r from-blue-accent via-gold-default to-blue-accent opacity-0 transition group-hover:opacity-100" />
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary-100">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>{item.description}</p>
              <Button asChild variant="link" className="px-0 text-primary-30">
                <Link href={item.href}>{item.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-8">
        <SectionHeader
          title={
            activeCampus
              ? t("news.titleActive", { campusName: activeCampus.name })
              : t("news.titleDefault")
          }
          description={t("news.description")}
          href="/news"
          linkLabel={t("news.cta")}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {spotlightNews.length ? (
            spotlightNews.map((item) => (
              <Card key={item.$id} className="overflow-hidden border border-primary/10 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-card-hover">
                {item.image ? (
                  <div className="relative h-48 w-full">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                ) : null}
                <CardContent className="space-y-3 p-6">
                  <div className="text-xs uppercase tracking-wide text-blue-accent/90">
                    {formatDateReadable(item.date)}
                  </div>
                  <CardTitle className="text-xl font-semibold text-primary-100">
                    <Link href={`/news/${item.$id}`} className="hover:underline">
                      {item.title}
                    </Link>
                  </CardTitle>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{item.summary}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-primary/20 bg-white/60 p-10 text-center text-muted-foreground">
              {t("news.empty")}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader
          title={t("events.title")}
          description={
            activeCampus
              ? t("events.descriptionActive", { campusName: activeCampus.name })
              : t("events.descriptionDefault")
          }
          href="/events"
          linkLabel={t("events.cta")}
        />
        {spotlightEvents.length ? (
          <ScrollArea>
            <div className="flex gap-4 pb-4">
              {spotlightEvents.map((event) => (
                <Card key={event.$id} className="min-w-[260px] max-w-sm flex-1 border border-primary/10 bg-white/90 shadow-md transition hover:-translate-y-1 hover:shadow-card-hover">
                  <CardContent className="space-y-3 p-6">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDateReadable(event.start_date)}</span>
                      <span className="rounded-full bg-secondary-10 px-2 py-1 text-secondary-100">
                        {campusLookup[event.campus] ?? commonT("labels.organisation")}
                      </span>
                    </div>
                    <CardTitle className="text-lg text-primary-100">
                      <Link href={`/events/${event.$id}`} className="hover:underline">
                        {event.title}
                      </Link>
                    </CardTitle>
                    <p className="line-clamp-3 text-sm text-muted-foreground">{event.description}</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={`/events/${event.$id}`}>{commonT("buttons.viewDetails")}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="h-2" />
          </ScrollArea>
        ) : (
          <div className="rounded-2xl border border-dashed border-primary/20 bg-white/60 p-10 text-center text-muted-foreground">
            {t("events.empty")}
          </div>
        )}
      </section>

      <section className="space-y-8">
        <SectionHeader
          title={t("jobs.title")}
          description={t("jobs.description")}
          href="/jobs"
          linkLabel={t("jobs.cta")}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {spotlightJobs.length ? (
            spotlightJobs.map((job) => (
              <Card key={job.$id} className="flex h-full flex-col justify-between border border-primary/10 bg-white/90 shadow-md transition hover:-translate-y-1 hover:shadow-card-hover">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-primary-30">
                      {campusLookup[job.campus] ?? commonT("labels.organisation")}
                    </span>
                    <span>
                      {job.application_deadline
                        ? t("jobs.deadline", { date: formatDateReadable(job.application_deadline) })
                        : t("jobs.rolling")}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-semibold text-primary-100">
                    <Link href={`/jobs/${job.slug}`} className="hover:underline">
                      {job.title}
                    </Link>
                  </CardTitle>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {job.description?.replace(/<[^>]+>/g, "").slice(0, 160)}
                    {job.description && job.description.length > 160 ? "…" : ""}
                  </p>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/jobs/${job.slug}`}>{commonT("buttons.readMore")}</Link>
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-primary/20 bg-white/60 p-10 text-center text-muted-foreground">
              {t("jobs.empty")}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader
          title={t("shop.title")}
          description={t("shop.description")}
          href="/shop"
          linkLabel={t("shop.cta")}
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {spotlightProducts.length ? (
            spotlightProducts.map((product) => (
              <Card key={product.$id} className="group overflow-hidden border border-primary/10 bg-white/90 shadow-md transition hover:-translate-y-1 hover:shadow-card-hover">
                {product.images?.[0] ? (
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <CardContent className="space-y-2 p-6">
                  <CardTitle className="text-lg font-semibold text-primary-100">
                    {product.slug ? (
                      <Link href={`/shop/${product.slug}`} className="hover:underline">
                        {product.name}
                      </Link>
                    ) : (
                      product.name
                    )}
                  </CardTitle>
                  {product.description ? (
                    <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                  ) : null}
                  {typeof product.price === "number" ? (
                    <div className="text-base font-semibold text-primary-40">
                      {t("shop.price", { value: product.price.toFixed(2) })}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-primary/20 bg-white/60 p-10 text-center text-muted-foreground">
              {t("shop.empty")}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
