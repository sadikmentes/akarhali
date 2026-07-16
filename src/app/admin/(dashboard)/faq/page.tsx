import { FaqManager } from "@/components/admin/faq-manager";
import { faqRepository } from "@/repositories/misc.repository";

export const metadata = { title: "Sık Sorulan Sorular" };

export default async function AdminFaqPage() {
  const faqs = await faqRepository.findAll();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sık Sorulan Sorular</h1>
        <p className="text-muted-foreground">SSS sayfasındaki soruları yönetin.</p>
      </div>
      <FaqManager faqs={faqs} />
    </div>
  );
}
