import { serviceRepository } from "@/repositories/service.repository";
import type { Prisma } from "@prisma/client";

export const serviceService = {
  list: () => serviceRepository.findAll(),
  listActive: () => serviceRepository.findActive(),
  listActiveTree: () => serviceRepository.findActiveTree(),
  getBySlug: (slug: string) => serviceRepository.findBySlug(slug),
  getById: (id: string) => serviceRepository.findById(id),
  create: (data: Prisma.ServiceUncheckedCreateInput) => serviceRepository.create(data),
  update: (id: string, data: Prisma.ServiceUncheckedUpdateInput) => serviceRepository.update(id, data),
  delete: (id: string) => serviceRepository.delete(id),
};
