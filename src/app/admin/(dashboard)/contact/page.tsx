import { ContactInfoForm } from "@/components/admin/contact-info-form";
import { settingsService } from "@/services/settings.service";

export const metadata = { title: "İletişim Bilgileri" };

export default async function AdminContactPage() {
  const [contact, social] = await Promise.all([
    settingsService.getContact(),
    settingsService.getSocial(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">İletişim Bilgileri</h1>
        <p className="text-muted-foreground">
          Telefon, adres, çalışma saatleri ve sosyal medya bağlantılarını yönetin.
        </p>
      </div>
      <ContactInfoForm contact={contact} social={social} />
    </div>
  );
}
