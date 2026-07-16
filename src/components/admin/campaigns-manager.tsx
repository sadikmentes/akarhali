"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { format } from "date-fns";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CampaignFormDialog } from "@/components/admin/campaign-form-dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { CampaignInput } from "@/lib/validations/campaign.schema";
import type { Campaign } from "@/types";

export function CampaignsManager({ campaigns }: { campaigns: Campaign[] }) {
  const [items, setItems] = useState(campaigns);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setItems(campaigns);
  }, [campaigns]);

  async function handleSubmit(values: CampaignInput) {
    const url = editingCampaign ? `/api/campaigns/${editingCampaign.id}` : "/api/campaigns";
    const method = editingCampaign ? "PATCH" : "POST";
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
    toast.success(editingCampaign ? "Kampanya güncellendi" : "Kampanya eklendi");
    setItems((current) =>
      editingCampaign
        ? current.map((campaign) => (campaign.id === json.data.id ? json.data : campaign))
        : [json.data, ...current]
    );
  }

  async function handleToggleActive(campaign: Campaign, checked: boolean) {
    const res = await fetch(`/api/campaigns/${campaign.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: checked }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error("Güncellenemedi");
      return;
    }
    toast.success("Durum güncellendi");
    setItems((current) =>
      current.map((item) => (item.id === campaign.id ? json.data : item))
    );
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await fetch(`/api/campaigns/${deleteTarget.id}`, { method: "DELETE" });
    setIsDeleting(false);
    if (!res.ok) {
      toast.error("Silinemedi");
      return;
    }
    toast.success("Kampanya silindi");
    setItems((current) => current.filter((campaign) => campaign.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingCampaign(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="size-4" />
          Yeni Kampanya
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-xl border bg-card">
            <div className="relative aspect-video">
              <Image src={c.image} alt={c.titleTr} fill className="object-cover" />
              <span className="absolute top-2 right-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                %{c.discountPercent}
              </span>
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{c.titleTr}</h3>
                <Badge variant={c.isActive ? "default" : "secondary"}>
                  {c.isActive ? "Aktif" : "Pasif"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {format(new Date(c.startDate), "d MMM yyyy")} — {format(new Date(c.endDate), "d MMM yyyy")}
              </p>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Aktif</span>
                  <Switch
                    checked={c.isActive}
                    onCheckedChange={(checked) => handleToggleActive(c, checked)}
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Düzenle"
                    onClick={() => {
                      setEditingCampaign(c);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Sil"
                    onClick={() => setDeleteTarget(c)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <p className="rounded-xl border p-8 text-center text-muted-foreground">
          Henüz kampanya eklenmedi.
        </p>
      )}

      <CampaignFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingCampaign={editingCampaign}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Kampanyayı sil"
        description={`"${deleteTarget?.titleTr}" kampanyasını silmek istediğinize emin misiniz?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
