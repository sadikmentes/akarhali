"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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
const NEW_PARENT = "__new_parent__";

// Ensures a client-generated slug doesn't collide with an existing one.
function uniqueSlug(base: string, existingSlugs: Set<string>) {
  const root = base || "hizmet";
  if (!existingSlugs.has(root)) return root;
  let i = 2;
  while (existingSlugs.has(`${root}-${i}`)) i += 1;
  return `${root}-${i}`;
}

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

// Next order within a sibling group (same parent), so a new service is
// appended after the last one instead of always starting at 0.
function nextOrderFor(
  parentId: string | null,
  allServices: Service[],
  excludeId?: string | null
) {
  const siblings = allServices.filter(
    (s) => (s.parentId ?? null) === parentId && s.id !== excludeId
  );
  return siblings.length > 0 ? Math.max(...siblings.map((s) => s.order)) + 1 : 0;
}

export function ServiceFormDialog({
  open,
  onOpenChange,
  editingService,
  mainServices,
  allServices,
  defaultParentId,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingService?: Service | null;
  mainServices: Service[];
  allServices: Service[];
  defaultParentId?: string | null;
  onSubmit: (
    values: Omit<ServiceFormValues, "parentId"> & { slug: string; parentId: string | null }
  ) => Promise<void>;
}) {
  const [parentMode, setParentMode] = useState<"existing" | "new">("existing");
  const [newParentName, setNewParentName] = useState("");
  const [isCreatingParent, setIsCreatingParent] = useState(false);

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
      setParentMode("existing");
      setNewParentName("");
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
              order: nextOrderFor(defaultParentId ?? null, allServices),
              isActive: true,
            }
      );
    }
  }, [open, editingService, defaultParentId, form, allServices]);

  const watchedParentId = form.watch("parentId");

  // While creating, keep the (hidden) order value in sync with whichever
  // sibling group the admin currently has selected as the parent, so a new
  // service is always appended after the last sibling.
  useEffect(() => {
    if (!open || editingService) return;
    const resolvedParentId = !watchedParentId || watchedParentId === NO_PARENT ? null : watchedParentId;
    form.setValue("order", nextOrderFor(resolvedParentId, allServices));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editingService, watchedParentId, allServices]);

  // A service can be a parent only if it is itself a main service; exclude the
  // service currently being edited so it cannot become its own parent.
  const parentOptions = mainServices.filter((s) => s.id !== editingService?.id);
  const parentItems: Record<string, string> = {
    [NO_PARENT]: "Ana hizmet (üst yok)",
    ...Object.fromEntries(parentOptions.map((s) => [s.id, s.titleTr])),
  };

  async function handleSubmit(values: ServiceFormValues) {
    let parentId = values.parentId === NO_PARENT ? null : values.parentId;

    if (parentMode === "new") {
      const name = newParentName.trim();
      if (!name) {
        form.setError("parentId", { message: "Ana hizmet adı gerekli" });
        return;
      }
      setIsCreatingParent(true);
      const slug = uniqueSlug(
        slugify(name),
        new Set(allServices.map((s) => s.slug))
      );
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          titleTr: name,
          titleEn: name,
          order: nextOrderFor(null, allServices),
          parentId: null,
          isActive: true,
        }),
      });
      const json = await res.json();
      setIsCreatingParent(false);
      if (!res.ok || !json.success) {
        toast.error(json.error ?? "Ana hizmet oluşturulamadı");
        return;
      }
      parentId = json.data.id;
    }

    // Keep the existing slug when editing; derive one from the title on create so
    // the admin never has to manage slugs by hand.
    const slug = editingService?.slug ?? slugify(values.titleTr);
    await onSubmit({
      ...values,
      slug,
      image: values.image || null,
      parentId,
      order: parentMode === "new" ? 0 : values.order,
      titleEn: values.titleTr,
      descriptionEn: values.descriptionTr,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingService ? "Hizmeti Düzenle" : "Yeni Alt Hizmet"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Üst Hizmet</FormLabel>
                    <button
                      type="button"
                      className="text-xs font-medium text-primary hover:underline"
                      onClick={() => {
                        if (parentMode === "existing") {
                          setParentMode("new");
                          field.onChange(NEW_PARENT);
                        } else {
                          setParentMode("existing");
                          field.onChange(NO_PARENT);
                        }
                      }}
                    >
                      {parentMode === "existing" ? "+ Yeni ana hizmet ekle" : "Var olandan seç"}
                    </button>
                  </div>
                  {parentMode === "new" ? (
                    <FormControl>
                      <Input
                        placeholder="Yeni ana hizmet adı"
                        value={newParentName}
                        onChange={(e) => setNewParentName(e.target.value)}
                      />
                    </FormControl>
                  ) : (
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
                  )}
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
              <Button type="submit" disabled={form.formState.isSubmitting || isCreatingParent}>
                {(form.formState.isSubmitting || isCreatingParent) && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Kaydet
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
