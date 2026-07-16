import { GalleryManager } from "@/components/admin/gallery-manager";
import { galleryService } from "@/services/gallery.service";

export const metadata = { title: "Galeri" };

export default async function AdminGalleryPage() {
  const images = await galleryService.list();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Galeri Yönetimi</h1>
        <p className="text-muted-foreground">Fotoğrafları yükleyin, kategorilendirin ve yönetin.</p>
      </div>
      <GalleryManager images={images} />
    </div>
  );
}
