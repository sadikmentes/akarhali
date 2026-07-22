import { Container } from "@/components/shared/container";

// Turns a user-pasted link into a YouTube embed URL, or returns null when the
// link is not a recognizable YouTube address (then we fall back to a <video>).
function toYouTubeEmbed(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (parsed.pathname.startsWith("/embed/")) return url;
      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function VideoSection({ url, title }: { url?: string | null; title: string }) {
  const trimmed = url?.trim();
  if (!trimmed) return null;

  const embedBase = toYouTubeEmbed(trimmed);
  // mute=1: YouTube gömülü oynatıcı da sesi kapalı başlatsın.
  const embed = embedBase
    ? `${embedBase}${embedBase.includes("?") ? "&" : "?"}mute=1`
    : null;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">{title}</h2>
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border bg-black shadow-lg">
          <div className="relative aspect-video">
            {embed ? (
              <iframe
                src={embed}
                title={title}
                className="absolute inset-0 size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                src={trimmed}
                controls
                // Ses kapalı başlar; ziyaretçi isterse oynatıcıdan açar.
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 size-full object-contain"
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
