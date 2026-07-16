import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
