"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Save, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/image-uploader";
import { FEATURES_DEFAULTS, PROCESS_DEFAULTS } from "@/constants/home-content";
import type { SiteSettings } from "@/types";

type FormValues = {
  heroTitleTr: string;
  heroSubtitleTr: string;
  heroVideoUrl: string;
  aboutTitleTr: string;
  aboutContentTr: string;
  aboutImage: string;
  featuresTitleTr: string;
  featuresSubtitleTr: string;
  feature1TitleTr: string;
  feature1DescTr: string;
  feature2TitleTr: string;
  feature2DescTr: string;
  feature3TitleTr: string;
  feature3DescTr: string;
  feature4TitleTr: string;
  feature4DescTr: string;
  processTitleTr: string;
  processSubtitleTr: string;
  process1TitleTr: string;
  process1DescTr: string;
  process2TitleTr: string;
  process2DescTr: string;
  process3TitleTr: string;
  process3DescTr: string;
  process4TitleTr: string;
  process4DescTr: string;
  statsYearsExp: number;
  statsHappyClients: number;
  statsProjectsDone: number;
  statsTeamMembers: number;
  mapLatitude: number | "";
  mapLongitude: number | "";
  mapEmbedUrl: string;
};

export function SiteContentForm({ site }: { site: SiteSettings }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      heroTitleTr: site.heroTitleTr ?? "",
      heroSubtitleTr: site.heroSubtitleTr ?? "",
      heroVideoUrl: site.heroVideoUrl ?? "",
      aboutTitleTr: site.aboutTitleTr ?? "",
      aboutContentTr: site.aboutContentTr ?? "",
      aboutImage: site.aboutImage ?? "",
      featuresTitleTr: site.featuresTitleTr ?? "",
      featuresSubtitleTr: site.featuresSubtitleTr ?? "",
      feature1TitleTr: site.feature1TitleTr ?? "",
      feature1DescTr: site.feature1DescTr ?? "",
      feature2TitleTr: site.feature2TitleTr ?? "",
      feature2DescTr: site.feature2DescTr ?? "",
      feature3TitleTr: site.feature3TitleTr ?? "",
      feature3DescTr: site.feature3DescTr ?? "",
      feature4TitleTr: site.feature4TitleTr ?? "",
      feature4DescTr: site.feature4DescTr ?? "",
      processTitleTr: site.processTitleTr ?? "",
      processSubtitleTr: site.processSubtitleTr ?? "",
      process1TitleTr: site.process1TitleTr ?? "",
      process1DescTr: site.process1DescTr ?? "",
      process2TitleTr: site.process2TitleTr ?? "",
      process2DescTr: site.process2DescTr ?? "",
      process3TitleTr: site.process3TitleTr ?? "",
      process3DescTr: site.process3DescTr ?? "",
      process4TitleTr: site.process4TitleTr ?? "",
      process4DescTr: site.process4DescTr ?? "",
      statsYearsExp: site.statsYearsExp ?? 0,
      statsHappyClients: site.statsHappyClients ?? 0,
      statsProjectsDone: site.statsProjectsDone ?? 0,
      statsTeamMembers: site.statsTeamMembers ?? 0,
      mapLatitude: site.mapLatitude ?? "",
      mapLongitude: site.mapLongitude ?? "",
      mapEmbedUrl: site.mapEmbedUrl ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSaving(true);
    const res = await fetch("/api/settings/site", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        heroTitleEn: values.heroTitleTr,
        heroSubtitleEn: values.heroSubtitleTr,
        aboutTitleEn: values.aboutTitleTr,
        aboutContentEn: values.aboutContentTr,
        statsYearsExp: Number(values.statsYearsExp),
        statsHappyClients: Number(values.statsHappyClients),
        statsProjectsDone: Number(values.statsProjectsDone),
        statsTeamMembers: Number(values.statsTeamMembers),
        mapLatitude: values.mapLatitude === "" ? null : Number(values.mapLatitude),
        mapLongitude: values.mapLongitude === "" ? null : Number(values.mapLongitude),
      }),
    });
    setIsSaving(false);
    if (!res.ok) {
      toast.error("Kaydedilemedi");
      return;
    }
    toast.success("İçerik kaydedildi");
  }

  async function handleVideoUpload(file: File | undefined) {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "videos");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error ?? "Video yüklenemedi");
        return;
      }
      setValue("heroVideoUrl", json.data.url, { shouldDirty: true });
      toast.success("Video yüklendi. Değişikliği kalıcı yapmak için Kaydet'e basın.");
    } catch {
      toast.error("Video yüklenemedi");
    } finally {
      setIsUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  }

  const heroVideoUrl = watch("heroVideoUrl");
  const aboutImage = watch("aboutImage");
  const isLocalVideo = heroVideoUrl?.startsWith("/uploads/");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Anasayfa Hero</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label>Başlık</Label>
            <Textarea rows={2} {...register("heroTitleTr")} />
          </div>
          <div className="space-y-2">
            <Label>Alt Başlık</Label>
            <Textarea rows={2} {...register("heroSubtitleTr")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Anasayfa Tanıtım Videosu</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label>Video Yükle (kendi cihazınızdan)</Label>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                onClick={() => videoInputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <UploadCloud className="size-4" />
                )}
                {isUploading ? "Yükleniyor..." : "Video Seç ve Yükle"}
              </Button>
              {heroVideoUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setValue("heroVideoUrl", "", { shouldDirty: true })}
                >
                  <X className="size-4" />
                  Videoyu Kaldır
                </Button>
              )}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={(e) => handleVideoUpload(e.target.files?.[0])}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              MP4 veya WEBM — maks. 100MB. Yükledikten sonra <strong>Kaydet</strong>&apos;e basmayı unutmayın.
            </p>
          </div>

          <div className="space-y-2">
            <Label>veya Video Bağlantısı (YouTube / .mp4 URL)</Label>
            <Input
              placeholder="https://www.youtube.com/watch?v=... veya https://.../video.mp4"
              {...register("heroVideoUrl")}
            />
            <p className="text-xs text-muted-foreground">
              Boş bırakırsanız anasayfada video bölümü gösterilmez.
            </p>
          </div>

          {isLocalVideo && (
            <div className="space-y-2">
              <Label>Önizleme</Label>
              <video
                key={heroVideoUrl}
                src={heroVideoUrl}
                controls
                className="w-full max-w-md rounded-lg border"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hakkımızda</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label>Başlık</Label>
            <Input {...register("aboutTitleTr")} />
          </div>
          <div className="space-y-2">
            <Label>İçerik</Label>
            <Textarea rows={5} {...register("aboutContentTr")} />
          </div>
          <div className="space-y-2">
            <Label>Görsel</Label>
            {aboutImage ? (
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative aspect-4/3 w-48 overflow-hidden rounded-lg border">
                  <Image src={aboutImage} alt="Hakkımızda görseli" fill className="object-cover" unoptimized />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setValue("aboutImage", "", { shouldDirty: true })}
                >
                  <X className="size-4" />
                  Görseli Kaldır
                </Button>
              </div>
            ) : (
              <ImageUploader
                folder="about"
                onUploaded={(imgs) =>
                  imgs[0] && setValue("aboutImage", imgs[0].url, { shouldDirty: true })
                }
              />
            )}
            <p className="text-xs text-muted-foreground">
              Hakkımızda metninin yanında gösterilir. Kutuyu tam dolduracak şekilde
              kırpılır; en iyi sonuç için yatay (4:3) bir görsel yükleyin. Yükledikten
              sonra <strong>Kaydet</strong>&apos;e basmayı unutmayın.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Neden Akar Halı? (Özellikler)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Bölüm Başlığı</Label>
              <Input placeholder={FEATURES_DEFAULTS.title} {...register("featuresTitleTr")} />
            </div>
            <div className="space-y-2">
              <Label>Bölüm Alt Başlığı</Label>
              <Input placeholder={FEATURES_DEFAULTS.subtitle} {...register("featuresSubtitleTr")} />
            </div>
          </div>
          {([1, 2, 3, 4] as const).map((n) => (
            <div key={n} className="grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{n}. Özellik Başlığı</Label>
                <Input
                  placeholder={FEATURES_DEFAULTS.items[n - 1].title}
                  {...register(`feature${n}TitleTr` as "feature1TitleTr")}
                />
              </div>
              <div className="space-y-2">
                <Label>{n}. Özellik Açıklaması</Label>
                <Textarea
                  rows={2}
                  placeholder={FEATURES_DEFAULTS.items[n - 1].desc}
                  {...register(`feature${n}DescTr` as "feature1DescTr")}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Alanı boş bırakırsanız o metin için varsayılan yazı kullanılır. İkonlar sabittir.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Çalışma Sürecimiz (Adımlar)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Bölüm Başlığı</Label>
              <Input placeholder={PROCESS_DEFAULTS.title} {...register("processTitleTr")} />
            </div>
            <div className="space-y-2">
              <Label>Bölüm Alt Başlığı</Label>
              <Input placeholder={PROCESS_DEFAULTS.subtitle} {...register("processSubtitleTr")} />
            </div>
          </div>
          {([1, 2, 3, 4] as const).map((n) => (
            <div key={n} className="grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{n}. Adım Başlığı</Label>
                <Input
                  placeholder={PROCESS_DEFAULTS.items[n - 1].title}
                  {...register(`process${n}TitleTr` as "process1TitleTr")}
                />
              </div>
              <div className="space-y-2">
                <Label>{n}. Adım Açıklaması</Label>
                <Textarea
                  rows={2}
                  placeholder={PROCESS_DEFAULTS.items[n - 1].desc}
                  {...register(`process${n}DescTr` as "process1DescTr")}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Alanı boş bırakırsanız o metin için varsayılan yazı kullanılır. İkonlar sabittir.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>İstatistikler</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Yıllık Tecrübe</Label>
            <Input type="number" {...register("statsYearsExp")} />
          </div>
          <div className="space-y-2">
            <Label>Mutlu Müşteri</Label>
            <Input type="number" {...register("statsHappyClients")} />
          </div>
          <div className="space-y-2">
            <Label>Tamamlanan İş</Label>
            <Input type="number" {...register("statsProjectsDone")} />
          </div>
          <div className="space-y-2">
            <Label>Uzman Personel</Label>
            <Input type="number" {...register("statsTeamMembers")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Google Harita</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Enlem (Latitude)</Label>
            <Input type="number" step="any" {...register("mapLatitude")} />
          </div>
          <div className="space-y-2">
            <Label>Boylam (Longitude)</Label>
            <Input type="number" step="any" {...register("mapLongitude")} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Özel Embed URL (opsiyonel)</Label>
            <Input placeholder="https://www.google.com/maps/embed?..." {...register("mapEmbedUrl")} />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSaving} size="lg">
        {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        Kaydet
      </Button>
    </form>
  );
}
