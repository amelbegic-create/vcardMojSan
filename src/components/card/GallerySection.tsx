"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function GallerySection({ images, accentColor }: { images: string[]; accentColor: string }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  if (!images?.length) return null;

  return (
    <>
      <section className="mx-4 mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: accentColor }}>Gallery</p>
        <div className="flex flex-col gap-3">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setLightbox(src)}
              className="w-full focus:outline-none rounded-2xl overflow-hidden shadow-sm block text-left"
              style={{ border: "1px solid #e2e8f0", background: "#fff" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                style={{ width: "100%", height: "auto", display: "block" }}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg z-10"
            onClick={() => setLightbox(null)}
          >
            <X size={18} style={{ color: "#0f172a" }} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Gallery"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              width: "auto",
              height: "auto",
              display: "block",
              borderRadius: "16px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      )}
    </>
  );
}
