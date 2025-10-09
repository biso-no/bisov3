"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, CalendarDays, MapPin, Newspaper, Ticket, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SelectCampus } from "@/components/select-campus";
import { useCampus } from "@/components/context/campus";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, formatDateReadable } from "@/lib/utils";

import type { EventWithTranslations } from "@/lib/types/event";
import type { JobWithTranslations } from "@/lib/types/job";
import type { NewsItemWithTranslations } from "@/lib/types/news";
import type { ProductWithTranslations } from "@/lib/types/product";
import { useTranslations, useFormatter } from "next-intl";

type HomePageClientProps = {
  events: EventWithTranslations[];
  news: NewsItemWithTranslations[];
  jobs: JobWithTranslations[];
  products: ProductWithTranslations[];
};

const SectionHeader = ({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div className="space-y-2">
      {eyebrow ? (
        <Badge variant="outline" className="w-max rounded-full border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-50">
          {eyebrow}
        </Badge>
      ) : null}
      <div className="space-y-1.5">
        <h2 className="font-heading text-2xl font-semibold text-primary-100 lg:text-3xl">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground lg:text-base">{description}</p>
        ) : null}
      </div>
    </div>
    {href && linkLabel ? (
      <Button asChild variant="ghost" size="sm" className="group h-10 gap-2 rounded-full border border-primary/10 px-4 text-primary-40 hover:bg-primary/5">
        <Link href={href} className="flex items-center gap-2">
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    ) : null}
  </div>
);

const StatPill = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col gap-1 rounded-2xl border border-white/15 bg-white/15 px-4 py-3 text-left shadow-card-soft backdrop-blur-sm">
    <div className="text-2xl font-semibold text-white drop-shadow">{value}</div>
    <div className="text-[11px] uppercase tracking-[0.16em] text-white/70">{label}</div>
  </div>
);

