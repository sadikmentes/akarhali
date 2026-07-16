import { prisma } from "@/lib/prisma";
import type { Prisma, User } from "@prisma/client";

export function omitPasswordHash<T extends { passwordHash: string }>(
  user: T
): Omit<T, "passwordHash"> {
  const entries = Object.entries(user).filter(([key]) => key !== "passwordHash");
  return Object.fromEntries(entries) as Omit<T, "passwordHash">;
}

export type SafeUser = Omit<User, "passwordHash">;

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
  findByLogin(login: string) {
    const normalized = login.toLowerCase().trim();
    return prisma.user.findFirst({
      where: {
        OR: [{ email: normalized }, { name: normalized }],
      },
    });
  },
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },
  findAll() {
    return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  },
  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },
  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
