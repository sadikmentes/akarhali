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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { slugify } from "@/lib/utils";
import type { Service } from "@/types";

const mainServiceFormSchema = z.object({
  titleTr: z.string().min(2, "Hizmet adı en az 2 karakter olmalı"),
  descriptionTr: z.string().optional(),
});

type MainServiceFormValues = z.infer<typeof mainServiceFormSchema>;

// A brand-new main service is always top-level, active, and appended after
// the last one — the admin only ever needs to name it.
function nextOrderFor(allServices: Service[]) {
  const mainServices = allServices.filter((s) => !s.parentId);
  return mainServices.length > 0 ? Math.max(...mainServices.map((s) => s.order)) + 1 : 0;
}

export function MainServiceFormDialog({
  open,
  onOpenChange,
  allServices,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allServices: Service[];
  onSubmit: (values: {
    slug: string;
    titleTr: string;
    titleEn: string;
    descriptionTr: string;
    descriptionEn: string;
    parentId: null;
    order: number;
    isActive: boolean;
  }) => Promise<void>;
}) {
  const form = useForm<MainServiceFormValues>({
    resolver: zodResolver(mainServiceFormSchema),
    defaultValues: { titleTr: "", descriptionTr: "" },
  });

  useEffect(() => {
    if (open) form.reset({ titleTr: "", descriptionTr: "" });
  }, [open, form]);

  async function handleSubmit(values: MainServiceFormValues) {
    await onSubmit({
      slug: slugify(values.titleTr),
      titleTr: values.titleTr,
      titleEn: values.titleTr,
      descriptionTr: values.descriptionTr ?? "",
      descriptionEn: values.descriptionTr ?? "",
      parentId: null,
      order: nextOrderFor(allServices),
      isActive: true,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Yeni Ana Hizmet</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="titleTr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hizmet Adı</FormLabel>
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
