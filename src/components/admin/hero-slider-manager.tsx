"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ImageUploader, type UploadedImage } from "@/components/admin/image-uploader";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { HeroSlide } from "@/types";

export function HeroSliderManager({ slides }: { slides: HeroSlide[] }) {
  const [items, setItems] = useState(slides);
  const [deleteTarget, setDeleteTarget] = useState<HeroSlide | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleUploaded(uploaded: UploadedImage[]) {
    for (const img of uploaded) {
      const res = await fetch("/api/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: img.url,
          publicId: img.publicId,
          order: items.length,
          isActive: true,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error ?? "Görsel eklenemedi");
        continue;
      }
      setItems((current) => [...current, json.data]);
    }
    toast.success("Slayt görseli eklendi");
  }

  async function toggleActive(slide: HeroSlide, isActive: boolean) {
    setItems((current) =>
      current.map((s) => (s.id === slide.id ? { ...s, isActive } : s))
    );
    const res = await fetch(`/api/hero-slides/${slide.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    if (!res.ok) {
      toast.error("Güncellenemedi");
      setItems((current) =>
        current.map((s) => (s.id === slide.id ? { ...s, isActive: !isActive } : s))
      );
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await fetch(`/api/hero-slides/${deleteTarget.id}`, { method: "DELETE" });
    setIsDeleting(false);
    if (!res.ok) {
      toast.error("Silinemedi");
      return;
    }
    toast.success("Slayt silindi");
    setItems((current) => current.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  const activeCount = items.filter((s) => s.isActive).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Yeni Slayt Görseli Yükle</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader folder="slider" multiple onUploaded={handleUploaded} />
          <p className="mt-3 text-sm text-muted-foreground">
            Bu görseller ana sayfanın üst kısmındaki büyük slayt (slider) alanında sırayla
            gösterilir. En iyi sonuç için geniş (yatay) ve yüksek çözünürlüklü görseller kullanın.
          </p>
        </CardContent>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Slayt Görselleri</h2>
          <span className="text-sm text-muted-foreground">
            {items.length} görsel · {activeCount} aktif
          </span>
        </div>

        {items.length === 0 ? (
          <p className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
            Henüz slayt görseli eklenmedi. Eklemezseniz ana sayfada varsayılan görseller gösterilir.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((slide, index) => (
              <div
                key={slide.id}
                className="overflow-hidden rounded-xl border bg-card shadow-sm"
              >
                <div className="relative aspect-video">
                  <Image
                    src={slide.url}
                    alt={slide.titleTr ?? `Slayt ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
                    <GripVertical className="size-3.5" />
                    {index + 1}. sıra
                  </span>
                  <button
                    type="button"
                    aria-label="Slaytı sil"
                    onClick={() => setDeleteTarget(slide)}
                    className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-sm font-medium">
                    {slide.isActive ? "Aktif" : "Pasif"}
                  </span>
                  <Switch
                    checked={slide.isActive}
                    onCheckedChange={(checked) => toggleActive(slide, checked)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Slaytı sil"
        description="Bu slayt görselini silmek istediğinize emin misiniz?"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
