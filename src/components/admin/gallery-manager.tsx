"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader, type UploadedImage } from "@/components/admin/image-uploader";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { GALLERY_CATEGORIES } from "@/constants/site";
import type { GalleryImage } from "@/types";

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const [items, setItems] = useState(images);
  const [uploadCategory, setUploadCategory] = useState<string>("CARPET");
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setItems(images);
  }, [images]);

  async function handleUploaded(uploaded: UploadedImage[]) {
    const createdImages: GalleryImage[] = [];
    for (const img of uploaded) {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...img, category: uploadCategory }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error("Görsel kaydedilemedi");
        continue;
      }
      createdImages.push(json.data);
    }
    toast.success("Görseller eklendi");
    setItems((current) => [...createdImages, ...current]);
  }

  async function handleCategoryChange(image: GalleryImage, category: string) {
    const res = await fetch(`/api/gallery/${image.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error("Güncellenemedi");
      return;
    }
    toast.success("Kategori güncellendi");
    setItems((current) => current.map((item) => (item.id === image.id ? json.data : item)));
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await fetch(`/api/gallery/${deleteTarget.id}`, { method: "DELETE" });
    setIsDeleting(false);
    if (!res.ok) {
      toast.error("Silinemedi");
      return;
    }
    toast.success("Görsel silindi");
    setItems((current) => current.filter((image) => image.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold">Yeni Görsel Yükle</h2>
          <Select
            value={uploadCategory}
            onValueChange={(value) => value && setUploadCategory(value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GALLERY_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.labelTr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ImageUploader folder="gallery" multiple onUploaded={handleUploaded} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((img) => (
          <div key={img.id} className="overflow-hidden rounded-xl border bg-card">
            <div className="relative aspect-square">
              <Image src={img.url} alt={img.titleTr ?? "Galeri"} fill className="object-cover" />
              <button
                onClick={() => setDeleteTarget(img)}
                aria-label="Görseli sil"
                className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
            <div className="p-2">
              <Select
                value={img.category}
                onValueChange={(value) => value && handleCategoryChange(img, value)}
              >
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GALLERY_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.labelTr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <p className="rounded-xl border p-8 text-center text-muted-foreground">
          Henüz görsel eklenmedi.
        </p>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Görseli sil"
        description="Bu görseli silmek istediğinize emin misiniz?"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
