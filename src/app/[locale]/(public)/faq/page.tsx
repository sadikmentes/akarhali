import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { faqRepository } from "@/repositories/misc.repository";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("faq");
  return { title: t("title"), description: t("subtitle") };
}

export default async function FaqPage() {
  const t = await getTranslations("faq");
  const faqs = await faqRepository.findActive();

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <Container className="max-w-3xl">
        <Accordion multiple={false} className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left">
                {faq.questionTr}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answerTr}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {faqs.length === 0 && (
          <p className="text-center text-muted-foreground">Henüz soru eklenmedi.</p>
        )}
      </Container>
    </>
  );
}
