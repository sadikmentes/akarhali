"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Service } from "@/types";

const serviceFormSchema = z.object({
  slug: z.string().min(2),
  titleTr: z.string().min(2),
  titleEn: z.string().optional(),
  descriptionTr: z.string().optional(),
  descriptionEn: z.string().optional(),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;
type ServiceFormInput = z.input<typeof serviceFormSchema>;

export function ServiceFormDialog({
  open,
  onOpenChange,
  editingService,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingService?: Service | null;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
}) {
  const form = useForm<ServiceFormInput, unknown, ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      slug: "",
      titleTr: "",
      titleEn: "",
      descriptionTr: "",
      descriptionEn: "",
      order: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        editingService
          ? {
              slug: editingService.slug,
              titleTr: editingService.titleTr,
              titleEn: editingService.titleEn,
              descriptionTr: editingService.descriptionTr ?? "",
              descriptionEn: editingService.descriptionEn ?? "",
              order: editingService.order,
              isActive: editingService.isActive,
            }
          : { slug: "", titleTr: "", titleEn: "", descriptionTr: "", descriptionEn: "", order: 0, isActive: true }
      );
    }
  }, [open, editingService, form]);

  async function handleSubmit(values: ServiceFormValues) {
    await onSubmit({
      ...values,
      titleEn: values.titleTr,
      descriptionEn: values.descriptionTr,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingService ? "Hizmeti Düzenle" : "Yeni Hizmet"}</DialogTitle>
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
                    <Input placeholder="hali-yikama" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="titleTr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Başlık</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descriptionTr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
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
