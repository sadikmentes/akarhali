"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SiteSettings } from "@/types";

type FormValues = {
  heroTitleTr: string;
  heroSubtitleTr: string;
  aboutTitleTr: string;
  aboutContentTr: string;
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

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      heroTitleTr: site.heroTitleTr ?? "",
      heroSubtitleTr: site.heroSubtitleTr ?? "",
      aboutTitleTr: site.aboutTitleTr ?? "",
      aboutContentTr: site.aboutContentTr ?? "",
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
