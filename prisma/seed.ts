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
        "Akar Halı olarak 16 yılı aşkın tecrübemizle halı, koltuk, perde ve ev tekstili yıkamada güvenilir çözüm ortağınızız.",
      aboutContentEn:
        "Akar Halı olarak 16 yılı aşkın tecrübemizle halı, koltuk, perde ve ev tekstili yıkamada güvenilir çözüm ortağınızız.",
      statsYearsExp: 16,
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
    { slug: "yatak-yikama", titleTr: "Yatak Yıkama", titleEn: "Yatak Yıkama", order: 4 },
    { slug: "yorgan-yikama", titleTr: "Yorgan Yıkama", titleEn: "Yorgan Yıkama", order: 5 },
    { slug: "sandalye-yikama", titleTr: "Sandalye Yıkama", titleEn: "Sandalye Yıkama", order: 6 },
    { slug: "yastik-yikama", titleTr: "Yastık Yıkama", titleEn: "Yastık Yıkama", order: 7 },
    { slug: "overlok", titleTr: "Overlok", titleEn: "Overlok", order: 8 },
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

  // ---- Prices: resync from the shop's current price list every run ----
  // [serviceSlug, nameTr, unit, basePrice] — the public price list groups by
  // each price's (main) service, so no separate category is needed.
  const priceRows: Array<[string, string, "M2" | "PIECE", number]> = [
    // Halı Yıkama
    ["hali-yikama", "Makine Halı", "M2", 90],
    ["hali-yikama", "Akrilik Halı", "M2", 120],
    ["hali-yikama", "Shaggy Halı", "M2", 120],
    ["hali-yikama", "Step Halı", "M2", 120],
    ["hali-yikama", "El Dokuma Halı", "M2", 140],
    ["hali-yikama", "Yün Halı", "M2", 150],
    ["hali-yikama", "Bambu Halı", "M2", 180],
    ["hali-yikama", "Tek Parça Halı", "PIECE", 600],
    ["hali-yikama", "Kendin Getir (İndirimli)", "M2", 80],
    ["hali-yikama", "Yerinde Yıkama", "M2", 150],
    // Koltuk & Mobilya
    ["koltuk-yikama", "Koltuk Takımı", "PIECE", 2000],
    ["sandalye-yikama", "Sandalye", "PIECE", 175],
    ["yastik-yikama", "Yastık", "PIECE", 200],
    // Yatak
    ["yatak-yikama", "Tek Kişilik Yatak", "PIECE", 1000],
    ["yatak-yikama", "Çift Kişilik Yatak", "PIECE", 1750],
    // Yorgan & Battaniye
    ["yorgan-yikama", "Yün Yorgan", "PIECE", 750],
    ["yorgan-yikama", "Elyaf Yorgan", "PIECE", 600],
    ["yorgan-yikama", "Battaniye", "PIECE", 600],
    // Perde
    ["perde-yikama", "Stor Perde", "M2", 120],
    ["perde-yikama", "Zebra Perde", "M2", 140],
    // Ek Hizmetler
    ["overlok", "Overlok", "M2", 120],
  ];

  const serviceBySlug = Object.fromEntries(
    (await prisma.service.findMany()).map((s) => [s.slug, s.id]),
  );

  await prisma.price.deleteMany();
  let order = 0;
  let currentService = "";
  for (const [svcSlug, nameTr, unit, basePrice] of priceRows) {
    const serviceId = serviceBySlug[svcSlug];
    if (!serviceId) continue;
    if (svcSlug !== currentService) {
      currentService = svcSlug;
      order = 0;
    }
    order += 1;
    await prisma.price.create({
      data: {
        serviceId,
        nameTr,
        nameEn: nameTr,
        unit,
        basePrice,
        isActive: true,
        order,
      },
    });
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
