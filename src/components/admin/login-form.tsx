"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, LogIn, ArrowLeft, User, Lock, ShieldCheck } from "lucide-react";
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

const loginSchema = z.object({
  email: z.string().min(3, "Kullanıcı adı veya e-posta girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setError(null);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    setIsLoading(false);
    if (result?.error) {
      setError("Kullanıcı adı/e-posta veya şifre hatalı");
      return;
    }

    router.push(searchParams.get("callbackUrl") || "/admin");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-xl backdrop-blur">
        {/* Branded header */}
        <div className="flex flex-col items-center gap-4 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent px-8 pt-10 pb-8 text-center">
          <Image
            src="/akar-logo.png"
            alt="Akar Halı"
            width={160}
            height={68}
            className="h-12 w-auto object-contain"
            priority
          />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="size-3.5" />
              Yönetim Paneli
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Hoş geldiniz</h1>
            <p className="text-sm text-muted-foreground">Devam etmek için giriş yapın</p>
          </div>
        </div>

        <div className="px-8 pb-8 pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kullanıcı adı veya e-posta</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="text"
                          autoComplete="username"
                          className="pl-9"
                          placeholder="kullanıcı adı"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="password"
                          autoComplete="current-password"
                          className="pl-9"
                          placeholder="••••••••"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LogIn className="size-4" />
                )}
                Giriş Yap
              </Button>
            </form>
          </Form>

          <Link
            href="/"
            className="mt-4 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Siteye Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
