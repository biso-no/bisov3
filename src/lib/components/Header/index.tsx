"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { ChevronDown, Menu, Phone, Search } from "lucide-react";
import { getCampuses } from "@/app/actions/campus";

import { getNavItems, type NavTreeItem } from "@/lib/actions/main/actions";
import { SelectCampus } from "@/components/select-campus";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Campus } from "@/lib/types/campus";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SUPPORTED_LOCALES, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

type NavDocument = NavTreeItem;

const QuickActionLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="text-xs font-medium text-white/80 transition hover:text-white"
  >
    {label}
  </Link>
);

const deriveHref = (item: NavDocument, editMode: boolean) => {
  if (editMode) return "#";
  return item.href || item.path || item.url || "/";
};

const isExternalLink = (item: NavDocument) => {
  if (typeof item.isExternal === "boolean") {
    return item.isExternal;
  }
  const candidate = item.href || item.url || "";
  return candidate.startsWith("http");
};

export const Header = ({ editMode }: { editMode: boolean }) => {
  const pathname = (usePathname() || "/").replace("/edit", "");
  const localeFromHook = useLocale();
  const resolvedLocale = useMemo<Locale>(() => {
    const candidate = localeFromHook as Locale;
    return SUPPORTED_LOCALES.includes(candidate) ? candidate : "no";
  }, [localeFromHook]);
  const [navItems, setNavItems] = useState<NavDocument[]>([]);
  const [loadingNav, setLoadingNav] = useState(true);
  const [campuses, setCampuses] = useState<Campus[]>([]);

  useEffect(() => {
    const fetchCampuses = async () => {
      const response = await getCampuses();
      setCampuses(response);
    };
    fetchCampuses();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchNav = async () => {
      try {
        setLoadingNav(true);
        const response = await getNavItems(resolvedLocale);
        if (!isMounted) return;
        setNavItems(
          Array.isArray(response?.items) ? (response.items as NavDocument[]) : []
        );
      } catch (error) {
        console.error("Failed to fetch navigation", error);
        if (isMounted) {
          setNavItems([]);
        }
      } finally {
        if (isMounted) {
          setLoadingNav(false);
        }
      }
    };

    fetchNav();
    return () => {
      isMounted = false;
    };
  }, [resolvedLocale]);

  const desktopNav = useMemo(() => navItems.slice(0, 8), [navItems]);

  const matchPathname = useCallback(
    (href: string | undefined, external: boolean) => {
      if (!href || href === "#" || external) return false;
      if (href === "/") {
        return pathname === "/";
      }
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname]
  );

  const isItemActive = (item: NavDocument): boolean => {
    const activeSelf = matchPathname(deriveHref(item, editMode), isExternalLink(item));
    if (activeSelf) return true;
    return item.children.some((child) => isItemActive(child));
  };

  const renderDesktopChildLinks = (children: NavDocument[], depth = 0) => (
    <div className="flex flex-col gap-1">
      {children.map((child) => {
        const href = deriveHref(child, editMode);
        const external = isExternalLink(child);
        const active = isItemActive(child);
        const hasNested = child.children.length > 0;

        const linkClasses = cn(
          "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-primary/10 text-primary-50"
            : "text-primary-80 hover:bg-primary/5 hover:text-primary-40"
        );

        const linkLabel = (
          <span className="flex items-center gap-2">
            {child.title}
            {hasNested && <ChevronDown className="h-3 w-3 opacity-60" />}
          </span>
        );

        const linkNode = external ? (
          <a key={child.id} href={href} className={linkClasses} target="_blank" rel="noreferrer">
            {linkLabel}
          </a>
        ) : (
          <Link key={child.id} href={href} className={linkClasses}>
            {linkLabel}
          </Link>
        );

        return (
          <div key={child.id} className="flex flex-col gap-1">
            {linkNode}
            {hasNested && (
              <div className="ml-3 border-l border-primary/10 pl-3">
                {renderDesktopChildLinks(child.children, depth + 1)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const indentClass = (depth: number) => {
    if (depth <= 0) return "";
    if (depth === 1) return "pl-4";
    if (depth === 2) return "pl-6";
    return "pl-8";
  };

  const renderMobileChildLinks = (children: NavDocument[], depth = 0) => (
    <div className="flex flex-col gap-2">
      {children.map((child) => {
        const href = deriveHref(child, editMode);
        const external = isExternalLink(child);
        const active = isItemActive(child);
        const hasNested = child.children.length > 0;
        const linkClasses = cn(
          "text-sm font-medium text-primary-80 transition hover:text-primary-40",
          active && "text-primary-50"
        );

        const linkNode = external ? (
          <a href={href} className={linkClasses} target="_blank" rel="noreferrer">
            {child.title}
          </a>
        ) : (
          <Link href={href} className={linkClasses}>
            {child.title}
          </Link>
        );

        return (
          <div key={child.id} className={cn("flex flex-col gap-2", indentClass(depth))}>
            {linkNode}
            {hasNested && (
              <div className="pl-3 border-l border-primary/10">
                {renderMobileChildLinks(child.children, depth + 1)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 shadow-sm backdrop-blur">
      <div className="hidden border-b border-white/10 bg-primary-100/95 text-white lg:block">
        <div className="container flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <QuickActionLink href="/membership" label="Bli medlem" />
            <QuickActionLink href="/jobs" label="Søk verv" />
            <QuickActionLink href="/partners" label="Book samarbeid" />
            <QuickActionLink href="/safety" label="Varsling" />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden h-8 gap-2 border-white/20 text-xs text-white/80 hover:bg-white/10 hover:text-white xl:flex"
            >
              <Search className="h-3.5 w-3.5" />
              Søk
            </Button>
            <SelectCampus
              placeholder="Velg campus"
              className="h-9 w-48 border-white/30 bg-white/10 text-left text-white"
              campuses={campuses}
            />
            <LocaleSwitcher
              variant="ghost"
              size="sm"
              className="h-9 w-48 border-white/30 bg-white/10 text-left text-white"
            />
          </div>
        </div>
      </div>

      <div className="border-b border-primary/10 bg-white/90">
        <div className="container flex items-center justify-between gap-4 px-4 py-4 lg:gap-8">
          <div className="flex items-center gap-3 lg:gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo-home.png"
                alt="BISO logo"
                width={148}
                height={38}
                priority
              />
            </Link>
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
            {loadingNav ? (
              <div className="flex items-center gap-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-6 w-16 rounded-full bg-primary/10" />
                ))}
              </div>
            ) : (
              desktopNav.map((item) => {
                const href = deriveHref(item, editMode);
                const external = isExternalLink(item);
                const active = isItemActive(item);
                const hasChildren = item.children.length > 0;

                const linkContent = (
                  <span
                    className={cn(
                      "relative flex items-center gap-1 text-sm font-semibold tracking-wide transition-colors duration-200",
                      active ? "text-primary-40" : "text-primary-80 hover:text-primary-40"
                    )}
                  >
                    {item.title}
                    {hasChildren && <ChevronDown className="h-3 w-3 opacity-70" />}
                    <span
                      className={cn(
                        "absolute left-0 top-full mt-1 h-0.5 w-full origin-left scale-x-0 bg-primary-40 transition-transform duration-200",
                        active ? "scale-x-100" : "group-hover:scale-x-100"
                      )}
                    />
                  </span>
                );

                const linkNode = external ? (
                  <a href={href} className="group flex items-center" target="_blank" rel="noreferrer">
                    {linkContent}
                  </a>
                ) : (
                  <Link href={href} className="group flex items-center">
                    {linkContent}
                  </Link>
                );

                return (
                  <div key={item.id} className="group relative">
                    {linkNode}
                    {hasChildren && (
                      <div className="invisible absolute left-1/2 top-full z-40 mt-3 w-64 -translate-x-1/2 rounded-xl border border-primary/10 bg-white/95 p-4 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                        {renderDesktopChildLinks(item.children)}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden border-primary/20 text-primary-80 hover:border-primary-30 hover:text-primary-40 lg:flex"
            >
              <Link href="/contact" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Kontakt
              </Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 lg:hidden">
                  <Menu className="h-5 w-5 text-primary-100" />
                  <span className="sr-only">Åpne meny</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm border-l border-primary/10 bg-white/95">
                <div className="flex flex-col gap-6 pt-12">
                  <SelectCampus className="border-primary/20 bg-white" campuses={campuses} />
                  <div className="flex flex-col gap-3">
                    {loadingNav ? (
                      Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton key={index} className="h-10 w-full rounded-full bg-primary/10" />
                      ))
                    ) : (
                      <Accordion type="multiple" className="w-full space-y-2">
                        {navItems.map((item) => {
                          const href = deriveHref(item, editMode);
                          const external = isExternalLink(item);
                          const hasChildren = item.children.length > 0;
                          const active = isItemActive(item);

                          const linkClasses = cn(
                            "flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-semibold text-primary-80 transition hover:bg-primary/5 hover:text-primary-40",
                            active && "text-primary-50"
                          );

                          if (!hasChildren) {
                            return (
                              <div key={item.id} className="w-full">
                                {external ? (
                                  <a href={href} className={linkClasses} target="_blank" rel="noreferrer">
                                    {item.title}
                                  </a>
                                ) : (
                                  <Link href={href} className={linkClasses}>
                                    {item.title}
                                  </Link>
                                )}
                              </div>
                            );
                          }

                          return (
                            <AccordionItem key={item.id} value={item.id} className="border-b border-primary/10">
                              <AccordionTrigger
                                className={cn(
                                  linkClasses,
                                  "pl-0 pr-2 text-left font-semibold data-[state=open]:text-primary-40"
                                )}
                              >
                                <span className="flex-1 text-left">{item.title}</span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="flex flex-col gap-2 pb-2 pt-1">
                                  {renderMobileChildLinks(item.children, 1)}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 border-t border-primary/10 pt-4">
                    <Link href="/membership" className="text-sm font-medium text-primary-70">
                      Bli medlem
                    </Link>
                    <Link href="/jobs" className="text-sm font-medium text-primary-70">
                      Søk verv
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-primary-70">
                      Kontakt oss
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
