import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { UsersManager } from "@/components/admin/users-manager";
import { userRepository, omitPasswordHash } from "@/repositories/user.repository";

export const metadata = { title: "Kullanıcılar" };

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const users = await userRepository.findAll();
  const safeUsers = users.map(omitPasswordHash);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kullanıcı Yönetimi</h1>
        <p className="text-muted-foreground">Yönetici hesaplarını yönetin.</p>
      </div>
      <UsersManager users={safeUsers} currentUserId={session.user.id} />
    </div>
  );
}
