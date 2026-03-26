/**
 * 青竹快传 · 设置页
 * 内容：相册权限开关
 */

import WechatStatusBar from "@/components/WechatStatusBar";
import { useState } from "react";
import { useLocation } from "wouter";

// ── 状态栏 ──
function StatusBar() {
  return <WechatStatusBar />;
}

// ── iOS 风格 Toggle ──
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="flex-shrink-0 transition-all duration-200"
      style={{
        width: "51px",
        height: "31px",
        borderRadius: "999px",
        background: value ? "#07C160" : "#E5E5EA",
        position: "relative",
        border: "none",
        cursor: "pointer",
        transition: "background 0.2s ease",
        boxShadow: value ? "0 2px 8px rgba(7,193,96,0.35)" : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "2px",
          left: value ? "22px" : "2px",
          width: "27px",
          height: "27px",
          borderRadius: "50%",
          background: "#FFFFFF",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          transition: "left 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />
    </button>
  );
}

// ── 权限行 ──
interface PermRowProps {
  icon: React.ReactNode;
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

function PermRow({ icon, label, desc, value, onChange, isFirst, isLast }: PermRowProps) {
  return (
    <div
      className="flex items-center px-4"
      style={{
        minHeight: "64px",
        background: "#FFFFFF",
        borderRadius: isFirst && isLast ? "16px"
          : isFirst ? "16px 16px 0 0"
          : isLast ? "0 0 16px 16px"
          : "0",
        borderBottom: isLast ? "none" : "0.5px solid rgba(0,0,0,0.06)",
        gap: "12px",
        paddingTop: "12px",
        paddingBottom: "12px",
      }}
    >
      {/* 图标 */}
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: "#F2F2F7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "#8A8A8E",
        }}
      >
        {icon}
      </div>

      {/* 文字 */}
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: "15px", color: "#1A1A1A", fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
          {label}
        </p>
        <p style={{ fontSize: "12px", color: "#8A8A8A", fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", marginTop: "2px", lineHeight: 1.4 }}>
          {desc}
        </p>
      </div>

      {/* 开关 */}
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

export default function AppSettings() {
  const [, navigate] = useLocation();

  const [albumWrite, setAlbumWrite] = useState(true);

  return (
    <div
      style={{
        width: "390px",
        height: "844px",
        margin: "0 auto",
        background: "#F2F2F7",
        fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <StatusBar />

      {/* 顶部导航 */}
      <div className="flex items-center px-4 flex-shrink-0" style={{ paddingTop: "8px", paddingBottom: "12px" }}>
        <button
          className="flex items-center justify-center mr-3"
          style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(0,0,0,0.06)" }}
          onClick={() => navigate("/settings")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8l4 4" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#1A1A1A" }}>设置</h1>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto px-4" style={{ paddingBottom: "40px", scrollbarWidth: "none" }}>

        {/* 权限开关列表 */}
        <div style={{ borderRadius: "16px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <PermRow
            icon={
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="4" width="16" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="7" cy="10" r="2" stroke="currentColor" strokeWidth="1.3" />
                <path d="M2 14l4-4 3 3 3-3 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            label="保存照片到相册"
            desc="允许青竹快传将照片写入手机相册"
            value={albumWrite}
            onChange={setAlbumWrite}
            isFirst
            isLast
          />
        </div>
      </div>
    </div>
  );
}
