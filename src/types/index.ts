import type {
  Price,
  Service,
  Campaign,
  GalleryImage,
  HeroSlide,
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
  Service,
  Campaign,
  GalleryImage,
  HeroSlide,
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
};

// A main service together with its sub-services, used by the public accordion.
export type ServiceWithChildren = Service & {
  children: Service[];
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
