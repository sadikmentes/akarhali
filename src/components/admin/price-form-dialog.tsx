"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { priceSchema, type PriceInput, type PriceFormInput } from "@/lib/validations/price.schema";
import type { PriceWithRelations, Service } from "@/types";

const NEW_SERVICE = "__new__";

// Ensures a client-generated service slug doesn't collide with an existing one.
function uniqueServiceSlug(base: string, services: Service[]) {
  const root = base || "hizmet";
  const taken = new Set(services.map((s) => s.slug));
  if (!taken.has(root)) return root;
  let i = 2;
  while (taken.has(`${root}-${i}`)) i += 1;
  return `${root}-${i}`;
}

type PriceFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  services: Service[];
  prices: PriceWithRelations[];
  editingPrice?: PriceWithRelations | null;
  onSubmit: (values: PriceInput) => Promise<void>;
};

export function PriceFormDialog({
  open,
  onOpenChange,
  services,
  prices,
  editingPrice,
  onSubmit,
}: PriceFormDialogProps) {
  const [serviceMode, setServiceMode] = useState<"existing" | "new">("existing");
  const [newServiceName, setNewServiceName] = useState("");
  const [isCreatingService, setIsCreatingService] = useState(false);

  // The dropdown should only offer top-level service categories, not every
  // leaf service ever created. If the price being edited already points at a
  // leaf service, keep it selectable so its current value isn't lost.
  const mainServices = services.filter((s) => !s.parentId && s.isActive);
  const selectableServices =
    editingPrice && !mainServices.some((s) => s.id === editingPrice.serviceId)
      ? [...mainServices, ...services.filter((s) => s.id === editingPrice.serviceId)]
      : mainServices;

  const form = useForm<PriceFormInput, unknown, PriceInput>({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      serviceId: "",
      nameTr: "",
      nameEn: "",
      unit: "M2",
      basePrice: 0,
      discountPrice: null,
      isCampaignActive: false,
      isActive: true,
      order: 0,
    },
  });
  const serviceId = form.watch("serviceId");
  const unit = form.watch("unit");
  const selectedServiceName =
    services.find((service) => service.id === serviceId)?.titleTr ?? "";
  const selectedUnitName = unit === "PIECE" ? "Adet" : "m²";

  useEffect(() => {
    if (open) {
      setServiceMode("existing");
      setNewServiceName("");
      // New prices are appended after everything else so they show up at the
      // bottom of the list instead of jumping to the top via createdAt.
      const nextOrder = prices.length > 0 ? Math.max(...prices.map((p) => p.order)) + 1 : 0;
      form.reset(
        editingPrice
          ? {
              serviceId: editingPrice.serviceId,
              nameTr: editingPrice.nameTr,
              nameEn: editingPrice.nameEn,
              unit: editingPrice.unit,
              basePrice: Number(editingPrice.basePrice),
              discountPrice: editingPrice.discountPrice
                ? Number(editingPrice.discountPrice)
                : null,
              isCampaignActive: editingPrice.isCampaignActive,
              isActive: editingPrice.isActive,
              order: editingPrice.order,
            }
          : {
              serviceId: mainServices[0]?.id ?? "",
              nameTr: "",
              nameEn: "",
              unit: "M2",
              basePrice: 0,
              discountPrice: null,
              isCampaignActive: false,
              isActive: true,
              order: nextOrder,
            }
      );
    }
  }, [open, editingPrice, form, services, prices]);

  async function handleSubmit(values: PriceInput) {
    let serviceId = values.serviceId;

    if (serviceMode === "new") {
      const name = newServiceName.trim();
      if (!name) {
        form.setError("serviceId", { message: "Hizmet adı gerekli" });
        return;
      }
      setIsCreatingService(true);
      const slug = uniqueServiceSlug(slugify(name), services);
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, titleTr: name, titleEn: name, order: 0, isActive: true }),
      });
      const json = await res.json();
      setIsCreatingService(false);
      if (!res.ok || !json.success) {
        toast.error(json.error ?? "Hizmet oluşturulamadı");
        return;
      }
      serviceId = json.data.id;
    }

    await onSubmit({ ...values, serviceId });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingPrice ? "Fiyatı Düzenle" : "Yeni Fiyat Ekle"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Hizmet</FormLabel>
                    <button
                      type="button"
                      className="text-xs font-medium text-primary hover:underline"
                      onClick={() => {
                        if (serviceMode === "existing") {
                          setServiceMode("new");
                          field.onChange(NEW_SERVICE);
                        } else {
                          setServiceMode("existing");
                          field.onChange(mainServices[0]?.id ?? "");
                        }
                      }}
                    >
                      {serviceMode === "existing" ? "+ Yeni hizmet ekle" : "Var olan hizmetten seç"}
                    </button>
                  </div>
                  {serviceMode === "new" ? (
                    <FormControl>
                      <Input
                        placeholder="Yeni hizmet adı"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                      />
                    </FormControl>
                  ) : (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Hizmet seçin">
                            {selectedServiceName || "Hizmet seçin"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectableServices.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.titleTr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
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
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birim</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue>{selectedUnitName}</SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="M2">m²</SelectItem>
                      <SelectItem value="PIECE">Adet</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Normal Fiyat (₺)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value as number}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discountPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kampanyalı Fiyat (₺)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={(field.value as number | null) ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value === "" ? null : Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <FormLabel className="mb-0">Kampanya Aktif</FormLabel>
              <FormField
                control={form.control}
                name="isCampaignActive"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>

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
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                İptal
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting || isCreatingService}>
                {(form.formState.isSubmitting || isCreatingService) && (
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
