"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { PriceFormDialog } from "@/components/admin/price-form-dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { PriceInput } from "@/lib/validations/price.schema";
import type { Category, PriceWithRelations, Service } from "@/types";

export function PricesManager({
  prices,
  services,
  categories,
}: {
  prices: PriceWithRelations[];
  services: Service[];
  categories: Category[];
}) {
  const [items, setItems] = useState(prices);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<PriceWithRelations | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PriceWithRelations | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setItems(prices);
  }, [prices]);

  async function handleSubmit(values: PriceInput) {
    const url = editingPrice ? `/api/prices/${editingPrice.id}` : "/api/prices";
    const method = editingPrice ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      toast.error(json.error ?? "Bir hata oluştu");
      return;
    }
    toast.success(editingPrice ? "Fiyat güncellendi" : "Fiyat eklendi");
    setItems((current) =>
      editingPrice
        ? current.map((price) => (price.id === json.data.id ? json.data : price))
        : [json.data, ...current]
    );
  }

  async function handleToggleCampaign(price: PriceWithRelations, checked: boolean) {
    const res = await fetch(`/api/prices/${price.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCampaignActive: checked }),
    });
    if (!res.ok) {
      toast.error("Güncellenemedi");
      return;
    }
    toast.success("Kampanya durumu güncellendi");
    const json = await res.json();
    setItems((current) => current.map((item) => (item.id === price.id ? json.data : item)));
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await fetch(`/api/prices/${deleteTarget.id}`, { method: "DELETE" });
    setIsDeleting(false);
    if (!res.ok) {
      toast.error("Silinemedi");
      return;
    }
    toast.success("Fiyat silindi");
    setItems((current) => current.filter((price) => price.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingPrice(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="size-4" />
          Yeni Fiyat
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hizmet</TableHead>
              <TableHead>Ad</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead>Kampanya</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((price) => (
              <TableRow key={price.id}>
                <TableCell>{price.service.titleTr}</TableCell>
                <TableCell>{price.nameTr}</TableCell>
                <TableCell>{price.category?.nameTr ?? "-"}</TableCell>
                <TableCell>
                  {price.discountPrice ? (
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground line-through">
                        {Number(price.basePrice)}₺
                      </span>
                      <span className="font-semibold text-primary">
                        {Number(price.discountPrice)}₺
                      </span>
                    </span>
                  ) : (
                    <span>{Number(price.basePrice)}₺</span>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={price.isCampaignActive}
                    onCheckedChange={(checked) => handleToggleCampaign(price, checked)}
                  />
                </TableCell>
                <TableCell>
                  <Badge variant={price.isActive ? "default" : "secondary"}>
                    {price.isActive ? "Aktif" : "Pasif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Düzenle"
                    onClick={() => {
                      setEditingPrice(price);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Sil"
                    onClick={() => setDeleteTarget(price)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {items.length === 0 && (
          <p className="p-8 text-center text-muted-foreground">Henüz fiyat eklenmedi.</p>
        )}
      </div>

      <PriceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        services={services}
        categories={categories}
        editingPrice={editingPrice}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Fiyatı sil"
        description={`"${deleteTarget?.nameTr}" fiyatını silmek istediğinize emin misiniz?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
