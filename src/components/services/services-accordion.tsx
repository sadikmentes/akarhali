"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ServiceWithChildren } from "@/types";

export function ServicesAccordion({ services }: { services: ServiceWithChildren[] }) {
  return (
    <Accordion className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {services.map((service) => {
        const hasChildren = service.children.length > 0;
        return (
          <AccordionItem
            key={service.id}
            value={service.id}
            className="h-fit rounded-2xl border border-border/70 bg-card shadow-sm transition-colors hover:border-primary/60"
          >
            <AccordionTrigger className="items-center gap-3 px-4 py-4 hover:no-underline sm:px-5">
              {/* min-h: açıklaması olmayan hizmet de bir satırlık açıklama kadar
                  yer kaplasın, böylece kartlar aynı boyda görünür. */}
              <span className="flex min-h-11 min-w-0 flex-col justify-center">
                <span className="truncate text-base font-semibold text-foreground">
                  {service.titleTr}
                </span>
                {service.descriptionTr && (
                  <span className="line-clamp-1 text-sm font-normal text-muted-foreground">
                    {service.descriptionTr}
                  </span>
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-5">
              {hasChildren ? (
                <div className="grid grid-cols-1 gap-2.5">
                  {service.children.map((child) => (
                    <div
                      key={child.id}
                      className="rounded-xl border border-border/70 bg-background/60 p-3"
                    >
                      <p className="font-medium text-foreground">{child.titleTr}</p>
                      {child.descriptionTr && (
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {child.descriptionTr}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Detaylı bilgi ve fiyat için bizimle iletişime geçebilirsiniz.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
