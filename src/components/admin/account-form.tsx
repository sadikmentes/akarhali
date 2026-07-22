"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Save, User, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const accountFormSchema = z
  .object({
    name: z.string().min(2, "Kullanıcı adı en az 2 karakter olmalı"),
    currentPassword: z.string().min(1, "Mevcut şifrenizi girin"),
    newPassword: z.string().optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine((d) => !d.newPassword || d.newPassword.length >= 8, {
    message: "Yeni şifre en az 8 karakter olmalı",
    path: ["newPassword"],
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm({ name }: { name: string }) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: { name, currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: AccountFormValues) {
    setIsSaving(true);
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword || undefined,
      }),
    });
    const json = await res.json();
    setIsSaving(false);

    if (!res.ok || !json.success) {
      toast.error(json.error ?? "Kaydedilemedi");
      return;
    }
    toast.success("Bilgileriniz güncellendi");
    form.reset({
      name: json.data.name,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5 text-primary" />
              Kullanıcı Adı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kullanıcı adı</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Panele giriş yaparken bu adı kullanırsınız.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="size-5 text-primary" />
              Şifre Değiştir
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yeni şifre</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>Değiştirmek istemiyorsanız boş bırakın.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yeni şifre (tekrar)</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mevcut şifre</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>
                    Güvenlik için değişiklikleri kaydetmeden önce mevcut şifrenizi girin.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" size="lg" disabled={isSaving}>
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Kaydet
        </Button>
      </form>
    </Form>
  );
}
