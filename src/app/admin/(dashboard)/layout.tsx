import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminMobileNav } from "@/components/admin/mobile-nav";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen min-w-0">
      <div className="hidden lg:block">
        <AdminSidebar userName={session.user?.name} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur lg:hidden">
          <AdminMobileNav userName={session.user?.name} />
          <span className="font-semibold">Akar Halı Admin</span>
        </header>
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
