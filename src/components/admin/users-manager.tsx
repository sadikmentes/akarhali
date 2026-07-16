"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { UserFormDialog, type UserFormValues } from "@/components/admin/user-form-dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { User } from "@/types";

type SafeUser = Omit<User, "passwordHash">;

export function UsersManager({
  users,
  currentUserId,
}: {
  users: SafeUser[];
  currentUserId: string;
}) {
  const [items, setItems] = useState(users);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SafeUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setItems(users);
  }, [users]);

  async function handleSubmit(values: UserFormValues) {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.error ?? "Bir hata oluştu");
      return;
    }
    toast.success("Kullanıcı oluşturuldu");
    setItems((current) => [json.data, ...current]);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await fetch(`/api/users/${deleteTarget.id}`, { method: "DELETE" });
    setIsDeleting(false);
    if (!res.ok) {
      toast.error("Silinemedi");
      return;
    }
    toast.success("Kullanıcı silindi");
    setItems((current) => current.filter((user) => user.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="size-4" />
          Yeni Kullanıcı
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Sil"
                    disabled={user.id === currentUserId}
                    onClick={() => setDeleteTarget(user)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UserFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Kullanıcıyı sil"
        description={`"${deleteTarget?.name}" kullanıcısını silmek istediğinize emin misiniz?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
