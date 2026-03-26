// C端 4.3 顾客相册列表页 (ClientAlbumList)
import { Trash2, Clock } from "lucide-react";
import { mockClientAlbums } from "@/lib/mockData";
import { toast } from "sonner";

interface Props { onAlbumClick: (id: string) => void; onCreateAlbum: () => void; }

export default function CClientAlbumList({ onAlbumClick, onCreateAlbum }: Props) {
  const albums = mockClientAlbums;

  return (
    <div style={{ background: "#f9fafb", minHeight: 700, paddingBottom: 80 }}>
      {albums.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 24px", gap: 16 }}>
          <div style={{ fontSize: 56 }}>📷</div>
          <p style={{ fontSize: 15, color: "#6b7280", textAlign: "center" }}>还没有看过的相册</p>
          <button onClick={onCreateAlbum} style={{ width: "100%", height: 48, borderRadius: 24, background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", fontSize: 15, fontWeight: 700, border: "none" }}>我也要创建相册</button>
        </div>
      ) : (
        <>
          <div style={{ padding: "16px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {albums.map(album => (
              <button key={album.id} onClick={() => onAlbumClick(album.id)}
                style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "none", padding: 0, textAlign: "left", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <img src={album.cover} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
                <div style={{ padding: "8px 10px 10px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{album.name}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{album.photographer}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#d1d5db", marginTop: 3 }}>
                    <Clock size={9} />{album.viewedAt}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Promo bar */}
          <div style={{ position: "absolute", bottom: 34, left: 0, right: 0, margin: "0 12px", background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#374151" }}>想拥有同款相册？</span>
            <button onClick={onCreateAlbum} style={{ fontSize: 13, color: "#16a34a", fontWeight: 700, background: "none", border: "none" }}>免费创建 &gt;</button>
          </div>
        </>
      )}
    </div>
  );
}
