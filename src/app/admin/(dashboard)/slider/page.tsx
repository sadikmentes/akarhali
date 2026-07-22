import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { HeroSliderManager } from "@/components/admin/hero-slider-manager";
import { heroSlideService } from "@/services/hero-slide.service";

export const metadata = { title: "Ana Sayfa Slaytı" };

export default async function AdminSliderPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const slides = await heroSlideService.list();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ana Sayfa Slaytı</h1>
        <p className="text-muted-foreground">
          Ana sayfanın üstündeki büyük slayt (slider) görsellerini yükleyin ve yönetin.
        </p>
      </div>
      <HeroSliderManager slides={slides} />
    </div>
  );
}
