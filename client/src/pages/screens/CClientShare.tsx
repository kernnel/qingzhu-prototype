// C端 4.2 二次分享页 (ClientShareView)
import { PHOTO_GRID } from "@/lib/mockData";

interface Props { selectedIndices: number[]; onHome: () => void; }

export default function CClientShare({ selectedIndices, onHome }: Props) {
  const photos = selectedIndices.length > 0 ? selectedIndices.map(i => PHOTO_GRID[i]).filter(Boolean) : [];

  return (
    <div style={{ background: "#fff", minHeight: 700, paddingBottom: 60 }}>
      {photos.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", gap: 12 }}>
          <div style={{ fontSize: 48 }}>🖼️</div>
          <p style={{ fontSize: 14, color: "#9ca3af" }}>暂无选中的照片</p>
        </div>
      ) : (
        <div style={{ padding: "16px 12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
            {photos.map((src, i) => (
              <div key={i} style={{ aspectRatio: "1" }}>
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Brand watermark */}
      <div style={{ position: "absolute", bottom: 34, left: 0, right: 0, textAlign: "center", padding: "12px 0", borderTop: "1px solid #f3f4f6", background: "#fff" }}>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>由 <span style={{ color: "#22c55e", fontWeight: 700 }}>青竹快传</span> 分享</span>
      </div>
    </div>
  );
}
