"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ServiceFormDialog } from "@/components/admin/service-form-dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { Service } from "@/types";

export function ServicesManager({ services }: { services: Service[] }) {
  const [items, setItems] = useState(services);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setItems(services);
  }, [services]);

  async function handleSubmit(values: Record<string, unknown>) {
    const url = editingService ? `/api/services/${editingService.id}` : "/api/services";
    const method = editingService ? "PATCH" : "POST";
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
    toast.success(editingService ? "Hizmet güncellendi" : "Hizmet eklendi");
    setItems((current) =>
      editingService
        ? current
            .map((service) => (service.id === json.data.id ? json.data : service))
            .sort((a, b) => a.order - b.order)
        : [...current, json.data].sort((a, b) => a.order - b.order)
    );
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await fetch(`/api/services/${deleteTarget.id}`, { method: "DELETE" });
    setIsDeleting(false);
    if (!res.ok) {
      toast.error("Silinemedi");
      return;
    }
    toast.success("Hizmet silindi");
    setItems((current) => current.filter((service) => service.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingService(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="size-4" />
          Yeni Hizmet
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.titleTr}</TableCell>
                <TableCell className="text-muted-foreground">{service.slug}</TableCell>
                <TableCell>
                  <Badge variant={service.isActive ? "default" : "secondary"}>
                    {service.isActive ? "Aktif" : "Pasif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Düzenle"
                    onClick={() => {
                      setEditingService(service);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Sil"
                    onClick={() => setDeleteTarget(service)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {items.length === 0 && (
          <p className="p-8 text-center text-muted-foreground">Henüz hizmet eklenmedi.</p>
        )}
      </div>

      <ServiceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingService={editingService}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hizmeti sil"
        description={`"${deleteTarget?.titleTr}" hizmetini silmek istediğinize emin misiniz?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
