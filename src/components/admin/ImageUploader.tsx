"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Crop } from "lucide-react";
import toast from "react-hot-toast";
import ImageCropModal from "./ImageCropModal";

interface ImageUploaderProps {
  label: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  type: "avatar" | "cover" | "gallery";
  aspectRatio?: "square" | "wide";
}

export default function ImageUploader({ label, value, onChange, type, aspectRatio = "wide" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    if (file.size > 5 * 1024 * 1024) { toast.error("Fajl mora biti manji od 5MB"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", type);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onChange(data.url);
      toast.success("Slika uploadovana!");
    } catch { toast.error("Upload nije uspio."); }
    finally { setUploading(false); }
  }

  function handleFileSelect(file: File) {
    if (!file.type.startsWith("image/")) { toast.error("Samo slike su dozvoljene"); return; }
    // Open crop modal first
    setCropFile(file);
  }

  function handleCropConfirm(croppedFile: File) {
    setCropFile(null);
    uploadFile(croppedFile);
  }

  return (
    <>
      {cropFile && (
        <ImageCropModal
          file={cropFile}
          aspectRatio={aspectRatio}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropFile(null)}
        />
      )}

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>{label}</label>
        {value ? (
          <div className="relative group">
            <div className={`relative rounded-xl overflow-hidden border ${aspectRatio === "square" ? "w-24 h-24" : "w-full h-32"}`}
              style={{ borderColor: "var(--border)" }}>
              <Image src={value} alt={label} fill className="object-cover" sizes="200px" />
            </div>
            {/* Overlay buttons */}
            <div className="absolute inset-0 rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.4)" }}>
              <button type="button" onClick={() => inputRef.current?.click()}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ background: "rgba(144,10,125,0.9)" }} title="Zamijeni i uredi">
                <Crop size={14} />
              </button>
              <button type="button" onClick={() => onChange(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ background: "rgba(239,68,68,0.9)" }} title="Ukloni">
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
            onDragOver={e => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className={`relative rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 border-dashed ${aspectRatio === "square" ? "w-24 h-24" : "w-full h-28"}`}
            style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--primary)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            {uploading
              ? <Loader2 size={20} className="animate-spin" style={{ color: "var(--primary)" }} />
              : <>
                  <Upload size={18} style={{ color: "var(--text-muted)" }} className="mb-1" />
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Upload</span>
                </>
            }
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); e.target.value = ""; }} />
      </div>
    </>
  );
}
