/**
 * 青竹快传 · 顾客二次分享页
 * 顾客从相册中选取部分照片分享给朋友时展示此页面
 * 规则：
 *  - 仅展示照片网格，无相册标题/摄影师信息/有效期
 *  - 不可点击放大
 *  - 不可下载
 *  - 顶部仅有返回图标（返回上一页）
 *  - 照片数据从 sessionStorage["clientSharePhotos"] 读取
 */

import WechatStatusBar from "@/components/WechatStatusBar";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const GREEN = "#07C160";

type Photo = { id: number; bg: string; date?: string };

export default function ClientShareView() {
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);

  // 从 sessionStorage 读取选中照片
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("clientSharePhotos");
      if (raw) {
        const parsed: Photo[] = JSON.parse(raw);
        setPhotos(parsed);
      }
    } catch {
      setPhotos([]);
    }
  }, []);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#EFEFEF] flex items-center justify-center p-4">
      <div
        className="relative bg-[#F7F7F7] overflow-hidden shadow-2xl flex flex-col"
        style={{
          width: "390px",
          height: "844px",
          borderRadius: "44px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        {/* 状态栏（含返回按钮和标题，与胶囊齐平） */}
        <WechatStatusBar
          title="我的精选"
          leftSlot={
            <button
              onClick={() => navigate("/home")}
              className="flex items-center justify-center active:opacity-50 transition-opacity"
              style={{ width: "36px", height: "36px" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5Z" stroke="#1A1A1A" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M9 21V12h6v9" stroke="#1A1A1A" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </button>
          }
        />

        {/* 分割线 */}
        <div style={{ height: "0.5px", background: "rgba(0,0,0,0.08)" }} />

        {/* 照片网格（3列，无点击放大，无下载） */}
        <div
          className="flex-1 overflow-y-auto px-4"
          style={{ paddingBottom: "20px" }}
        >
          {/* 24小时有效期提示 */}
          <div
            className="flex items-center gap-2 my-3 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(255,149,0,0.08)", border: "1px solid rgba(255,149,0,0.2)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" stroke="#FF9500" strokeWidth="1.8"/>
              <path d="M12 7v5l3 3" stroke="#FF9500" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: "12px", color: "#B36A00", fontFamily: "'Noto Sans SC', sans-serif", lineHeight: "1.5" }}>
              分享链接有效期为 <strong>24 小时</strong>，请及时转发给好友查看
            </span>
          </div>
          {photos.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "3px",
              }}
            >
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  style={{
                    position: "relative",
                    aspectRatio: "1",
                    borderRadius: "4px",
                    overflow: "hidden",
                    cursor: "default",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: photo.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" opacity="0.35">
                      <rect x="2" y="4" width="20" height="16" rx="2.5" stroke="#555" strokeWidth="1.5" />
                      <circle cx="8.5" cy="10" r="2" stroke="#555" strokeWidth="1.3" />
                      <path d="M2 17l5-5 4 4 3-3 8 7" stroke="#555" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 无照片时的空状态 */
            <div
              className="flex flex-col items-center justify-center"
              style={{ height: "300px", gap: "12px" }}
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.25">
                <rect x="4" y="8" width="40" height="32" rx="5" stroke="#1A1A1A" strokeWidth="2" />
                <circle cx="16" cy="22" r="5" stroke="#1A1A1A" strokeWidth="1.8" />
                <path d="M4 34l12-11 9 9 6-6 13 11" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: "14px", color: "#AAAAAA", fontFamily: "'Noto Sans SC', sans-serif" }}>
                暂无选中的照片
              </span>
            </div>
          )}

        </div>

        {/* 底部品牌水印（固定底部） */}
        <div
          className="flex items-center justify-center gap-2"
          style={{
            padding: "12px 0 28px",
            background: "rgba(247,247,247,0.97)",
            borderTop: "0.5px solid rgba(0,0,0,0.05)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "6px",
              background: GREEN,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 36 36" fill="none">
              <rect x="6" y="10" width="24" height="18" rx="3" stroke="white" strokeWidth="2.5" />
              <circle cx="13" cy="18" r="3" stroke="white" strokeWidth="2" />
              <path d="M6 24L12 18.5L16 22L20 17.5L30 24" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: "12px", color: "#AAAAAA", fontFamily: "'Noto Sans SC', sans-serif" }}>
            由青竹快传分享
          </span>
        </div>


      </div>
    </div>
  );
}
