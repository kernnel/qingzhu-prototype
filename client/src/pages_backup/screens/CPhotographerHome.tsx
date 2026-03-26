// C端 4.4 摄影师主页 (PhotographerHome)
import { useState } from "react";
import { MapPin, Copy, Check, ExternalLink } from "lucide-react";
import { mockPhotographer, mockAlbums, COVER_1, COVER_2 } from "@/lib/mockData";
import { toast } from "sonner";

interface Props { onAlbumClick: (id: string) => void; onBack: () => void; }

export default function CPhotographerHome({ onAlbumClick, onBack }: Props) {
  const [wechatCopied, setWechatCopied] = useState(false);

  const handleCopyWechat = () => {
    setWechatCopied(true);
    toast.success("微信号已复制，请前往微信添加好友");
    setTimeout(() => setWechatCopied(false), 3000);
  };

  const publicAlbums = mockAlbums.filter(a => a.status === "active");

  return (
    <div style={{ background: "#f9fafb", minHeight: 700, paddingBottom: 80 }}>
      {/* Profile Header */}
      <div style={{ background: "#fff", padding: "20px 16px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <img src={mockPhotographer.avatar} alt="" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{mockPhotographer.name}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
              <MapPin size={12} />{mockPhotographer.city}
            </div>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{mockPhotographer.bio}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", marginTop: 20, borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
          {[
            { label: "作品集", value: mockPhotographer.albumCount },
            { label: "总照片数", value: `${(mockPhotographer.totalPhotos / 1000).toFixed(1)}k` },
            { label: "从业年限", value: `${mockPhotographer.yearsExp}年` },
          ].map(stat => (
            <div key={stat.label} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div style={{ margin: "12px 12px 0", background: "#fff", borderRadius: 16, padding: "16px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 12 }}>联系方式</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleCopyWechat}
            style={{ flex: 1, height: 44, borderRadius: 22, border: `1.5px solid ${wechatCopied ? "#22c55e" : "#e5e7eb"}`, background: wechatCopied ? "#f0fdf4" : "#fff", color: wechatCopied ? "#16a34a" : "#374151", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}>
            {wechatCopied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
            {wechatCopied ? "已复制微信号" : "复制微信号"}
          </button>
          <button onClick={() => toast.info("即将跳转至小红书主页")}
            style={{ flex: 1, height: 44, borderRadius: 22, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <ExternalLink size={14} />小红书主页
          </button>
        </div>
      </div>

      {/* Public Albums */}
      <div style={{ margin: "16px 12px 0" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 10 }}>精选作品</div>
        {publicAlbums.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 16, padding: "32px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#9ca3af" }}>暂无公开作品集</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {publicAlbums.map(album => (
              <button key={album.id} onClick={() => onAlbumClick(album.id)}
                style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "none", padding: 0, textAlign: "left", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <img src={album.cover} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
                <div style={{ padding: "8px 10px 10px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{album.name}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{album.photoCount} 张照片</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
