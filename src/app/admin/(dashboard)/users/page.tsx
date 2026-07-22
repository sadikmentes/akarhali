import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AccountForm } from "@/components/admin/account-form";
import { userRepository } from "@/repositories/user.repository";

export const metadata = { title: "Hesap & Şifre" };

export default async function AdminAccountPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const user = await userRepository.findById(session.user.id);
  if (!user) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hesap & Şifre</h1>
        <p className="text-muted-foreground">Kullanıcı adınızı ve şifrenizi güncelleyin.</p>
      </div>
      <AccountForm name={user.name} />
    </div>
  );
}
