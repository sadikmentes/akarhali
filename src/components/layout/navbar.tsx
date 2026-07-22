"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import NextLink from "next/link";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, Phone, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NAV_ITEMS, SITE_CONFIG } from "@/constants/site";
import { cn, telHref } from "@/lib/utils";

export function Navbar({ phone }: { phone?: string | null }) {
  const t = useTranslations("nav");
  const tCta = useTranslations("cta");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const telUrl = telHref(phone);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60 dark:bg-background/72 dark:supports-backdrop-filter:bg-background/65">
      <nav
        aria-label="Ana navigasyon"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link href="/" className="flex items-center" aria-label={SITE_CONFIG.name}>
          <Image
            src="/akar-logo.png"
            alt={SITE_CONFIG.name}
            width={150}
            height={64}
            priority
            className="h-11 w-auto object-contain"
          />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive ? "text-primary" : "text-foreground/80"
                  )}
                >
                  {t(item.key)}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label={tCta("adminLogin")}
            title={tCta("adminLogin")}
          >
            <NextLink href="/admin/login">
              <LogIn className="size-5" />
            </NextLink>
          </Button>
          {telUrl && (
            <Button asChild className="ml-1 hidden sm:inline-flex">
              <a href={telUrl}>
                <Phone className="size-4" />
                {tCta("call")}
              </a>
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menüyü aç">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigasyon Menüsü</SheetTitle>
              <div className="mt-10 flex flex-col gap-1 px-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-accent",
                      pathname === item.href ? "text-primary" : "text-foreground/80"
                    )}
                  >
                    {t(item.key)}
                  </Link>
                ))}
                {telUrl && (
                  <Button asChild className="mt-4">
                    <a href={telUrl}>
                      <Phone className="size-4" />
                      {tCta("call")}
                    </a>
                  </Button>
                )}
                <Button asChild variant="outline" className="mt-1">
                  <NextLink href="/admin/login" onClick={() => setOpen(false)}>
                    <LogIn className="size-4" />
                    {tCta("adminLogin")}
                  </NextLink>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
