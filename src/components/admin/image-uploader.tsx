"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type UploadedImage = { url: string; publicId: string };

function uploadWithProgress(
  file: File,
  folder: string,
  onProgress: (percent: number) => void
): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && json.success) {
          resolve(json.data);
        } else {
          reject(new Error(json.error ?? "Yükleme başarısız"));
        }
      } catch {
        reject(new Error("Yükleme başarısız"));
      }
    };

    xhr.onerror = () => reject(new Error("Yükleme başarısız"));
    xhr.send(formData);
  });
}

type ImageUploaderProps = {
  folder: string;
  multiple?: boolean;
  value?: string | null;
  onUploaded: (images: UploadedImage[]) => void;
};

export function ImageUploader({ folder, multiple = false, value, onUploaded }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progressList, setProgressList] = useState<{ name: string; progress: number }[]>([]);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const fileArray = multiple ? Array.from(files) : [files[0]];

      setProgressList(fileArray.map((f) => ({ name: f.name, progress: 0 })));

      const results: UploadedImage[] = [];
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        try {
          const result = await uploadWithProgress(file, folder, (percent) => {
            setProgressList((prev) =>
              prev.map((p, idx) => (idx === i ? { ...p, progress: percent } : p))
            );
          });
          results.push(result);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Yükleme başarısız");
        }
      }

      setProgressList([]);
      if (results.length > 0) onUploaded(results);
    },
    [folder, multiple, onUploaded]
  );

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/40"
        )}
      >
        <UploadCloud className="size-8 text-muted-foreground" />
        <p className="text-sm font-medium">Görsel yüklemek için tıklayın veya sürükleyin</p>
        <p className="text-xs text-muted-foreground">JPEG, PNG, WEBP — maks. 8MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {progressList.length > 0 && (
        <div className="space-y-2">
          {progressList.map((p) => (
            <div key={p.name} className="flex items-center gap-2 text-sm">
              <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
              <span className="flex-1 truncate">{p.name}</span>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              <span className="w-10 text-right text-muted-foreground">{p.progress}%</span>
            </div>
          ))}
        </div>
      )}

      {value && (
        <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-lg border">
          <Image src={value} alt="Önizleme" fill className="object-cover" />
        </div>
      )}
    </div>
  );
}

export function RemovableImagePreview({
  url,
  onRemove,
}: {
  url: string;
  onRemove: () => void;
}) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg border">
      <Image src={url} alt="Görsel" fill className="object-cover" />
      <button
        type="button"
        onClick={onRemove}
        aria-label="Görseli kaldır"
        className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
