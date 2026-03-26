// C端 4.1 相册分享落地页 (ShareView)
import { useState } from "react";
import { Share2, Download, ImageDown, ChevronRight, AlertTriangle, Check, X } from "lucide-react";
import { mockAlbums, PHOTO_GRID, mockPhotographer } from "@/lib/mockData";
import { toast } from "sonner";

interface Props {
  albumId: string;
  onHome: () => void;
  onPhotographer: () => void;
  onShare: (selected: number[]) => void;
}

export default function CShareView({ albumId, onHome, onPhotographer, onShare }: Props) {
  const album = mockAlbums.find(a => a.id === albumId) || mockAlbums[0];
  const [multiSelect, setMultiSelect] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [downloading, setDownloading] = useState(false);
  const [dlProgress, setDlProgress] = useState(0);
  const isExpiringSoon = album.daysLeft >= 0 && album.daysLeft <= 3;

  const toggleSelect = (i: number) => {
    const next = new Set(selected);
    next.has(i) ? next.delete(i) : next.add(i);
    setSelected(next);
  };

  const handleDownload = () => {
    setDownloading(true);
    setDlProgress(0);
    const total = multiSelect ? selected.size : PHOTO_GRID.length;
    let count = 0;
    const iv = setInterval(() => {
      count++;
      setDlProgress(count);
      if (count >= total) { clearInterval(iv); }
    }, 300);
  };

  return (
    <div style={{ background: "#f9fafb", minHeight: 700, paddingBottom: 90 }}>
      {/* Cover */}
      <div style={{ position: "relative", height: 180 }}>
        <img src={album.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.75))" }} />
        <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 4 }}>{album.name}</h2>
          <div style={{ display: "flex", gap: 12, fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
            <span>{album.photoCount} 张照片</span>
            <span style={{ color: isExpiringSoon ? "#fbbf24" : "rgba(255,255,255,0.8)" }}>
              {album.status === "active" ? (album.daysLeft <= 0 ? "今日过期" : `${album.daysLeft}天后过期`) : "已过期"}
            </span>
          </div>
        </div>
      </div>

      {/* Top action bar */}
      <div style={{ background: "#fff", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#6b7280" }}>共 {PHOTO_GRID.length} 张照片</span>
        <button onClick={() => { setMultiSelect(!multiSelect); setSelected(new Set()); }}
          style={{ fontSize: 13, fontWeight: 600, color: multiSelect ? "#ef4444" : "#22c55e", background: "none", border: "none" }}>
          {multiSelect ? "取消选择" : "选择"}
        </button>
      </div>

      {/* Photo Grid */}
      <div style={{ background: "#fff", padding: "12px" }}>
        <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>2026年3月20日</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
          {PHOTO_GRID.map((src, i) => (
            <div key={i} onClick={() => multiSelect && toggleSelect(i)} style={{ position: "relative", aspectRatio: "1" }}>
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4, filter: multiSelect && selected.has(i) ? "brightness(0.7)" : "none" }} />
              {multiSelect && selected.has(i) && (
                <div style={{ position: "absolute", top: 4, right: 4, width: 18, height: 18, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={10} color="white" strokeWidth={3} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", padding: "16px 0 4px", fontSize: 12, color: "#d1d5db" }}>没有更多了</div>
      </div>

      {/* Photographer Card */}
      <div style={{ margin: "12px 12px 0", background: "#fff", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <img src={mockPhotographer.avatar} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{mockPhotographer.name}</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>专业婚礼纪实摄影师</div>
        </div>
        <button onClick={onPhotographer} style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 12, color: "#22c55e", fontWeight: 600, background: "none", border: "none" }}>
          查看更多 <ChevronRight size={12} />
        </button>
      </div>

      {/* Bottom Bar */}
      <div style={{ position: "absolute", bottom: 34, left: 0, right: 0, padding: "0 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        {isExpiringSoon && (
          <div style={{ background: "#fff7ed", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={14} color="#f97316" />
            <span style={{ fontSize: 12, color: "#c2410c", fontWeight: 500 }}>相册将在 {album.daysLeft <= 0 ? "今天" : album.daysLeft + "天后"}过期，请尽快下载</span>
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => multiSelect && selected.size > 0 ? onShare(Array.from(selected)) : toast.info("请先选择照片")}
            style={{ width: 48, height: 48, borderRadius: 24, border: "1.5px solid #e5e7eb", background: multiSelect && selected.size > 0 ? "#22c55e" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Share2 size={18} color={multiSelect && selected.size > 0 ? "white" : "#374151"} />
          </button>
          {!multiSelect ? (
            <>
              <button onClick={handleDownload} style={{ flex: 1, height: 48, borderRadius: 24, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <Download size={14} />极速下载
              </button>
              <button onClick={handleDownload} style={{ flex: 1, height: 48, borderRadius: 24, background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", fontSize: 14, fontWeight: 700, border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <ImageDown size={14} />获取原图
              </button>
            </>
          ) : (
            <button onClick={handleDownload} style={{ flex: 1, height: 48, borderRadius: 24, background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", fontSize: 15, fontWeight: 700, border: "none" }}>
              下载已选 ({selected.size})
            </button>
          )}
        </div>
      </div>

      {/* Download Progress Panel */}
      {downloading && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ position: "relative", width: 100, height: 100, marginBottom: 20 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8"/>
              <circle cx="50" cy="50" r="44" fill="none" stroke="#22c55e" strokeWidth="8"
                strokeDasharray={`${(dlProgress / PHOTO_GRID.length) * 276} 276`}
                strokeLinecap="round" transform="rotate(-90 50 50)"
                style={{ transition: "stroke-dasharray 0.3s" }}/>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <Download size={20} color="white" />
              <span style={{ fontSize: 12, color: "white", marginTop: 4, fontWeight: 600 }}>{dlProgress}/{PHOTO_GRID.length}</span>
            </div>
          </div>
          <p style={{ color: "white", fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
            {dlProgress >= PHOTO_GRID.length ? "下载完成 🎉" : "正在下载..."}
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 32 }}>请勿离开当前页面</p>
          {dlProgress >= PHOTO_GRID.length && (
            <button onClick={() => setDownloading(false)} style={{ padding: "12px 40px", borderRadius: 24, background: "#22c55e", color: "white", fontSize: 16, fontWeight: 700, border: "none" }}>完成</button>
          )}
        </div>
      )}
    </div>
  );
}
