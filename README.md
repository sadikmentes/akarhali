# Akar Halı — Halı Yıkama Tanıtım Sitesi

Next.js 15 + React 19 + TypeScript + Tailwind CSS + Prisma (PostgreSQL) ile geliştirilmiş, admin panelli, çift dilli (TR/EN) kurumsal tanıtım sitesi.

## Teknolojiler

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, next-intl, next-themes
- **Backend:** Next.js API Routes, Prisma ORM
- **Veritabanı:** PostgreSQL
- **Auth:** Auth.js (NextAuth v5, Credentials + JWT)
- **Görsel Depolama:** Cloudinary

## Kurulum

```bash
npm install
cp .env.example .env   # değerleri kendi ortamınıza göre doldurun
npx prisma db push     # şemaları veritabanına uygular
npm run db:seed        # admin kullanıcı + örnek içerik oluşturur
npm run dev
```

`.env` içinde doldurmanız gerekenler:

| Değişken | Açıklama |
|---|---|
| `DATABASE_URL` | PostgreSQL bağlantı adresi (Railway/Supabase/Render/local) |
| `AUTH_SECRET` | `npx auth secret` ile üretilebilir |
| `CLOUDINARY_*` | Cloudinary hesap bilgileri (görsel yükleme için) |
| `SEED_ADMIN_EMAIL/PASSWORD` | İlk admin kullanıcının bilgileri (seed script bunu kullanır) |

Seed sonrası admin paneline `/admin/login` üzerinden, `.env`'de tanımladığınız e-posta/şifre ile giriş yapabilirsiniz. **İlk girişten sonra şifreyi Kullanıcılar bölümünden değiştirmeniz veya yeni bir admin oluşturup eskisini silmeniz önerilir.**

## Komutlar

```bash
npm run dev          # geliştirme sunucusu
npm run build        # production build
npm run start        # production sunucu
npm run db:push      # Prisma şemasını DB'ye uygula (migration'sız, hızlı prototipleme)
npm run db:migrate   # migration dosyası oluşturarak uygula (production için önerilir)
npm run db:seed      # örnek veri + admin kullanıcı
npm run db:studio    # Prisma Studio (veritabanı arayüzü)
```

## Proje Yapısı

```
src/
  app/
    [locale]/(public)/   # TR/EN herkese açık sayfalar (anasayfa, hakkımızda, hizmetler, fiyat listesi, kampanyalar, galeri, SSS, iletişim)
    admin/(auth)/        # Admin giriş sayfası
    admin/(dashboard)/   # Korumalı admin paneli (fiyatlar, kampanyalar, galeri, hizmetler, içerik, iletişim, SEO, kullanıcılar)
    api/                 # REST API route'ları
  components/
    layout/  home/  gallery/  contact/  admin/  ui/  shared/
  repositories/          # Prisma sorgularını saran repository katmanı
  services/              # İş kuralları + validasyon içeren servis katmanı
  lib/                   # prisma, auth, cloudinary, rate-limit, zod şemaları
  i18n/                  # next-intl routing/config
  constants/             # site sabitleri, navigasyon
  types/                 # paylaşılan TypeScript tipleri
prisma/
  schema.prisma          # veritabanı modelleri
  seed.ts                # başlangıç verisi
messages/
  tr.json  en.json       # çeviri dosyaları
```

## Öne Çıkan Özellikler

- **Admin panelinden yönetilebilir:** fiyatlar, kategoriler, kampanyalar (indirim, tarih aralığı, aktif/pasif), galeri (Cloudinary'ye sürükle-bırak çoklu yükleme), hizmetler, anasayfa/hakkımızda metinleri, iletişim bilgileri, sosyal medya linkleri, SEO meta verileri, kullanıcılar.
- **Güvenlik:** Auth.js ile şifrelenmiş (bcrypt) admin girişi, tüm yazma API'lerinde oturum kontrolü, Zod ile giriş doğrulama, iletişim formunda honeypot + IP bazlı rate limiting.
- **SEO:** Sayfa bazlı `generateMetadata`, Open Graph/Twitter Card desteği, dinamik `sitemap.xml` ve `robots.txt`.
- **Performans:** Server Components, `next/image` optimizasyonu, lazy loading.
- **Erişilebilirlik:** ARIA etiketleri, klavye ile gezinebilir menüler, semantik HTML.

## Bilinen Sınırlamalar / Sonraki Adımlar

- Blog altyapısı (Prisma modeli + repository/servis) hazır, ancak genel/admin blog sayfaları henüz eklenmedi — mevcut desenler (Prices/Campaigns yöneticileri) örnek alınarak hızlıca eklenebilir.
- Bu geliştirme ortamında çalışan bir PostgreSQL örneği bulunmadığından uygulama gerçek bir veritabanına karşı runtime'da test edilemedi; `npm run build`, `npx tsc --noEmit` ve `npx eslint .` hatasız geçmektedir. Bir veritabanı bağlayıp `db:push` + `db:seed` çalıştırdıktan sonra `npm run dev` ile uçtan uca test etmeniz gerekir.
- Rate limiting bellek içi (in-memory) olarak uygulanmıştır; tek sunuculu deploylar için yeterlidir, çoklu instance/serverless deploylarda Redis tabanlı bir çözüme (örn. Upstash) geçilmelidir.
