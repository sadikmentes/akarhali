import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session) redirect("/admin");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Soft decorative brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
