"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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
import { ImageUploader } from "@/components/admin/image-uploader";
import {
  campaignSchema,
  type CampaignInput,
  type CampaignFormInput,
} from "@/lib/validations/campaign.schema";
import type { Campaign } from "@/types";

type CampaignFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCampaign?: Campaign | null;
  onSubmit: (values: CampaignInput) => Promise<void>;
};

export function CampaignFormDialog({
  open,
  onOpenChange,
  editingCampaign,
  onSubmit,
}: CampaignFormDialogProps) {
  const [imageUrl, setImageUrl] = useState("");

  const form = useForm<CampaignFormInput, unknown, CampaignInput>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      titleTr: "",
      titleEn: "",
      descriptionTr: "",
      descriptionEn: "",
      image: "",
      discountPercent: 10,
      startDate: new Date(),
      endDate: new Date(),
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      const initial = editingCampaign
        ? {
            titleTr: editingCampaign.titleTr,
            titleEn: editingCampaign.titleEn,
            descriptionTr: editingCampaign.descriptionTr ?? "",
            descriptionEn: editingCampaign.descriptionEn ?? "",
            image: editingCampaign.image,
            discountPercent: editingCampaign.discountPercent,
            startDate: new Date(editingCampaign.startDate),
            endDate: new Date(editingCampaign.endDate),
            isActive: editingCampaign.isActive,
          }
        : {
            titleTr: "",
            titleEn: "",
            descriptionTr: "",
            descriptionEn: "",
            image: "",
            discountPercent: 10,
            startDate: new Date(),
            endDate: new Date(),
            isActive: true,
          };
      form.reset(initial);
      setImageUrl(initial.image);
    }
  }, [open, editingCampaign, form]);

  async function handleSubmit(values: CampaignInput) {
    await onSubmit(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingCampaign ? "Kampanyayı Düzenle" : "Yeni Kampanya"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kampanya Görseli</FormLabel>
                  <FormControl>
                    <ImageUploader
                      folder="campaigns"
                      value={imageUrl}
                      onUploaded={(images) => {
                        const url = images[0]?.url ?? "";
                        setImageUrl(url);
                        field.onChange(url);
                      }}
                    />
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
                    <Textarea rows={3} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="discountPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İndirim (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={100}
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
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlangıç</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={format(field.value as Date, "yyyy-MM-dd")}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bitiş</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={format(field.value as Date, "yyyy-MM-dd")}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
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
