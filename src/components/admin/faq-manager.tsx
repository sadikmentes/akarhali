"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  faqSchema,
  type FaqInput,
  type FaqFormInput,
} from "@/lib/validations/content.schema";
import type { Faq } from "@/types";

export function FaqManager({ faqs }: { faqs: Faq[] }) {
  const [items, setItems] = useState(faqs);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<FaqFormInput, unknown, FaqInput>({
    resolver: zodResolver(faqSchema),
    defaultValues: { questionTr: "", questionEn: "", answerTr: "", answerEn: "", order: 0, isActive: true },
  });

  useEffect(() => {
    setItems(faqs);
  }, [faqs]);

  useEffect(() => {
    if (dialogOpen) {
      form.reset(
        editing
          ? {
              questionTr: editing.questionTr,
              questionEn: editing.questionEn,
              answerTr: editing.answerTr,
              answerEn: editing.answerEn,
              order: editing.order,
              isActive: editing.isActive,
            }
          : { questionTr: "", questionEn: "", answerTr: "", answerEn: "", order: 0, isActive: true }
      );
    }
  }, [dialogOpen, editing, form]);

  async function onSubmit(values: FaqInput) {
    // New questions are appended to the end automatically; no manual ordering.
    const payload = editing
      ? values
      : { ...values, order: items.reduce((max, faq) => Math.max(max, faq.order), 0) + 1 };
    const url = editing ? `/api/faqs/${editing.id}` : "/api/faqs";
    const res = await fetch(url, {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.error ?? "Bir hata oluştu");
      return;
    }
    toast.success(editing ? "Soru güncellendi" : "Soru eklendi");
    setItems((current) =>
      editing
        ? current
            .map((faq) => (faq.id === json.data.id ? json.data : faq))
            .sort((a, b) => a.order - b.order)
        : [...current, json.data].sort((a, b) => a.order - b.order)
    );
    setDialogOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await fetch(`/api/faqs/${deleteTarget.id}`, { method: "DELETE" });
    setIsDeleting(false);
    if (!res.ok) {
      toast.error("Silinemedi");
      return;
    }
    toast.success("Soru silindi");
    setItems((current) => current.filter((faq) => faq.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="size-4" />
          Yeni Soru
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Soru (TR)</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="max-w-md">{faq.questionTr}</TableCell>
                <TableCell>
                  <Badge variant={faq.isActive ? "default" : "secondary"}>
                    {faq.isActive ? "Aktif" : "Pasif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Düzenle"
                    onClick={() => {
                      setEditing(faq);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Sil"
                    onClick={() => setDeleteTarget(faq)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {items.length === 0 && (
          <p className="p-8 text-center text-muted-foreground">Henüz soru eklenmedi.</p>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Soruyu Düzenle" : "Yeni Soru"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="questionTr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soru</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answerTr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cevap</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between rounded-lg border p-3">
                <FormLabel className="mb-0">Aktif</FormLabel>
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
                  Kaydet
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Soruyu sil"
        description="Bu soruyu silmek istediğinize emin misiniz?"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
