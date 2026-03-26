import { useLocation, useSearch } from "wouter";
import { mockAlbums, mockPhotographer, PHOTOGRAPHER_AVATAR } from "@/lib/mockData";

function StatusBar() {
  return (
    <div style={{ height: "44px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
      <span style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif" }}>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="4" width="3" height="8" rx="1" fill="#1A1A1A"/>
          <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill="#1A1A1A"/>
          <rect x="9" y="0.5" width="3" height="11.5" rx="1" fill="#1A1A1A"/>
          <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#1A1A1A" opacity="0.3"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 2.5C10.2 2.5 12.2 3.4 13.6 4.9L15 3.4C13.2 1.5 10.7 0.3 8 0.3C5.3 0.3 2.8 1.5 1 3.4L2.4 4.9C3.8 3.4 5.8 2.5 8 2.5Z" fill="#1A1A1A"/>
          <path d="M8 5.5C9.4 5.5 10.7 6.1 11.6 7L13 5.5C11.7 4.2 9.9 3.4 8 3.4C6.1 3.4 4.3 4.2 3 5.5L4.4 7C5.3 6.1 6.6 5.5 8 5.5Z" fill="#1A1A1A"/>
          <circle cx="8" cy="10" r="1.8" fill="#1A1A1A"/>
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <div style={{ width: "22px", height: "11px", borderRadius: "3px", border: "1.2px solid #1A1A1A", padding: "1.5px", display: "flex", alignItems: "center" }}>
            <div style={{ width: "65%", height: "100%", borderRadius: "1.5px", background: "#1A1A1A" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AlbumExpired() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const GREEN = "#07C160";

  // 解析 URL 参数 albumId，例如 /album-expired?albumId=album-003
  const params = new URLSearchParams(search);
  const albumId = params.get("albumId");

  // 根据 albumId 查找相册数据，找不到则使用默认值
  const album = albumId ? mockAlbums.find(a => a.id === albumId) : null;
  const albumName = album?.name ?? "该相册";
  const photographer = mockPhotographer;

  return (
    <div style={{
      background: "#F7F8FA",
      fontFamily: "'Noto Sans SC', sans-serif",
      maxWidth: "390px",
      margin: "0 auto",
      height: "100dvh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      <StatusBar />

      {/* 导航栏 */}
      <div className="flex items-center justify-between px-4 flex-shrink-0 relative" style={{ height: "44px" }}>
        <button
          className="flex items-center justify-center active:opacity-60 transition-opacity"
          style={{ width: "36px", height: "36px" }}
          onClick={() => navigate("/home")}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="#1A1A1A" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M9 21V12h6v9" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 style={{ fontSize: "17px", fontWeight: 600, color: "#1A1A1A", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          相册详情
        </h1>
        <div style={{ width: "36px" }} />
      </div>

      {/* 主内容区：垂直居中 */}
      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{ padding: "0 32px 60px" }}
      >
        {/* 中央图标 */}
        <div
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            background: `rgba(7,193,96,0.10)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "28px",
          }}
        >
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="18" stroke={GREEN} strokeWidth="2.2"/>
            <path d="M26 16v10l6 4" stroke={GREEN} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M38 14L14 38" stroke={GREEN} strokeWidth="2.4" strokeLinecap="round"/>
            <circle cx="26" cy="26" r="22" stroke={GREEN} strokeWidth="2.2"/>
          </svg>
        </div>

        {/* 相册名称标签（有 albumId 时展示） */}
        {album && (
          <div
            style={{
              background: "rgba(7,193,96,0.08)",
              border: "1px solid rgba(7,193,96,0.20)",
              borderRadius: "8px",
              padding: "6px 14px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="10" rx="2" stroke={GREEN} strokeWidth="1.4"/>
              <circle cx="5.5" cy="7" r="1.2" fill={GREEN}/>
              <path d="M2 11l3-3 2.5 2.5L11 7l3 3" stroke={GREEN} strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: "13px", color: GREEN, fontWeight: 600 }}>{albumName}</span>
          </div>
        )}

        {/* 大标题 */}
        <h2 style={{
          fontSize: "22px",
          fontWeight: 700,
          color: "#1A1A1A",
          textAlign: "center",
          marginBottom: "14px",
          lineHeight: 1.3,
        }}>
          该相册已过期
        </h2>

        {/* 说明文字 */}
        <p style={{
          fontSize: "14px",
          color: "#8E8E93",
          textAlign: "center",
          lineHeight: 1.8,
          marginBottom: "36px",
        }}>
          由于超过了分享有效期，该相册内容已无法查看。如有疑问，请联系您的摄影师。
        </p>

        {/* 摄影师信息卡片 */}
        <div
          style={{
            width: "100%",
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 1px 8px rgba(0,0,0,0.07)",
          }}
        >
          {/* 头像 */}
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              flexShrink: 0,
              overflow: "hidden",
              background: "linear-gradient(135deg, #2C3E50 0%, #4A6741 100%)",
            }}
          >
            <img
              src={PHOTOGRAPHER_AVATAR}
              alt={photographer.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          {/* 文字信息 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "11px", color: "#9A9A9F", fontFamily: "'Noto Sans SC', sans-serif", marginBottom: "2px" }}>服务提供方</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", lineHeight: 1.2 }}>
              {photographer.name}
            </div>
            <div style={{ fontSize: "12px", color: "#6B6B6B", fontFamily: "'Noto Sans SC', sans-serif", marginTop: "2px" }}>
              {photographer.city} · 人像摄影师
            </div>
          </div>
          {/* 联系摄影师按钮 */}
          <button
            onClick={() => navigate("/photographer")}
            className="active:opacity-75 transition-opacity"
            style={{
              flexShrink: 0,
              height: "38px",
              padding: "0 18px",
              background: "#1A1A1A",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF", fontFamily: "'Noto Sans SC', sans-serif", whiteSpace: "nowrap" }}>联系摄影师</span>
          </button>
        </div>

        {/* 相册 ID 信息（有 albumId 时展示） */}
        {albumId && (
          <p style={{ fontSize: "11px", color: "#C8C8C8", marginTop: "20px", textAlign: "center" }}>
            相册 ID：{albumId}
          </p>
        )}
      </div>
    </div>
  );
}
