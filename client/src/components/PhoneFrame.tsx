// PhoneFrame: 模拟微信小程序手机壳容器
// Design: 375px 宽度，深色外壳，白色内容区，状态栏 + 导航栏 + 内容区 + 底部栏

import React from "react";
import { ChevronLeft, Home, MoreHorizontal } from "lucide-react";

interface PhoneFrameProps {
  title?: string;
  showBack?: boolean;
  showHome?: boolean;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  bottomBar?: React.ReactNode;
  children: React.ReactNode;
  bgColor?: string;
  onBack?: () => void;
  onHome?: () => void;
  noNav?: boolean;
}

export default function PhoneFrame({
  title,
  showBack = false,
  showHome = false,
  leftSlot,
  rightSlot,
  bottomBar,
  children,
  bgColor = "#f9fafb",
  onBack,
  onHome,
  noNav = false,
}: PhoneFrameProps) {
  return (
    <div className="phone-frame flex flex-col" style={{ minHeight: 812 }}>
      {/* Status Bar */}
      <div className="phone-status-bar" style={{ background: "transparent", position: "absolute", top: 0, left: 0, right: 0, zIndex: 20 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#111827" }}>9:41</span>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect x="0" y="3" width="3" height="9" rx="1" fill="#111827"/>
            <rect x="4.5" y="2" width="3" height="10" rx="1" fill="#111827"/>
            <rect x="9" y="0.5" width="3" height="11.5" rx="1" fill="#111827"/>
            <rect x="13.5" y="0" width="2.5" height="12" rx="1" fill="#111827" opacity="0.3"/>
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="#111827">
            <path d="M8 2C5.2 2 2.7 3.2 1 5.2L2.4 6.6C3.8 5 5.8 4 8 4s4.2 1 5.6 2.6L15 5.2C13.3 3.2 10.8 2 8 2z"/>
            <path d="M8 5.5C6.3 5.5 4.8 6.2 3.7 7.3L5.1 8.7C5.9 7.9 7 7.5 8 7.5s2.1.4 2.9 1.2l1.4-1.4C11.2 6.2 9.7 5.5 8 5.5z"/>
            <circle cx="8" cy="10.5" r="1.5"/>
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#111827" strokeOpacity="0.35"/>
            <rect x="2" y="2" width="16" height="8" rx="2" fill="#111827"/>
            <path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6S23.8 4.8 23 4.5z" fill="#111827" fillOpacity="0.4"/>
          </svg>
        </div>
      </div>

      {/* Nav Bar */}
      {!noNav && (
        <div className="phone-nav-bar" style={{ marginTop: 44 }}>
          <div style={{ width: 60, display: "flex", alignItems: "center" }}>
            {leftSlot ? leftSlot : showBack ? (
              <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 2, color: "#111827", background: "none", border: "none", padding: 0 }}>
                <ChevronLeft size={20} />
              </button>
            ) : showHome ? (
              <button onClick={onHome} style={{ color: "#111827", background: "none", border: "none", padding: 0 }}>
                <Home size={20} />
              </button>
            ) : null}
          </div>
          <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 16, fontWeight: 600, color: "#111827", flex: 1, textAlign: "center" }}>
            {title || ""}
          </span>
          <div style={{ width: 60, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            {rightSlot}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="phone-content" style={{ background: bgColor, flex: 1, marginTop: noNav ? 44 : 0 }}>
        {children}
      </div>

      {/* Bottom Bar */}
      {bottomBar && (
        <div className="phone-bottom-bar">
          {bottomBar}
        </div>
      )}

      {/* Home Indicator */}
      <div style={{ height: 34, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <div style={{ width: 134, height: 5, background: "#d1d5db", borderRadius: 3 }} />
      </div>
    </div>
  );
}
