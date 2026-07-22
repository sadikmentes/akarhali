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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Service } from "@/types";

const NO_PARENT = "none";

const serviceFormSchema = z.object({
  titleTr: z.string().min(2),
  titleEn: z.string().optional(),
  descriptionTr: z.string().optional(),
  descriptionEn: z.string().optional(),
  image: z.string().optional().nullable(),
  parentId: z.string().default(NO_PARENT),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

// Turkish-aware slug generator: the slug is derived from the title so the admin
// never has to type it. Turkish
// letters are mapped before toLowerCase() to avoid the dotted/dotless-I pitfall.
function slugify(value: string): string {
  return value
    .trim()
    .replace(/[İIı]/g, "i")
    .replace(/[Çç]/g, "c")
    .replace(/[Ğğ]/g, "g")
    .replace(/[Öö]/g, "o")
    .replace(/[Şş]/g, "s")
    .replace(/[Üü]/g, "u")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type ServiceFormValues = z.infer<typeof serviceFormSchema>;
type ServiceFormInput = z.input<typeof serviceFormSchema>;

export function ServiceFormDialog({
  open,
  onOpenChange,
  editingService,
  mainServices,
  defaultParentId,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingService?: Service | null;
  mainServices: Service[];
  defaultParentId?: string | null;
  onSubmit: (
    values: Omit<ServiceFormValues, "parentId"> & { slug: string; parentId: string | null }
  ) => Promise<void>;
}) {
  const form = useForm<ServiceFormInput, unknown, ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      titleTr: "",
      titleEn: "",
      descriptionTr: "",
      descriptionEn: "",
      image: "",
      parentId: NO_PARENT,
      order: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        editingService
          ? {
              titleTr: editingService.titleTr,
              titleEn: editingService.titleEn,
              descriptionTr: editingService.descriptionTr ?? "",
              descriptionEn: editingService.descriptionEn ?? "",
              image: editingService.image ?? "",
              parentId: editingService.parentId ?? NO_PARENT,
              order: editingService.order,
              isActive: editingService.isActive,
            }
          : {
              titleTr: "",
              titleEn: "",
              descriptionTr: "",
              descriptionEn: "",
              image: "",
              parentId: defaultParentId ?? NO_PARENT,
              order: 0,
              isActive: true,
            }
      );
    }
  }, [open, editingService, defaultParentId, form]);

  // A service can be a parent only if it is itself a main service; exclude the
  // service currently being edited so it cannot become its own parent.
  const parentOptions = mainServices.filter((s) => s.id !== editingService?.id);
  const parentItems: Record<string, string> = {
    [NO_PARENT]: "Ana hizmet (üst yok)",
    ...Object.fromEntries(parentOptions.map((s) => [s.id, s.titleTr])),
  };

  async function handleSubmit(values: ServiceFormValues) {
    // Keep the existing slug when editing; derive one from the title on create so
    // the admin never has to manage slugs by hand.
    const slug = editingService?.slug ?? slugify(values.titleTr);
    await onSubmit({
      ...values,
      slug,
      image: values.image || null,
      parentId: values.parentId === NO_PARENT ? null : values.parentId,
      titleEn: values.titleTr,
      descriptionEn: values.descriptionTr,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingService ? "Hizmeti Düzenle" : "Yeni Hizmet"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Üst Hizmet</FormLabel>
                  <Select
                    items={parentItems}
                    value={field.value}
                    onValueChange={(v) => v && field.onChange(v)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(parentItems).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Bir üst hizmet seçerseniz bu, o hizmetin altında görünen bir alt
                    seçenek olur (ör. &quot;Koltuk Yıkama&quot; altında &quot;Tekli Koltuk&quot;).
                  </p>
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
