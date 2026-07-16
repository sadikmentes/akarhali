import type {
  Price,
  Category,
  Service,
  Campaign,
  GalleryImage,
  Faq,
  ContactMessage,
  SiteSettings,
  ContactInfo,
  SocialLinks,
  SeoSettings,
  User,
} from "@prisma/client";

export type Locale = "tr" | "en";

export type {
  Price,
  Category,
  Service,
  Campaign,
  GalleryImage,
  Faq,
  ContactMessage,
  SiteSettings,
  ContactInfo,
  SocialLinks,
  SeoSettings,
  User,
};

export type PriceWithRelations = Price & {
  service: Service;
  category: Category | null;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type LocalizedField = {
  tr: string;
  en: string;
};