export const HomePageClient = ({ events, news, jobs, products }: HomePageClientProps) => {
  const { campuses, activeCampus, activeCampusId } = useCampus();
  const t = useTranslations("home");
  const commonT = useTranslations("common");
  const format = useFormatter();
  const campusLookup = useMemo(() => {
    return campuses.reduce<Record<string, string>>((acc, campus) => {
      acc[campus.$id] = campus.name;
      return acc;
    }, {});
  }, [campuses]);

  const eventsForCampus = useMemo(() => {
    if (!activeCampusId) return events;
    return events.filter((event) => event.campus_id === activeCampusId);
  }, [events, activeCampusId]);

  const jobsForCampus = useMemo(() => {
    if (!activeCampusId) return jobs;
    return jobs.filter((job) => job.campus_id === activeCampusId);
  }, [jobs, activeCampusId]);

  const newsForCampus = useMemo(() => {
    if (!activeCampusId) return news;
    return news.filter((newsItem) => newsItem.campus_id === activeCampusId);
  }, [news, activeCampusId]);

  const productsForCampus = useMemo(() => {
    if (!activeCampusId) return products;
    return products.filter((product) => product.campus_id === activeCampusId);
  }, [products, activeCampusId]);

  const heroStats = useMemo(() => {
    return [
      { label: t("hero.stats.campuses"), value: campuses.length || "—" },
      { label: t("hero.stats.events"), value: eventsForCampus.length || "—" },
      { label: t("hero.stats.jobs"), value: jobsForCampus.length || "—" },
    ];
  }, [campuses.length, eventsForCampus.length, jobsForCampus.length, t]);

  const spotlightProducts = useMemo(() => productsForCampus.slice(0, 3), [productsForCampus]);
  const spotlightNews = useMemo(() => newsForCampus.slice(0, 3), [newsForCampus]);
  const spotlightEvents = useMemo(() => eventsForCampus.slice(0, 6), [eventsForCampus]);
  const spotlightJobs = useMemo(() => jobsForCampus.slice(0, 6), [jobsForCampus]);

  const heroHighlights = useMemo(() => {
    const highlights: { id: string; title: string; subtitle: string; href: string; icon: LucideIcon; badge: string }[] = [];

    const featuredEvent = spotlightEvents[0];
    if (featuredEvent) {
      highlights.push({
        id: `event-${featuredEvent.$id}`,
        title: featuredEvent.title,
        subtitle: featuredEvent.start_date
          ? format.dateTime(new Date(featuredEvent.start_date), { dateStyle: "medium" })
          : "Dato kommer",
        href: `/events/${featuredEvent.$id}`,
        icon: CalendarDays,
        badge: t("events.title"),
      });
    }

    const featuredJob = spotlightJobs[0];
    if (featuredJob) {
      highlights.push({
        id: `job-${featuredJob.$id}`,
        title: featuredJob.title,
        subtitle:
          featuredJob.campus_id && campusLookup[featuredJob.campus_id]
            ? campusLookup[featuredJob.campus_id]
            : commonT("labels.organisation"),
        href: `/jobs/${featuredJob.slug}`,
        icon: Briefcase,
        badge: t("jobs.title"),
      });
    }

    const featuredNews = spotlightNews[0];
    if (featuredNews) {
      highlights.push({
        id: `news-${featuredNews.$id}`,
        title: featuredNews.title,
        subtitle: format.dateTime(new Date(featuredNews.$createdAt), { dateStyle: "medium" }),
        href: `/news/${featuredNews.$id}`,
        icon: Newspaper,
        badge: t("news.titleDefault"),
      });
    }

    return highlights.slice(0, 3);
  }, [spotlightEvents, spotlightJobs, spotlightNews, format, t, campusLookup, commonT]);

  const quickLinkItems = useMemo(
    () => [
      {
        title: t("quickLinks.units.title"),
        description: t("quickLinks.units.description"),
        href: "/units",
        cta: t("quickLinks.units.cta"),
        icon: Users,
      },
      {
        title: t("quickLinks.highlights.title"),
        description: t("quickLinks.highlights.description"),
        href: "/events",
        cta: t("quickLinks.highlights.cta"),
        icon: CalendarDays,
      },
      {
        title: t("quickLinks.roles.title"),
        description: t("quickLinks.roles.description"),
        href: "/jobs",
        cta: t("quickLinks.roles.cta"),
        icon: Briefcase,
      },
      {
        title: t("quickLinks.benefits.title"),
        description: t("quickLinks.benefits.description"),
        href: "/shop",
        cta: t("quickLinks.benefits.cta"),
        icon: Ticket,
      },
    ],
    [t]
  );

  const heroSubtitle = activeCampus
    ? t("hero.subtitleActive", { campusName: activeCampus.name })
    : t("hero.subtitleDefault");

  return (
    <div className="space-y-20 text-primary-100">
      <section className="relative overflow-hidden rounded-[36px] bg-brand-hero text-white shadow-glow-blue">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(61,169,224,0.35),transparent_55%)]" />
        <div className="noise-overlay relative grid gap-10 px-6 py-12 md:px-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:py-16 xl:px-14">
          <div className="space-y-6">
            <Badge variant="gradient" className="w-max rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
              BISO Universe
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-2xl font-heading text-3xl font-semibold leading-tight text-white drop-shadow md:text-5xl">
                {activeCampus
                  ? t("hero.titleActive", { campusName: activeCampus.name })
                  : t("hero.titleDefault")}
              </h1>
              <p className="max-w-2xl text-base text-white/80 md:text-lg">{heroSubtitle}</p>
              {activeCampus ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]">
                  <MapPin className="h-4 w-4" />
                  {activeCampus.name}
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-white px-6 text-primary-100 hover:bg-white/90">
                <Link href="/membership">{commonT("buttons.becomeMember")}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-full border border-white/40 bg-transparent px-6 text-white hover:bg-white/15"
              >
                <Link href="/events">{t("hero.primaryCtaSecondary")}</Link>
              </Button>
            </div>
            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <StatPill key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
          </div>

          <div className="relative flex flex-col gap-4 rounded-[28px] border border-white/20 bg-white/10 p-5 shadow-card-soft backdrop-blur">
            <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-white/20 bg-primary-90/60">
              <Image
                src={
                  spotlightEvents[0]?.image ||
                  spotlightNews[0]?.image ||
                  "/images/placeholder.jpg"
                }
                alt={t("hero.imageAlt")}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-100/80 via-primary-90/5 to-transparent" />
              <div className="absolute bottom-4 left-4 flex flex-col gap-1">
                <span className="text-xs uppercase tracking-[0.16em] text-white/70">
                  {t("hero.promo.tagline")}
                </span>
                <p className="text-lg font-semibold text-white">{t("hero.promo.headline")}</p>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-white/15">
              {heroHighlights.length ? (
                heroHighlights.map((highlight) => (
                  <Link
                    key={highlight.id}
                    href={highlight.href}
                    className="group flex items-center justify-between gap-4 py-3 text-white/90 transition hover:text-white"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                        <highlight.icon className="h-5 w-5" />
                      </span>
                      <div className="space-y-0.5">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/70">{highlight.badge}</p>
                        <p className="text-sm font-semibold leading-tight">{highlight.title}</p>
                        <p className="text-xs text-white/70">{highlight.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                ))
              ) : (
                <div className="py-4 text-sm text-white/80">{t("hero.promo.tagline")}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickLinkItems.map((item, index) => (
          <Card
            key={item.title}
            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-primary/10 bg-white/90 p-6 shadow-card-soft transition hover:-translate-y-1.5 hover:shadow-card-hover"
          >
            <div className="pointer-events-none absolute inset-x-6 top-0 h-1 rounded-b-full bg-gradient-to-r from-blue-accent via-gold-default to-blue-accent opacity-0 transition group-hover:opacity-100" />
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary-40">
                <item.icon className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="rounded-full border-primary/10 bg-primary/5 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-primary-50">
                {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </Badge>
            </div>
            <div className="space-y-2 pt-6">
              <CardTitle className="text-lg font-semibold text-primary-100">{item.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <Button asChild variant="link" className="flex items-center gap-1 px-0 text-primary-30">
              <Link href={item.href}>
                {item.cta}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
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
            spotlightNews.map((item) => {
              const summary = item.content?.replace(/<[^>]+>/g, "").slice(0, 160) ?? "";
              const campusName = campusLookup[item.campus_id] ?? commonT("labels.organisation");
              return (
                <Card
                  key={item.$id}
                  className="group overflow-hidden rounded-[28px] border border-primary/10 bg-white/95 shadow-card-soft transition hover:-translate-y-1 hover:shadow-card-hover"
                >
                  {item.image ? (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
                        <MapPin className="h-3.5 w-3.5" />
                        {campusName}
                      </div>
                    </div>
                  ) : null}
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-primary-40">
                      <span>{format.dateTime(new Date(item.$createdAt), { dateStyle: "medium" })}</span>
                      <Badge variant="outline" className="rounded-full border-primary/15 bg-primary/5 px-2 py-0.5">
                        {t("news.titleDefault")}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-semibold text-primary-100">
                        <Link href={`/news/${item.$id}`} className="hover:underline">
                          {item.title}
                        </Link>
                      </CardTitle>
                      {summary ? <p className="line-clamp-3 text-sm text-muted-foreground">{summary}{item.content && item.content.length > 160 ? "…" : ""}</p> : null}
                    </div>
                    <Button asChild variant="ghost" size="sm" className="group flex w-full items-center justify-between rounded-full border border-primary/10 px-4 py-2 text-primary-50 hover:bg-primary/5">
                      <Link href={`/news/${item.$id}`}>
                        {commonT("buttons.readMore")}
                        <ArrowRight className="ml-2 inline-block h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })
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
              {spotlightEvents.map((event) => {
                const campusName = campusLookup[event.campus_id] ?? commonT("labels.organisation");
                return (
                  <Card
                    key={event.$id}
                    className="group flex min-w-[270px] max-w-sm flex-1 flex-col justify-between rounded-[26px] border border-primary/10 bg-white/95 p-5 shadow-card-soft transition hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-primary-50">
                        <span>
                          {event.start_date
                            ? format.dateTime(new Date(event.start_date), { dateStyle: "medium" })
                            : "Dato kommer"}
                        </span>
                        <Badge variant="outline" className="rounded-full border-primary/15 bg-primary/5 px-2 py-0.5">
                          {campusName}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-semibold text-primary-100">
                        <Link href={`/events/${event.$id}`} className="hover:underline">
                          {event.title}
                        </Link>
                      </CardTitle>
                      {event.description ? (
                        <p className="line-clamp-3 text-sm text-muted-foreground">{event.description}</p>
                      ) : null}
                    </div>
                    <Button asChild variant="ghost" size="sm" className="mt-4 inline-flex w-full items-center justify-between rounded-full border border-primary/10 px-4 text-primary-50 hover:bg-primary/5">
                      <Link href={`/events/${event.$id}`}>
                        {commonT("buttons.viewDetails")}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </Card>
                );
              })}
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
            spotlightJobs.map((job) => {
              const description = job.description?.replace(/<[^>]+>/g, "").slice(0, 160) ?? "";
              const campusName = campusLookup[job.campus_id] ?? commonT("labels.organisation");
              return (
                <Card
                  key={job.$id}
                  className="flex h-full flex-col justify-between rounded-[28px] border border-primary/10 bg-white/95 shadow-card-soft transition hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-primary-50">
                      <Badge variant="outline" className="rounded-full border-primary/15 bg-primary/5 px-2 py-0.5">
                        {campusName}
                      </Badge>
                      <span className="rounded-full bg-primary/5 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-50">
                        {job.application_deadline
                          ? t("jobs.deadline", { date: format.dateTime(new Date(job.application_deadline), { dateStyle: "medium" }) })
                          : t("jobs.rolling")}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-semibold text-primary-100">
                      <Link href={`/jobs/${job.slug}`} className="hover:underline">
                        {job.title}
                      </Link>
                    </CardTitle>
                    {description ? (
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {description}
                        {job.description && job.description.length > 160 ? "…" : ""}
                      </p>
                    ) : null}
                  </CardContent>
                  <div className="px-6 pb-6">
                    <Button asChild variant="ghost" className="flex w-full items-center justify-between rounded-full border border-primary/10 px-4 py-2 text-primary-50 hover:bg-primary/5">
                      <Link href={`/jobs/${job.slug}`}>
                        {commonT("buttons.readMore")}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })
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
            spotlightProducts.map((product) => {
              const imageSrc = product.image || product.images?.[0];
              return (
                <Card
                  key={product.$id}
                  className="group overflow-hidden rounded-[28px] border border-primary/10 bg-white/95 shadow-card-soft transition hover:-translate-y-1 hover:shadow-card-hover"
                >
                  {imageSrc ? (
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={product.title || product.slug}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-4 bottom-4 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                        <Ticket className="h-3.5 w-3.5" />
                        BISO Shop
                      </div>
                    </div>
                  ) : null}
                  <CardContent className="space-y-3 p-6">
                    <CardTitle className="text-lg font-semibold text-primary-100">
                      {product.slug ? (
                        <Link href={`/shop/${product.slug}`} className="hover:underline">
                          {product.title || product.slug}
                        </Link>
                      ) : (
                        product.title || "Untitled Product"
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
              );
            })
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
