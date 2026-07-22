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
import type { ContactInfo, SocialLinks } from "@/types";

type FormValues = {
  phone: string;
  phone2: string;
  whatsapp: string;
  email: string;
  addressTr: string;
  workingHoursTr: string;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
};

export function ContactInfoForm({
  contact,
  social,
}: {
  contact: ContactInfo;
  social: SocialLinks;
}) {
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      phone: contact.phone ?? "",
      phone2: contact.phone2 ?? "",
      whatsapp: contact.whatsapp ?? "",
      email: contact.email ?? "",
      addressTr: contact.addressTr ?? "",
      workingHoursTr: contact.workingHoursTr ?? "",
      instagram: social.instagram ?? "",
      facebook: social.facebook ?? "",
      youtube: social.youtube ?? "",
      tiktok: social.tiktok ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSaving(true);
    const [contactRes, socialRes] = await Promise.all([
      fetch("/api/settings/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: values.phone,
          phone2: values.phone2,
          whatsapp: values.whatsapp,
          email: values.email,
          addressTr: values.addressTr,
          addressEn: values.addressTr,
          workingHoursTr: values.workingHoursTr,
          workingHoursEn: values.workingHoursTr,
        }),
      }),
      fetch("/api/settings/social", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instagram: values.instagram,
          facebook: values.facebook,
          whatsapp: values.whatsapp,
          youtube: values.youtube,
          tiktok: values.tiktok,
        }),
      }),
    ]);
    setIsSaving(false);

    if (!contactRes.ok || !socialRes.ok) {
      toast.error("Kaydedilemedi");
      return;
    }
    toast.success("İletişim bilgileri kaydedildi");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>İletişim Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Telefon 1</Label>
            <Input placeholder="+90 555 000 00 00" {...register("phone")} />
          </div>
          <div className="space-y-2">
            <Label>Telefon 2 (opsiyonel)</Label>
            <Input placeholder="+90 555 000 00 01" {...register("phone2")} />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp Numarası</Label>
            <Input placeholder="+905550000000" {...register("whatsapp")} />
          </div>
          <div className="space-y-2">
            <Label>E-posta</Label>
            <Input type="email" {...register("email")} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Adres</Label>
            <Textarea rows={2} {...register("addressTr")} />
          </div>
          <div className="space-y-2">
            <Label>Çalışma Saatleri</Label>
            <Input {...register("workingHoursTr")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sosyal Medya</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Instagram URL</Label>
            <Input placeholder="https://instagram.com/..." {...register("instagram")} />
          </div>
          <div className="space-y-2">
            <Label>Facebook URL</Label>
            <Input placeholder="https://facebook.com/..." {...register("facebook")} />
          </div>
          <div className="space-y-2">
            <Label>Youtube URL</Label>
            <Input placeholder="https://youtube.com/..." {...register("youtube")} />
          </div>
          <div className="space-y-2">
            <Label>TikTok URL</Label>
            <Input placeholder="https://tiktok.com/..." {...register("tiktok")} />
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
