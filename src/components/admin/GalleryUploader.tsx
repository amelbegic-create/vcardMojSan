"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function GalleryUploader({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!arr.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of arr) {
        const fd = new FormData(); fd.append("file", file); fd.append("type", "gallery");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error();
        urls.push((await res.json()).url);
      }
      onChange([...images, ...urls]);
      toast.success(`${urls.length} slika uploadovano`);
    } catch { toast.error("Upload nije uspio"); }
    finally { setUploading(false); }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Galerija fotografija</label>
      <div className="grid grid-cols-5 gap-2">
        {images.map((src, i) => (
          <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
            <Image src={src} alt="" fill className="object-cover" sizes="100px" />
            <button type="button" onClick={() => onChange(images.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(239,68,68,0.9)" }}>
              <X size={10} />
            </button>
          </div>
        ))}
        <div onClick={() => inputRef.current?.click()}
          className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all"
          style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          {uploading
            ? <Loader2 size={16} className="animate-spin" style={{ color: "var(--primary)" }} />
            : <><Upload size={15} style={{ color: "var(--text-muted)" }} /><span className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>Dodaj</span></>
          }
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ""; }} />
    </div>
  );
}
