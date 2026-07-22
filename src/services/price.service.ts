import { priceRepository, categoryRepository } from "@/repositories/price.repository";
import { priceSchema, categorySchema, type PriceInput, type CategoryInput } from "@/lib/validations/price.schema";
import { slugify } from "@/lib/utils";

export const priceService = {
  list: () => priceRepository.findAll(),
  listActive: () => priceRepository.findActive(),
  getById: (id: string) => priceRepository.findById(id),

  async create(input: PriceInput) {
    const data = priceSchema.parse(input);
    return priceRepository.create({
      nameTr: data.nameTr,
      nameEn: data.nameEn ?? data.nameTr,
      unit: data.unit,
      basePrice: data.basePrice,
      discountPrice: data.discountPrice ?? null,
      isCampaignActive: data.isCampaignActive,
      isActive: data.isActive,
      order: data.order,
      service: { connect: { id: data.serviceId } },
      category: data.categoryId ? { connect: { id: data.categoryId } } : undefined,
    });
  },

  async update(id: string, input: PriceInput) {
    const data = priceSchema.parse(input);
    return priceRepository.update(id, {
      nameTr: data.nameTr,
      nameEn: data.nameEn ?? data.nameTr,
      unit: data.unit,
      basePrice: data.basePrice,
      discountPrice: data.discountPrice ?? null,
      isCampaignActive: data.isCampaignActive,
      isActive: data.isActive,
      order: data.order,
      service: { connect: { id: data.serviceId } },
      category: data.categoryId
        ? { connect: { id: data.categoryId } }
        : { disconnect: true },
    });
  },

  delete: (id: string) => priceRepository.delete(id),
  toggleCampaign: (id: string, isCampaignActive: boolean) =>
    priceRepository.setCampaignActive(id, isCampaignActive),
};

export const categoryService = {
  list: () => categoryRepository.findAll(),
  getById: (id: string) => categoryRepository.findById(id),
  async create(input: CategoryInput) {
    const data = categorySchema.parse(input);
    const slug = await uniqueCategorySlug(data.slug || slugify(data.nameTr));
    return categoryRepository.create({
      slug,
      nameTr: data.nameTr,
      nameEn: data.nameEn ?? data.nameTr,
      order: data.order,
    });
  },
  update: (id: string, input: CategoryInput) => {
    const data = categorySchema.parse(input);
    // Slug is generated once on create and kept stable on edits.
    return categoryRepository.update(id, {
      ...(data.slug ? { slug: data.slug } : {}),
      nameTr: data.nameTr,
      nameEn: data.nameEn ?? data.nameTr,
      order: data.order,
    });
  },
  delete: (id: string) => categoryRepository.delete(id),
};

// Ensures the generated slug is unique by appending a numeric suffix if needed.
async function uniqueCategorySlug(base: string) {
  const root = base || "kategori";
  const existing = await categoryRepository.findAll();
  const taken = new Set(existing.map((c) => c.slug));
  if (!taken.has(root)) return root;
  let i = 2;
  while (taken.has(`${root}-${i}`)) i += 1;
  return `${root}-${i}`;
}
