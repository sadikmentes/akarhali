// Resets the admin account's password directly in the database.
// Usage:  npx tsx scripts/reset-password.mjs "yeni-sifre"  (or NEW_PASSWORD env)
// The site runs on the owner's own machine with a single admin user, so a local
// script is the simplest and safest way to recover a forgotten password.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const newPassword = (process.argv[2] ?? process.env.NEW_PASSWORD ?? "").trim();

  if (newPassword.length < 6) {
    console.error("HATA: Yeni sifre en az 6 karakter olmali.");
    process.exit(1);
  }

  // Single-user app: reset the oldest (main) account, or a specific email if given.
  const email = process.env.RESET_EMAIL?.toLowerCase().trim();
  const user = email
    ? await prisma.user.findUnique({ where: { email } })
    : await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });

  if (!user) {
    console.error("HATA: Kullanici bulunamadi.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  console.log("============================================================");
  console.log(" Sifre basariyla guncellendi.");
  console.log(` Kullanici adi : ${user.name}`);
  console.log(` E-posta       : ${user.email}`);
  console.log(` Yeni sifre    : ${newPassword}`);
  console.log("============================================================");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
