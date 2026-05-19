"use client";

import { useState, useRef, useEffect } from "react";
import { X, Check, ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  file: File;
  aspectRatio: "square" | "wide";
  onConfirm: (croppedFile: File) => void;
  onCancel: () => void;
}

export default function ImageCropModal({ file, aspectRatio, onConfirm, onCancel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const DISPLAY = aspectRatio === "square" ? { w: 320, h: 320 } : { w: 480, h: 200 };
  const OUTPUT  = aspectRatio === "square" ? { w: 400, h: 400 } : { w: 1200, h: 500 };

  // Load image and auto-fit
  useEffect(() => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const fitScale = Math.max(DISPLAY.w / img.naturalWidth, DISPLAY.h / img.naturalHeight);
      setScale(fitScale);
      setOffset({
        x: (DISPLAY.w - img.naturalWidth * fitScale) / 2,
        y: (DISPLAY.h - img.naturalHeight * fitScale) / 2,
      });
      setImgEl(img);
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // Draw on canvas
  useEffect(() => {
    if (!imgEl || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    ctx.clearRect(0, 0, DISPLAY.w, DISPLAY.h);
    ctx.drawImage(imgEl, offset.x, offset.y, imgEl.naturalWidth * scale, imgEl.naturalHeight * scale);

    // Circle overlay for square (avatar)
    if (aspectRatio === "square") {
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      // dim outside circle
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(0, 0, DISPLAY.w, DISPLAY.h);
      // cut circle
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(DISPLAY.w / 2, DISPLAY.h / 2, DISPLAY.w / 2 - 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      // border
      ctx.strokeStyle = "#900a7d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(DISPLAY.w / 2, DISPLAY.h / 2, DISPLAY.w / 2 - 8, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // rect border
      ctx.strokeStyle = "#900a7d";
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 4, DISPLAY.w - 8, DISPLAY.h - 8);
    }
  }, [imgEl, scale, offset, aspectRatio, DISPLAY.w, DISPLAY.h]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setDragging(false);

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setDragging(true);
    setDragStart({ x: t.clientX - offset.x, y: t.clientY - offset.y });
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    const t = e.touches[0];
    setOffset({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y });
  };

  async function handleConfirm() {
    if (!imgEl) return;
    const out = document.createElement("canvas");
    out.width = OUTPUT.w;
    out.height = OUTPUT.h;
    const ctx = out.getContext("2d")!;
    const ratio = OUTPUT.w / DISPLAY.w;
    ctx.drawImage(
      imgEl,
      offset.x * ratio, offset.y * ratio,
      imgEl.naturalWidth * scale * ratio,
      imgEl.naturalHeight * scale * ratio
    );
    out.toBlob(blob => {
      if (!blob) return;
      onConfirm(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
    }, "image/jpeg", 0.92);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }}>
      <div className="bg-white rounded-2xl p-6 shadow-2xl w-full" style={{ maxWidth: "560px" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg" style={{ color: "#1a1a1a" }}>Uredi fotografiju</h3>
            <p className="text-xs mt-0.5" style={{ color: "#888" }}>Prevuci da pozioniraj • Zum za veličinu</p>
          </div>
          <button onClick={onCancel} className="p-1.5 rounded-lg" style={{ color: "#888" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f5")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <X size={18} />
          </button>
        </div>

        {/* Canvas */}
        <div className="mx-auto overflow-hidden rounded-xl mb-4"
          style={{ width: DISPLAY.w, height: DISPLAY.h, maxWidth: "100%", cursor: dragging ? "grabbing" : "grab" }}>
          <canvas
            ref={canvasRef}
            width={DISPLAY.w}
            height={DISPLAY.h}
            style={{ display: "block", maxWidth: "100%", height: "auto" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          />
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setScale(s => Math.max(0.1, s - 0.1))} className="p-1" style={{ color: "#888" }}>
            <ZoomOut size={18} />
          </button>
          <input
            type="range" min={0.1} max={5} step={0.01} value={scale}
            onChange={e => setScale(parseFloat(e.target.value))}
            className="flex-1" style={{ accentColor: "#900a7d" }}
          />
          <button onClick={() => setScale(s => Math.min(5, s + 0.1))} className="p-1" style={{ color: "#888" }}>
            <ZoomIn size={18} />
          </button>
          <span className="text-xs w-10 text-right" style={{ color: "#888" }}>{Math.round(scale * 100)}%</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
            style={{ color: "#555", borderColor: "#e2e8f0" }}>
            Odustani
          </button>
          <button onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
            style={{ background: "#900a7d", boxShadow: "0 4px 14px rgba(144,10,125,0.3)" }}>
            <Check size={15} /> Primijeni
          </button>
        </div>
      </div>
    </div>
  );
}
