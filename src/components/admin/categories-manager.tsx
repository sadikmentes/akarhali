"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { CategoryInput } from "@/lib/validations/price.schema";
import type { Category } from "@/types";

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const [items, setItems] = useState(categories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setItems(categories);
  }, [categories]);

  async function handleSubmit(values: CategoryInput) {
    const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
    const method = editingCategory ? "PATCH" : "POST";
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
    toast.success(editingCategory ? "Kategori güncellendi" : "Kategori eklendi");
    setItems((current) =>
      editingCategory
        ? current.map((category) => (category.id === json.data.id ? json.data : category))
        : [...current, json.data].sort((a, b) => a.order - b.order)
    );
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await fetch(`/api/categories/${deleteTarget.id}`, { method: "DELETE" });
    setIsDeleting(false);
    if (!res.ok) {
      toast.error("Silinemedi");
      return;
    }
    toast.success("Kategori silindi");
    setItems((current) => current.filter((category) => category.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingCategory(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="size-4" />
          Yeni Kategori
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.nameTr}</TableCell>
                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Düzenle"
                    onClick={() => {
                      setEditingCategory(category);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Sil"
                    onClick={() => setDeleteTarget(category)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {items.length === 0 && (
          <p className="p-8 text-center text-muted-foreground">Henüz kategori eklenmedi.</p>
        )}
      </div>

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingCategory={editingCategory}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Kategoriyi sil"
        description={`"${deleteTarget?.nameTr}" kategorisini silmek istediğinize emin misiniz?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
