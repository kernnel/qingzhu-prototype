// B端 3.3 个人中心页 (UserCenterV2)
import { Settings, ShoppingBag, Plus, Eye, Download, ChevronRight, ImageOff } from "lucide-react";
import { mockUser, mockAlbums } from "@/lib/mockData";

interface Props {
  onAlbumClick: (albumId: string) => void;
  onNewAlbum: () => void;
  onSettings: () => void;
  onUpgrade: () => void;
}

const statusLabel = (s: string) => s === "active" ? "进行中" : "已过期";
const statusClass = (s: string) => s === "active" ? "badge-active" : "badge-expired";

export default function BUserCenter({ onAlbumClick, onNewAlbum, onSettings, onUpgrade }: Props) {
  const pct = Math.round((mockUser.todayUploaded / mockUser.dailyLimit) * 100);
  const r = 28, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div style={{ background: "#f9fafb", minHeight: 700, paddingBottom: 100 }}>
      {/* User Card */}
      <div style={{ background: "#fff", padding: "16px 16px 20px", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <img src={mockUser.avatar} alt="" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover" }} />
              <span style={{ position: "absolute", bottom: -2, right: -4, background: "#22c55e", color: "white", fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 8 }}>标准版</span>
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{mockUser.name}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>摄影师认证账号</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <button style={{ background: "none", border: "none", color: "#6b7280", padding: 0 }}><ShoppingBag size={20} /></button>
            <button onClick={onSettings} style={{ background: "none", border: "none", color: "#6b7280", padding: 0 }}><Settings size={20} /></button>
          </div>
        </div>
      </div>

      {/* Quota Card */}
      <div style={{ background: "#fff", margin: "0 12px 12px", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 16 }}>
        <svg width={70} height={70} viewBox="0 0 70 70">
          <circle cx={35} cy={35} r={r} fill="none" stroke="#f3f4f6" strokeWidth={6} />
          <circle cx={35} cy={35} r={r} fill="none" stroke="#22c55e" strokeWidth={6}
            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
            transform="rotate(-90 35 35)" />
          <text x={35} y={40} textAnchor="middle" fontSize={13} fontWeight={700} fill="#111827">{pct}%</text>
        </svg>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>今日上传额度</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{mockUser.todayUploaded}<span style={{ fontSize: 14, color: "#9ca3af", fontWeight: 400 }}>/{mockUser.dailyLimit}</span></div>
          <button onClick={onUpgrade} style={{ marginTop: 6, fontSize: 12, color: "#22c55e", background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 2, fontWeight: 600 }}>升级满足版 <ChevronRight size={12} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "8px 12px", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center", color: "#6b7280", fontSize: 11 }}><Eye size={12} />今日浏览</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{mockUser.todayViews}</div>
          </div>
          <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "8px 12px", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center", color: "#6b7280", fontSize: 11 }}><Download size={12} />今日保存</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{mockUser.todaySaves}</div>
          </div>
        </div>
      </div>

      {/* Album List */}
      <div style={{ padding: "0 12px" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 10 }}>我的相册</div>

        {mockAlbums.length === 0 ? (
          /* Empty State */
          <div style={{ background: "#fff", borderRadius: 16, padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <ImageOff size={48} color="#d1d5db" />
            <p style={{ fontSize: 14, color: "#9ca3af", textAlign: "center" }}>还没有相册，快去创建一个吧</p>
            <button onClick={onNewAlbum} style={{ marginTop: 4, padding: "10px 24px", borderRadius: 20, background: "#22c55e", color: "white", fontSize: 14, fontWeight: 600, border: "none" }}>新建相册</button>
          </div>
        ) : (
          /* Waterfall Grid */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {mockAlbums.map((album) => (
              <button key={album.id} onClick={() => onAlbumClick(album.id)} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "none", padding: 0, textAlign: "left", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ position: "relative" }}>
                  <img src={album.cover} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
                  <span className={statusClass(album.status)} style={{ position: "absolute", top: 6, left: 6, fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 10 }}>{statusLabel(album.status)}</span>
                </div>
                <div style={{ padding: "8px 10px 10px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{album.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af" }}>
                    <span>{album.photoCount}张</span>
                    <span><Eye size={10} style={{ display: "inline", verticalAlign: "middle" }} /> {album.views}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#d1d5db", marginTop: 3 }}>{album.createdAt}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Pagination hint */}
        {mockAlbums.length > 0 && (
          <div style={{ textAlign: "center", padding: "16px 0", fontSize: 12, color: "#d1d5db" }}>没有更多了</div>
        )}
      </div>

      {/* FAB */}
      <button onClick={onNewAlbum} style={{ position: "fixed", bottom: 80, right: 24, width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", fontSize: 28, border: "none", boxShadow: "0 6px 16px rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
        <Plus size={24} />
      </button>
    </div>
  );
}
