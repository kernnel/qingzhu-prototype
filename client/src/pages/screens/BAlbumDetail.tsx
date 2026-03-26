// B端 3.5 相册详情与管理页 (AlbumDetail)
import { useState } from "react";
import { Edit2, Plus, Share2, Check, X, ImageOff, AlertCircle } from "lucide-react";
import { mockAlbums, PHOTO_GRID } from "@/lib/mockData";
import { toast } from "sonner";

interface Props { albumId: string; onBack: () => void; onUpgrade: () => void; }

export default function BAlbumDetail({ albumId, onBack, onUpgrade }: Props) {
  const album = mockAlbums.find(a => a.id === albumId) || mockAlbums[0];
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const photos = albumId === "album-001" ? PHOTO_GRID : albumId === "album-002" ? PHOTO_GRID.slice(0, 6) : [];
  const isEmpty = photos.length === 0;

  const handleAddPhoto = () => {
    if (albumId === "album-003") { setShowLimitModal(true); return; }
    if (albumId === "album-004") { setShowTrialModal(true); return; }
    toast.success("已发起系统相册选图流程");
  };

  const toggleSelect = (i: number) => {
    const next = new Set(selected);
    next.has(i) ? next.delete(i) : next.add(i);
    setSelected(next);
  };

  return (
    <div style={{ background: "#f9fafb", minHeight: 700, paddingBottom: 90 }}>
      {/* Cover */}
      <div style={{ position: "relative", height: 200 }}>
        <img src={album.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))" }} />
        <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 4 }}>{album.name}</h2>
          <div style={{ display: "flex", gap: 12, fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
            <span>{album.photoCount} 张照片</span>
            <span>·</span>
            <span style={{ color: album.daysLeft <= 3 && album.daysLeft >= 0 ? "#fbbf24" : "rgba(255,255,255,0.8)" }}>
              {album.status === "active" ? `${album.daysLeft <= 0 ? "今日" : album.daysLeft + "天"}后过期` : "已过期"}
            </span>
          </div>
        </div>
      </div>

      {/* Edit mode top bar */}
      {editMode && (
        <div style={{ background: "#fff", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6" }}>
          <button onClick={() => { setEditMode(false); setSelected(new Set()); }} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 14 }}>取消</button>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>已选 {selected.size} 项</span>
          <button onClick={() => setSelected(new Set(photos.map((_, i) => i)))} style={{ background: "none", border: "none", color: "#22c55e", fontSize: 14, fontWeight: 600 }}>全选</button>
        </div>
      )}

      {/* Photo Grid */}
      <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", marginTop: -12, padding: "16px 12px" }}>
        {isEmpty ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px", gap: 12 }}>
            <ImageOff size={48} color="#d1d5db" />
            <p style={{ fontSize: 14, color: "#9ca3af", textAlign: "center" }}>相册还是空的，快去上传照片吧</p>
            <button onClick={handleAddPhoto} style={{ padding: "10px 24px", borderRadius: 20, background: "#22c55e", color: "white", fontSize: 14, fontWeight: 600, border: "none" }}>添加照片</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>2026年3月20日</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
              {photos.map((src, i) => (
                <div key={i} onClick={() => editMode && toggleSelect(i)} style={{ position: "relative", aspectRatio: "1", cursor: editMode ? "pointer" : "default" }}>
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4, filter: editMode && selected.has(i) ? "brightness(0.7)" : "none" }} />
                  {editMode && selected.has(i) && (
                    <div style={{ position: "absolute", top: 4, right: 4, width: 18, height: 18, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={10} color="white" strokeWidth={3} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", padding: "16px 0 4px", fontSize: 12, color: "#d1d5db" }}>没有更多了</div>
          </>
        )}
      </div>

      {/* Bottom Bar */}
      {!editMode ? (
        <div style={{ position: "absolute", bottom: 34, left: 0, right: 0, padding: "0 12px", display: "flex", gap: 8 }}>
          <button onClick={() => setEditMode(true)} style={{ height: 44, borderRadius: 22, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, padding: "0 16px" }}>
            <Edit2 size={14} style={{ display: "inline", marginRight: 4 }} />编辑
          </button>
          <button onClick={handleAddPhoto} style={{ flex: 1, height: 44, borderRadius: 22, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <Plus size={14} />添加照片
          </button>
          <button onClick={() => toast.success("分享链接已生成")} style={{ flex: 1.2, height: 44, borderRadius: 22, background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", fontSize: 13, fontWeight: 700, border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <Share2 size={14} />一键分享交片
          </button>
        </div>
      ) : (
        <div style={{ position: "absolute", bottom: 34, left: 0, right: 0, padding: "0 12px", display: "flex", gap: 8 }}>
          {[
            { label: "下载", action: () => toast.info("下载选中照片") },
            { label: "设为封面", action: () => toast.info("已设为封面") },
            { label: "删除", action: () => toast.error("已删除选中照片"), danger: true },
          ].map(btn => (
            <button key={btn.label} onClick={btn.action}
              style={{ flex: 1, height: 44, borderRadius: 22, border: `1.5px solid ${btn.danger ? "#fca5a5" : "#e5e7eb"}`, background: btn.danger ? "#fff5f5" : "#fff", color: btn.danger ? "#ef4444" : "#374151", fontSize: 14, fontWeight: 600 }}>
              {btn.label}
            </button>
          ))}
        </div>
      )}

      {/* Limit Modal */}
      {showLimitModal && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: "24px 20px 40px", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><AlertCircle size={20} color="#f97316" /><span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>上传额度已用尽</span></div>
              <button onClick={() => setShowLimitModal(false)} style={{ background: "none", border: "none" }}><X size={20} color="#9ca3af" /></button>
            </div>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20, lineHeight: 1.6 }}>当日上传额度已用尽，升级满足版可获得 500 张/日的上传额度。</p>
            <button onClick={() => { setShowLimitModal(false); onUpgrade(); }} style={{ width: "100%", height: 48, borderRadius: 24, background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", fontSize: 16, fontWeight: 700, border: "none" }}>升级满足版</button>
          </div>
        </div>
      )}

      {/* Trial Modal */}
      {showTrialModal && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: "24px 20px 40px", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>🎉 开启免费体验</span>
              <button onClick={() => setShowTrialModal(false)} style={{ background: "none", border: "none" }}><X size={20} color="#9ca3af" /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {["200张/日上传额度", "相册7天有效期", "一键分享交片"].map(p => (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Check size={14} color="#22c55e" strokeWidth={3} />
                  <span style={{ fontSize: 14, color: "#374151" }}>{p}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { setShowTrialModal(false); toast.success("免费体验已开启！"); }} style={{ width: "100%", height: 48, borderRadius: 24, background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", fontSize: 16, fontWeight: 700, border: "none" }}>立即开启免费体验</button>
          </div>
        </div>
      )}
    </div>
  );
}
