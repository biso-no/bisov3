"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, Search } from "lucide-react";

import { getNavItems } from "@/lib/actions/main/actions";
import { SelectCampus } from "@/components/select-campus";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Models } from "node-appwrite";

type NavDocument = Models.Document & {
  title: string;
  path?: string;
  url?: string;
  children?: NavDocument[];
};

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
  return item.path || item.url || "/";
};

const isExternalLink = (href: string) => href.startsWith("http");

export const Header = ({ editMode }: { editMode: boolean }) => {
  const pathname = (usePathname() || "/").replace("/edit", "");
  const [navItems, setNavItems] = useState<NavDocument[]>([]);
  const [loadingNav, setLoadingNav] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchNav = async () => {
      try {
        setLoadingNav(true);
        const response = await getNavItems();
        if (!isMounted) return;
        setNavItems(Array.isArray(response) ? response as NavDocument[] : []);
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
  }, []);

  const desktopNav = useMemo(() => navItems.slice(0, 8), [navItems]);

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
            />
            <Link
              href="#"
              className="text-xs font-medium text-white/80 transition hover:text-white"
            >
              NO / EN
            </Link>
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
                const external = isExternalLink(href);
                const active =
                  !external &&
                  href !== "#" &&
                  (pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)));

                const linkClass = "relative text-sm font-semibold tracking-wide transition-colors duration-200";

                const content = (
                  <span
                    className={[
                      linkClass,
                      active ? "text-primary-40" : "text-primary-80 hover:text-primary-40",
                    ].join(" ")}
                  >
                    {item.title}
                    <span
                      className={[
                        "absolute left-0 top-full mt-1 h-0.5 w-full origin-left scale-x-0 bg-primary-40 transition-transform duration-200",
                        active ? "scale-x-100" : "group-hover:scale-x-100",
                      ].join(" ")}
                    />
                  </span>
                );

                if (external) {
                  return (
                    <a
                      key={item.$id}
                      href={href}
                      className="group"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <Link key={item.$id} href={href} className="group">
                    {content}
                  </Link>
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
                  <SelectCampus className="border-primary/20 bg-white" />
                  <div className="flex flex-col gap-3">
                    {loadingNav ? (
                      Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton key={index} className="h-10 w-full rounded-full bg-primary/10" />
                      ))
                    ) : (
                      navItems.map((item) => {
                        const href = deriveHref(item, editMode);
                        const external = isExternalLink(href);

                        const linkClasses = "text-base font-semibold text-primary-80 transition hover:text-primary-40";

                        if (external) {
                          return (
                            <a
                              key={item.$id}
                              href={href}
                              className={linkClasses}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {item.title}
                            </a>
                          );
                        }

                        return (
                          <Link key={item.$id} href={href} className={linkClasses}>
                            {item.title}
                          </Link>
                        );
                      })
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

