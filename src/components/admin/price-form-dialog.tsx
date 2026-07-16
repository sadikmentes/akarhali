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
import type { Category, PriceWithRelations, Service } from "@/types";

type PriceFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  services: Service[];
  categories: Category[];
  editingPrice?: PriceWithRelations | null;
  onSubmit: (values: PriceInput) => Promise<void>;
};

export function PriceFormDialog({
  open,
  onOpenChange,
  services,
  categories,
  editingPrice,
  onSubmit,
}: PriceFormDialogProps) {
  const form = useForm<PriceFormInput, unknown, PriceInput>({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      serviceId: "",
      categoryId: null,
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
  const categoryId = form.watch("categoryId");
  const unit = form.watch("unit");
  const selectedServiceName =
    services.find((service) => service.id === serviceId)?.titleTr ?? "";
  const selectedCategoryName =
    categories.find((category) => category.id === categoryId)?.nameTr ?? "Yok";
  const selectedUnitName = unit === "PIECE" ? "Adet" : "m²";

  useEffect(() => {
    if (open) {
      form.reset(
        editingPrice
          ? {
              serviceId: editingPrice.serviceId,
              categoryId: editingPrice.categoryId,
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
              serviceId: services[0]?.id ?? "",
              categoryId: null,
              nameTr: "",
              nameEn: "",
              unit: "M2",
              basePrice: 0,
              discountPrice: null,
              isCampaignActive: false,
              isActive: true,
              order: 0,
            }
      );
    }
  }, [open, editingPrice, form, services]);

  async function handleSubmit(values: PriceInput) {
    await onSubmit(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
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
                  <FormLabel>Hizmet</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Hizmet seçin">
                          {selectedServiceName || "Hizmet seçin"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.titleTr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori (opsiyonel)</FormLabel>
                  <Select
                    value={field.value ?? "none"}
                    onValueChange={(v) => field.onChange(v === "none" ? null : v)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Kategori seçin">
                          {selectedCategoryName}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Yok</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nameTr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            </div>

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
