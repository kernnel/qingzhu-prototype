// B端 3.1 产品首页 (Home)
import { Camera, Zap, Share2, BarChart2, User } from "lucide-react";
import { HERO_BG } from "@/lib/mockData";

interface Props { onNewAlbum: () => void; onUserCenter: () => void; }

export default function BHome({ onNewAlbum, onUserCenter }: Props) {
  return (
    <div style={{ minHeight: 700, display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Hero BG */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15 }} />

      {/* Nav left slot: user avatar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 44, display: "flex", alignItems: "center", padding: "0 16px", zIndex: 5 }}>
        <button onClick={onUserCenter} style={{ background: "none", border: "none", padding: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={16} color="white" />
          </div>
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 32px 120px", position: "relative", zIndex: 2 }}>
        {/* Logo */}
        <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: "0 8px 24px rgba(34,197,94,0.35)" }}>
          <Camera size={36} color="white" />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 8, textAlign: "center", fontFamily: "'Noto Sans SC', sans-serif" }}>青竹快传</h1>
        <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 48, textAlign: "center" }}>拍完即传，快人一步</p>

        {/* Features */}
        <div style={{ display: "flex", gap: 24, marginBottom: 48 }}>
          {[
            { icon: <Zap size={20} color="#22c55e" />, label: "极速上传" },
            { icon: <Share2 size={20} color="#22c55e" />, label: "一键交付" },
            { icon: <BarChart2 size={20} color="#22c55e" />, label: "实时追踪" },
          ].map((f) => (
            <div key={f.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>{f.icon}</div>
              <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom FAB */}
      <div style={{ position: "absolute", bottom: 40, left: 16, right: 16, zIndex: 5 }}>
        <button onClick={onNewAlbum} style={{ width: "100%", height: 52, borderRadius: 26, background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", fontSize: 17, fontWeight: 700, border: "none", boxShadow: "0 8px 20px rgba(34,197,94,0.4)", fontFamily: "'Noto Sans SC', sans-serif" }}>
          新建相册
        </button>
      </div>
    </div>
  );
}
