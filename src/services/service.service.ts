import { serviceRepository } from "@/repositories/service.repository";
import type { Prisma } from "@prisma/client";

export const serviceService = {
  list: () => serviceRepository.findAll(),
  listActive: () => serviceRepository.findActive(),
  getBySlug: (slug: string) => serviceRepository.findBySlug(slug),
  getById: (id: string) => serviceRepository.findById(id),
  create: (data: Prisma.ServiceCreateInput) => serviceRepository.create(data),
  update: (id: string, data: Prisma.ServiceUpdateInput) => serviceRepository.update(id, data),
  delete: (id: string) => serviceRepository.delete(id),
};
