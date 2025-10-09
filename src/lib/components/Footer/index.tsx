import Link from "next/link";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FooterLinkProps = {
  children: ReactNode;
  href?: string;
};

const isExternalHref = (href: string) => /^https?:\/\//.test(href);

const FooterLink = ({ children, href }: FooterLinkProps) => {
  const baseClasses =
    "text-sm text-primary-20 transition hover:text-white/90 hover:underline underline-offset-4";

  if (!href) {
    return (
      <li>
        <span className={baseClasses}>{children}</span>
      </li>
    );
  }

  if (href && isExternalHref(href)) {
    return (
      <li>
        <a href={href} target="_blank" rel="noreferrer" className={baseClasses}>
          {children}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    </li>
  );
};

const FooterList = ({ children, title }: { children: ReactNode; title: string }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-secondary-20">{title}</h3>
      <ul className="space-y-2 text-sm text-primary-20">{children}</ul>
    </div>
  );
};

interface FooterProps {
  children: ReactNode;
  className?: string;
}

const Footer = ({ children, className }: FooterProps) => {
  const madeByString = (
    <>
      💻 with ❤️ by{" "}
      <Link href="https://github.com/MHeien" target="_blank" className="font-semibold text-secondary-20 hover:text-white">
        Markus Heien
      </Link>
    </>
  );

  return (
    <footer className={cn("relative isolate overflow-hidden bg-primary-100 text-white", className)}>
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(61,169,224,0.2),transparent_55%)]" />
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(247,214,74,0.15),transparent_50%)]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{children}</div>
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-5 shadow-[0_25px_45px_-30px_rgba(0,0,0,0.5)] backdrop-blur-lg sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-secondary-40">Fellesskap for studenter</p>
            <p className="text-base font-medium text-white">
              Samler og styrker studentengasjementet på tvers av norske campuser.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white">
            <span className="inline-flex h-2 w-2 rounded-full bg-secondary-100" />
            BISO • Student Union of Norway
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-4 text-sm text-primary-10/80 sm:flex-row sm:items-center">
          <span className="text-primary-10/90">{madeByString}</span>
          <span className="text-primary-10/60">Org nr. 913 589 367 • Besøk oss i lokalene ved BI campus</span>
        </div>
      </div>
    </footer>
  );
};

Footer.List = FooterList;
Footer.Link = FooterLink;

export { Footer };
