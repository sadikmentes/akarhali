import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@akarhali.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin123";
  const adminName = process.env.SEED_ADMIN_NAME ?? "admin";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { name: adminName, email: adminEmail, passwordHash, role: "ADMIN" },
  });
  console.log(`Admin user ready: ${adminEmail}`);

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      heroTitleTr: "Evinize ve İşyerinize Değer Katan Profesyonel Halı Yıkama",
      heroTitleEn: "Evinize ve İşyerinize Değer Katan Profesyonel Halı Yıkama",
      heroSubtitleTr: "Fabrika usulü yıkama, ücretsiz alım-teslim ve %100 memnuniyet garantisi.",
      heroSubtitleEn: "Fabrika usulü yıkama, ücretsiz alım-teslim ve %100 memnuniyet garantisi.",
      aboutTitleTr: "Hakkımızda",
      aboutTitleEn: "Hakkımızda",
      aboutContentTr:
        "Akar Halı olarak 20 yılı aşkın tecrübemizle halı, koltuk, perde ve ev tekstili yıkamada güvenilir çözüm ortağınızız.",
      aboutContentEn:
        "Akar Halı olarak 20 yılı aşkın tecrübemizle halı, koltuk, perde ve ev tekstili yıkamada güvenilir çözüm ortağınızız.",
      statsYearsExp: 20,
      statsHappyClients: 8500,
      statsProjectsDone: 15000,
      statsTeamMembers: 25,
      mapLatitude: 37.75301821341229,
      mapLongitude: 29.10739207630348,
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3154.5790700684265!2d29.10739207630348!3d37.75301821341229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c73fb90a039bc3%3A0x2d97cd61d10832d2!2zQWthciBoYWzEsSB5xLFrYW1h!5e0!3m2!1str!2str!4v1784242533880!5m2!1str!2str",
    },
  });

  await prisma.contactInfo.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      phone: "+90 555 000 00 00",
      whatsapp: "+90 555 000 00 00",
      email: "info@akarhali.com",
      addressTr: "Örnek Mahallesi, Örnek Caddesi No:1, İstanbul",
      addressEn: "Örnek Mahallesi, Örnek Caddesi No:1, İstanbul",
      workingHoursTr: "Pazartesi - Cumartesi: 09:00 - 19:00",
      workingHoursEn: "Pazartesi - Cumartesi: 09:00 - 19:00",
    },
  });

  await prisma.socialLinks.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      instagram: "https://instagram.com/akarhali",
      whatsapp: "https://wa.me/905550000000",
    },
  });

  await prisma.seoSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteTitleTr: "Akar Halı Yıkama | Profesyonel Halı, Koltuk ve Perde Yıkama",
      siteTitleEn: "Akar Halı Yıkama | Profesyonel Halı, Koltuk ve Perde Yıkama",
      siteDescriptionTr:
        "Akar Halı ile evinizin ve işyerinizin halı, koltuk, perde temizliğini uzman ekibimize emanet edin. Ücretsiz alım-teslim.",
      siteDescriptionEn:
        "Akar Halı ile evinizin ve işyerinizin halı, koltuk, perde temizliğini uzman ekibimize emanet edin. Ücretsiz alım-teslim.",
      keywordsTr: "halı yıkama, koltuk yıkama, perde yıkama, battaniye yıkama",
      keywordsEn: "halı yıkama, koltuk yıkama, perde yıkama, battaniye yıkama",
    },
  });

  const services = [
    { slug: "hali-yikama", titleTr: "Halı Yıkama", titleEn: "Halı Yıkama", order: 1 },
    { slug: "koltuk-yikama", titleTr: "Koltuk Yıkama", titleEn: "Koltuk Yıkama", order: 2 },
    { slug: "perde-yikama", titleTr: "Perde Yıkama", titleEn: "Perde Yıkama", order: 3 },
    { slug: "battaniye-yikama", titleTr: "Battaniye Yıkama", titleEn: "Battaniye Yıkama", order: 4 },
    { slug: "yorgan-yikama", titleTr: "Yorgan Yıkama", titleEn: "Yorgan Yıkama", order: 5 },
    { slug: "yatak-yikama", titleTr: "Yatak Yıkama", titleEn: "Yatak Yıkama", order: 6 },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        titleTr: s.titleTr,
        titleEn: s.titleEn,
        order: s.order,
        descriptionTr: `${s.titleTr} hizmetimizle eviniz ve işyeriniz için profesyonel temizlik.`,
        descriptionEn: `${s.titleTr} hizmetimizle eviniz ve işyeriniz için profesyonel temizlik.`,
      },
    });
  }

  const categories = [
    { slug: "makine-hali", nameTr: "Makine Halısı", nameEn: "Makine Halısı", order: 1 },
    { slug: "el-dokuma", nameTr: "El Dokuma Halı", nameEn: "El Dokuma Halı", order: 2 },
    { slug: "shaggy", nameTr: "Shaggy", nameEn: "Shaggy", order: 3 },
    { slug: "yun", nameTr: "Yün Halı", nameEn: "Yün Halı", order: 4 },
    { slug: "bambu", nameTr: "Bambu Halı", nameEn: "Bambu Halı", order: 5 },
    { slug: "ipek", nameTr: "İpek Halı", nameEn: "İpek Halı", order: 6 },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  // ---- Prices (only seed if empty, so re-running the seed is safe) ----
  if ((await prisma.price.count()) === 0) {
    const carpetService = await prisma.service.findUnique({ where: { slug: "hali-yikama" } });
    const sofaService = await prisma.service.findUnique({ where: { slug: "koltuk-yikama" } });
    const curtainService = await prisma.service.findUnique({ where: { slug: "perde-yikama" } });
    const machineCategory = await prisma.category.findUnique({ where: { slug: "makine-hali" } });
    const handmadeCategory = await prisma.category.findUnique({ where: { slug: "el-dokuma" } });
    const woolCategory = await prisma.category.findUnique({ where: { slug: "yun" } });
    const silkCategory = await prisma.category.findUnique({ where: { slug: "ipek" } });

    const priceData = [
      carpetService && machineCategory && {
        serviceId: carpetService.id, categoryId: machineCategory.id,
        nameTr: "Makine Halısı Yıkama", nameEn: "Makine Halısı Yıkama",
        unit: "M2" as const, basePrice: 90, isActive: true, order: 1,
      },
      carpetService && woolCategory && {
        serviceId: carpetService.id, categoryId: woolCategory.id,
        nameTr: "Yün Halı Yıkama", nameEn: "Yün Halı Yıkama",
        unit: "M2" as const, basePrice: 130, discountPrice: 99, isCampaignActive: true, isActive: true, order: 2,
      },
      carpetService && handmadeCategory && {
        serviceId: carpetService.id, categoryId: handmadeCategory.id,
        nameTr: "El Dokuma Halı Yıkama", nameEn: "El Dokuma Halı Yıkama",
        unit: "M2" as const, basePrice: 150, isActive: true, order: 3,
      },
      carpetService && silkCategory && {
        serviceId: carpetService.id, categoryId: silkCategory.id,
        nameTr: "İpek Halı Yıkama", nameEn: "İpek Halı Yıkama",
        unit: "M2" as const, basePrice: 220, isActive: true, order: 4,
      },
      sofaService && {
        serviceId: sofaService.id, nameTr: "Tekli Koltuk Yıkama", nameEn: "Tekli Koltuk Yıkama",
        unit: "PIECE" as const, basePrice: 350, isActive: true, order: 1,
      },
      sofaService && {
        serviceId: sofaService.id, nameTr: "Üçlü Koltuk Yıkama", nameEn: "Üçlü Koltuk Yıkama",
        unit: "PIECE" as const, basePrice: 750, isActive: true, order: 2,
      },
      curtainService && {
        serviceId: curtainService.id, nameTr: "Perde Yıkama", nameEn: "Perde Yıkama",
        unit: "M2" as const, basePrice: 60, isActive: true, order: 1,
      },
    ].filter(Boolean) as Array<Record<string, unknown>>;

    for (const p of priceData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await prisma.price.create({ data: p as any });
    }
  }

  // ---- FAQs ----
  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({
      data: [
        {
          questionTr: "Halılarımı ne kadar sürede teslim alıyorsunuz?",
          questionEn: "Halılarımı ne kadar sürede teslim alıyorsunuz?",
          answerTr: "Randevu sonrası aynı gün veya ertesi gün içinde ücretsiz alım yapıyoruz.",
          answerEn: "Randevu sonrası aynı gün veya ertesi gün içinde ücretsiz alım yapıyoruz.",
          order: 1,
        },
        {
          questionTr: "Yıkama süreci ne kadar sürüyor?",
          questionEn: "Yıkama süreci ne kadar sürüyor?",
          answerTr: "Halı tipine göre değişmekle birlikte genellikle 2-3 gün içinde teslim ediyoruz.",
          answerEn: "Halı tipine göre değişmekle birlikte genellikle 2-3 gün içinde teslim ediyoruz.",
          order: 2,
        },
        {
          questionTr: "Alım ve teslimat ücretli mi?",
          questionEn: "Alım ve teslimat ücretli mi?",
          answerTr: "Hayır, belirlenen bölgelerde alım ve teslimat tamamen ücretsizdir.",
          answerEn: "Hayır, belirlenen bölgelerde alım ve teslimat tamamen ücretsizdir.",
          order: 3,
        },
        {
          questionTr: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
          questionEn: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
          answerTr: "Nakit, kredi kartı ve havale/EFT ile ödeme kabul ediyoruz.",
          answerEn: "Nakit, kredi kartı ve havale/EFT ile ödeme kabul ediyoruz.",
          order: 4,
        },
      ],
    });
  }

  // ---- Campaign ----
  if ((await prisma.campaign.count()) === 0) {
    const now = new Date();
    await prisma.campaign.create({
      data: {
        titleTr: "Sezon Açılışı Halı Yıkama Kampanyası",
        titleEn: "Sezon Açılışı Halı Yıkama Kampanyası",
        descriptionTr: "Tüm makine ve yün halı yıkama hizmetlerinde geçerli özel indirim.",
        descriptionEn: "Tüm makine ve yün halı yıkama hizmetlerinde geçerli özel indirim.",
        image: "https://picsum.photos/seed/akarcampaign/800/600",
        discountPercent: 20,
        startDate: now,
        endDate: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
        isActive: true,
      },
    });
  }

  // ---- Gallery (demo images) ----
  if ((await prisma.galleryImage.count()) === 0) {
    await prisma.galleryImage.createMany({
      data: [
        { url: "https://picsum.photos/seed/akarbefore1/600/600", publicId: "demo-before-1", category: "BEFORE", order: 1 },
        { url: "https://picsum.photos/seed/akarafter1/600/600", publicId: "demo-after-1", category: "AFTER", order: 1 },
        { url: "https://picsum.photos/seed/akarbefore2/600/600", publicId: "demo-before-2", category: "BEFORE", order: 2 },
        { url: "https://picsum.photos/seed/akarafter2/600/600", publicId: "demo-after-2", category: "AFTER", order: 2 },
        { url: "https://picsum.photos/seed/akarcarpet1/600/600", publicId: "demo-carpet-1", category: "CARPET", order: 3 },
        { url: "https://picsum.photos/seed/akarsofa1/600/600", publicId: "demo-sofa-1", category: "SOFA", order: 4 },
        { url: "https://picsum.photos/seed/akarcurtain1/600/600", publicId: "demo-curtain-1", category: "CURTAIN", order: 5 },
      ],
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
