import { useState, useCallback } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { GALLERY_PHOTOS } from "@/galleryPhotos";

export default function LiveGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const goNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % GALLERY_PHOTOS.length);
  }, [selectedIndex]);

  const goPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      (selectedIndex - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
    );
  }, [selectedIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    },
    [closeLightbox, goNext, goPrev]
  );

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
              ← Back to Home
            </a>
            <div className="w-px h-5 bg-gray-700" />
            <div>
              <h1 className="text-xl font-bold text-white">Live Gallery</h1>
              <p className="text-xs text-gray-400">SCI 2026 — Science at the Core of Innovation</p>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            <span className="font-semibold text-white">{GALLERY_PHOTOS.length}</span> photos
          </div>
        </div>
      </header>

      {/* Gallery Grid */}
      <main className="container py-8">
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 space-y-2">
          {GALLERY_PHOTOS.map((url, index) => (
            <div
              key={index}
              className="break-inside-avoid mb-2 relative group cursor-pointer overflow-hidden rounded-lg bg-gray-800"
              onClick={() => openLightbox(index)}
            >
              {!loadedImages.has(index) && (
                <div className="w-full h-32 bg-gray-800 animate-pulse rounded-lg" />
              )}
              <img
                src={url}
                alt={`Conference photo ${index + 1}`}
                className={`w-full h-auto object-cover rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:brightness-90 ${
                  loadedImages.has(index) ? "opacity-100" : "opacity-0 absolute inset-0"
                }`}
                loading="lazy"
                onLoad={() => handleImageLoad(index)}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8 drop-shadow-lg" />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition-all z-10"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/40 px-4 py-1.5 rounded-full">
            {selectedIndex + 1} / {GALLERY_PHOTOS.length}
          </div>

          {/* Download button */}
          <a
            href={GALLERY_PHOTOS[selectedIndex]}
            download
            target="_blank"
            rel="noreferrer"
            className="absolute top-4 right-16 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition-all z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="w-6 h-6" />
          </a>

          {/* Prev button */}
          <button
            className="absolute left-4 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-3 transition-all z-10"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={GALLERY_PHOTOS[selectedIndex]}
              alt={`Conference photo ${selectedIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Next button */}
          <button
            className="absolute right-4 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-3 transition-all z-10"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      )}
    </div>
  );
}
