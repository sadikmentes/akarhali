"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceFormDialog } from "@/components/admin/service-form-dialog";
import { MainServiceFormDialog } from "@/components/admin/main-service-form-dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { Service } from "@/types";

export function ServicesManager({ services }: { services: Service[] }) {
  const [items, setItems] = useState(services);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mainDialogOpen, setMainDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setItems(services);
  }, [services]);

  const mainServices = useMemo(
    () => items.filter((s) => !s.parentId).sort((a, b) => a.order - b.order),
    [items]
  );
  const childrenByParent = useMemo(() => {
    const map = new Map<string, Service[]>();
    for (const s of items) {
      if (!s.parentId) continue;
      const list = map.get(s.parentId) ?? [];
      list.push(s);
      map.set(s.parentId, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.order - b.order);
    return map;
  }, [items]);

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
        ? current.map((service) => (service.id === json.data.id ? json.data : service))
        : [...current, json.data]
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
    // A deleted main service takes its sub-services with it (DB cascade).
    setItems((current) =>
      current.filter((s) => s.id !== deleteTarget.id && s.parentId !== deleteTarget.id)
    );
    setDeleteTarget(null);
  }

  function openCreateMain() {
    setEditingService(null);
    setMainDialogOpen(true);
  }

  function openCreate(parentId: string) {
    setEditingService(null);
    setDefaultParentId(parentId);
    setDialogOpen(true);
  }

  function openEdit(service: Service) {
    setEditingService(service);
    setDefaultParentId(null);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreateMain}>
          <Plus className="size-4" />
          Yeni Ana Hizmet
        </Button>
      </div>

      <div className="space-y-3">
        {mainServices.map((service) => {
          const subs = childrenByParent.get(service.id) ?? [];
          return (
            <div key={service.id} className="overflow-hidden rounded-xl border bg-card">
              <div className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold">{service.titleTr}</span>
                    <Badge variant={service.isActive ? "default" : "secondary"}>
                      {service.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                  {service.descriptionTr && (
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {service.descriptionTr}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openCreate(service.id)}
                  >
                    <Plus className="size-4" />
                    Alt Hizmet
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Düzenle" onClick={() => openEdit(service)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Sil" onClick={() => setDeleteTarget(service)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>

              {subs.length > 0 && (
                <div className="divide-y border-t bg-muted/30">
                  {subs.map((sub) => (
                    <div key={sub.id} className="flex items-center gap-3 py-2.5 pr-3 pl-6">
                      <CornerDownRight className="size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">{sub.titleTr}</span>
                          {!sub.isActive && <Badge variant="secondary">Pasif</Badge>}
                        </div>
                        {sub.descriptionTr && (
                          <p className="truncate text-xs text-muted-foreground">{sub.descriptionTr}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button variant="ghost" size="icon" aria-label="Düzenle" onClick={() => openEdit(sub)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Sil" onClick={() => setDeleteTarget(sub)}>
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {mainServices.length === 0 && (
        <p className="rounded-xl border p-8 text-center text-muted-foreground">
          Henüz hizmet eklenmedi.
        </p>
      )}

      <MainServiceFormDialog
        open={mainDialogOpen}
        onOpenChange={setMainDialogOpen}
        allServices={items}
        onSubmit={handleSubmit}
      />

      <ServiceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingService={editingService}
        mainServices={mainServices}
        allServices={items}
        defaultParentId={defaultParentId}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hizmeti sil"
        description={
          deleteTarget && !deleteTarget.parentId && (childrenByParent.get(deleteTarget.id)?.length ?? 0) > 0
            ? `"${deleteTarget?.titleTr}" ana hizmetini ve tüm alt hizmetlerini silmek istediğinize emin misiniz?`
            : `"${deleteTarget?.titleTr}" hizmetini silmek istediğinize emin misiniz?`
        }
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
