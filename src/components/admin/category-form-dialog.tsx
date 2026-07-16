"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  categorySchema,
  type CategoryInput,
  type CategoryFormInput,
} from "@/lib/validations/price.schema";
import type { Category } from "@/types";

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory?: Category | null;
  onSubmit: (values: CategoryInput) => Promise<void>;
};

export function CategoryFormDialog({
  open,
  onOpenChange,
  editingCategory,
  onSubmit,
}: CategoryFormDialogProps) {
  const form = useForm<CategoryFormInput, unknown, CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { slug: "", nameTr: "", nameEn: "", order: 0 },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        editingCategory
          ? {
              slug: editingCategory.slug,
              nameTr: editingCategory.nameTr,
              nameEn: editingCategory.nameEn,
              order: editingCategory.order,
            }
          : { slug: "", nameTr: "", nameEn: "", order: 0 }
      );
    }
  }, [open, editingCategory, form]);

  async function handleSubmit(values: CategoryInput) {
    await onSubmit(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="makine-hali" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nameTr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sıra</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value as number} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
  );
}
