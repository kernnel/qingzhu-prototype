/**
 * 青竹快传 · 推荐朋友
 * 参考图还原：顶部相机横幅 / 邀请卡片 / 专属推广链接 / 已邀请统计 / 推荐记录列表
 */

import WechatStatusBar from "@/components/WechatStatusBar";
import { useState } from "react";
import { useLocation } from "wouter";

const GREEN = "#07C160";

// ─────────────────────────────────────────────────────────────
// 状态栏
// ─────────────────────────────────────────────────────────────
function StatusBar() {
  return <WechatStatusBar />;
}

// ─────────────────────────────────────────────────────────────
// 推荐记录数据
// ─────────────────────────────────────────────────────────────
const RECORDS = [
  {
    name: "李知远 (Liam)",
    date: "2023.11.12",
    reward: "+3个月",
    status: "已生效",
    statusColor: GREEN,
    statusBg: "rgba(7,193,96,0.1)",
    avatarBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    initials: "L",
  },
  {
    name: "陈佳卉 (Celia)",
    date: "2023.11.08",
    reward: "待完成",
    status: "试用中",
    statusColor: "#FF9500",
    statusBg: "rgba(255,149,0,0.1)",
    avatarBg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    initials: "C",
  },
  {
    name: "王子墨 (Zimo)",
    date: "2023.10.25",
    reward: "+3个月",
    status: "已生效",
    statusColor: GREEN,
    statusBg: "rgba(7,193,96,0.1)",
    avatarBg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    initials: "Z",
  },
];

// ─────────────────────────────────────────────────────────────
// 相机 SVG 插图（简化线条风格）
// ─────────────────────────────────────────────────────────────
function CameraBanner() {
  return (
    <div style={{
      width: "100%",
      height: "180px",
      background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      position: "relative",
      overflow: "hidden",
      borderRadius: "16px",
      flexShrink: 0,
    }}>
      {/* 背景光晕 */}
      <div style={{ position: "absolute", top: "-30px", left: "-30px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(7,193,96,0.06)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: "-20px", right: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(7,193,96,0.08)", filter: "blur(30px)" }} />

      {/* 相机主体 SVG */}
      <svg width="100%" height="100%" viewBox="0 0 358 180" fill="none" style={{ position: "absolute", inset: 0 }}>
        {/* 相机机身 */}
        <rect x="89" y="62" width="180" height="110" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        {/* 顶部凸起（快门区） */}
        <rect x="109" y="48" width="80" height="22" rx="8" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        {/* 镜头外圈 */}
        <circle cx="179" cy="117" r="38" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
        {/* 镜头内圈 */}
        <circle cx="179" cy="117" r="26" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
        {/* 镜头中心 */}
        <circle cx="179" cy="117" r="14" fill="rgba(7,193,96,0.12)" stroke="rgba(7,193,96,0.4)" strokeWidth="1.5" />
        <circle cx="179" cy="117" r="6" fill="rgba(7,193,96,0.3)" />
        {/* 取景框 */}
        <rect x="219" y="70" width="28" height="20" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        {/* 快门按钮 */}
        <circle cx="165" cy="59" r="7" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        {/* 闪光灯 */}
        <rect x="113" y="70" width="16" height="10" rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {/* 装饰线条 */}
        <line x1="113" y1="140" x2="245" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="113" y1="150" x2="200" y2="150" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      </svg>

      {/* 享享权益标签 */}
      <div style={{
        position: "absolute", top: "14px", right: "14px",
        background: GREEN, borderRadius: "20px",
        padding: "5px 12px",
        fontSize: "12px", color: "#FFFFFF", fontWeight: 600,
        fontFamily: "'Noto Sans SC', sans-serif",
        boxShadow: "0 2px 8px rgba(7,193,96,0.4)",
      }}>
        享享权益
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 主页面
// ─────────────────────────────────────────────────────────────
export default function ReferFriend() {
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const referLink = "vision.creators/ref/alex_99";

  const handleCopy = () => {
    navigator.clipboard?.writeText(`https://${referLink}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: "#F7F8FA",
      fontFamily: "'Noto Sans SC', sans-serif",
      maxWidth: "390px", margin: "0 auto",
      height: "100dvh",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      <StatusBar />

      {/* 导航栏 */}
      <div className="flex items-center px-4 flex-shrink-0 relative" style={{ height: "44px" }}>
        <button className="flex items-center gap-0.5 active:opacity-60 transition-opacity" onClick={() => navigate("/user-center")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 style={{ fontSize: "17px", fontWeight: 600, color: "#1A1A1A", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          推荐朋友
        </h1>
      </div>

      {/* 滚动内容区 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 32px", display: "flex", flexDirection: "column", gap: "14px" }}>

        {/* 顶部相机横幅 */}
        <CameraBanner />

        {/* 邀请卡片 */}
        <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "18px 18px 20px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
          <div className="flex justify-between items-start" style={{ marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: GREEN, fontWeight: 600, fontFamily: "'Noto Sans SC', sans-serif" }}>会员礼遇</span>
            <div className="flex items-center gap-1">
              <span style={{ fontSize: "12px", color: "#9A9A9F", fontFamily: "'Noto Sans SC', sans-serif" }}>累计奖励</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "2px" }}>
                <circle cx="12" cy="12" r="9" stroke="#9A9A9F" strokeWidth="1.5" />
                <path d="M12 8v4l3 3" stroke="#9A9A9F" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif" }}>12月</span>
            </div>
          </div>

          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1A1A1A", marginBottom: "10px", fontFamily: "'Noto Sans SC', sans-serif", lineHeight: 1.3 }}>
            邀请好友，共创视界
          </h2>

          <p style={{ fontSize: "13px", color: "#6A6A6A", lineHeight: 1.7, marginBottom: "18px", fontFamily: "'Noto Sans SC', sans-serif" }}>
            每成功推荐一位好友订阅，双方各获赠最高{" "}
            <span style={{ color: GREEN, fontWeight: 600 }}>36个月</span>
            {" "}的专业版会员权益。
          </p>

          <button
            onClick={() => setShowShare(true)}
            style={{
              width: "100%", height: "48px",
              background: GREEN, borderRadius: "12px",
              fontSize: "16px", fontWeight: 600, color: "#FFFFFF",
              fontFamily: "'Noto Sans SC', sans-serif",
              boxShadow: "0 4px 16px rgba(7,193,96,0.38)",
              transition: "opacity 0.15s ease",
            }}
            className="active:opacity-80"
          >
            立即邀请好友
          </button>
        </div>

        {/* 专属推广链接 */}
        <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "16px 18px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
            {/* 链接图标 */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif" }}>专属推广链接</span>
          </div>

          <div className="flex items-center gap-3" style={{
            background: "#F7F8FA", borderRadius: "10px", padding: "12px 14px",
          }}>
            <span style={{ flex: 1, fontSize: "13px", color: "#4A4A4A", fontFamily: "monospace, 'Noto Sans SC', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {referLink}
            </span>
            <button
              onClick={handleCopy}
              style={{
                flexShrink: 0, width: "32px", height: "32px",
                background: copied ? "rgba(7,193,96,0.12)" : "rgba(7,193,96,0.08)",
                borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              className="active:scale-90"
            >
              {copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="13" height="13" rx="2" stroke={GREEN} strokeWidth="1.6" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke={GREEN} strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
          {copied && (
            <p style={{ fontSize: "12px", color: GREEN, marginTop: "8px", textAlign: "center", fontFamily: "'Noto Sans SC', sans-serif" }}>
              链接已复制到剪贴板 ✓
            </p>
          )}
        </div>

        {/* 已邀请统计 */}
        <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "16px 18px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-2" style={{ marginBottom: "6px" }}>
            {/* 人物图标 */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="7" r="4" stroke={GREEN} strokeWidth="1.6" />
              <path d="M1 21c0-4.418 3.582-7 8-7" stroke={GREEN} strokeWidth="1.6" strokeLinecap="round" />
              <path d="M17 11l2 2 4-4" stroke={GREEN} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: "13px", color: "#9A9A9F", fontFamily: "'Noto Sans SC', sans-serif" }}>已邀请</span>
          </div>
          <div style={{ fontSize: "32px", fontWeight: 700, color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", lineHeight: 1.2 }}>
            8
            <span style={{ fontSize: "16px", fontWeight: 400, color: "#9A9A9F", marginLeft: "4px" }}>位</span>
          </div>
        </div>

        {/* 推荐记录 */}
        <div>
          <div className="flex justify-between items-center" style={{ marginBottom: "10px" }}>
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif" }}>推荐记录</span>
            <button style={{ fontSize: "13px", color: GREEN, fontFamily: "'Noto Sans SC', sans-serif" }} className="active:opacity-60">
              查看更多
            </button>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            {RECORDS.map((r, i) => (
              <div key={i} className="flex items-center px-4"
                style={{ minHeight: "64px", borderBottom: i < RECORDS.length - 1 ? "0.5px solid rgba(0,0,0,0.06)" : "none" }}>
                {/* 头像 */}
                <div style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  background: r.avatarBg, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "15px", fontWeight: 700, color: "#FFFFFF",
                  fontFamily: "'Noto Sans SC', sans-serif",
                }}>
                  {r.initials}
                </div>

                {/* 姓名 + 日期 */}
                <div style={{ flex: 1, marginLeft: "12px" }}>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", marginBottom: "3px" }}>
                    {r.name}
                  </p>
                  <p style={{ fontSize: "12px", color: "#B0B0B0", fontFamily: "'Noto Sans SC', sans-serif" }}>
                    注册日期：{r.date}
                  </p>
                </div>

                {/* 奖励 + 状态 */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: r.statusColor, fontFamily: "'Noto Sans SC', sans-serif", marginBottom: "4px" }}>
                    {r.reward}
                  </p>
                  <span style={{
                    fontSize: "11px", fontWeight: 500,
                    color: r.statusColor, background: r.statusBg,
                    padding: "2px 8px", borderRadius: "20px",
                    fontFamily: "'Noto Sans SC', sans-serif",
                  }}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 底部 Tab Bar */}
      <div style={{
        flexShrink: 0, background: "#FFFFFF",
        borderTop: "0.5px solid rgba(0,0,0,0.08)",
        display: "flex", alignItems: "center",
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
      }}>
        {[
          { label: "首页", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" stroke="#B0B0B0" strokeWidth="1.5" /><path d="M9 21V12h6v9" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" /></svg>, active: false, path: "/" },
          { label: "相册", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#B0B0B0" strokeWidth="1.5" /><circle cx="8.5" cy="8.5" r="1.5" stroke="#B0B0B0" strokeWidth="1.2" /><path d="M3 16l5-5 4 4 3-3 6 6" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>, active: false, path: "/album" },
          { label: "我的", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={GREEN} strokeWidth="1.5" /><path d="M4 20c0-4.418 3.582-7 8-7s8 2.582 8 7" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" /></svg>, active: true, path: "/user-center" },
        ].map((tab) => (
          <button key={tab.label} className="flex-1 flex flex-col items-center justify-center active:opacity-60 transition-opacity"
            style={{ height: "56px", gap: "3px" }}
            onClick={() => navigate(tab.path)}>
            {tab.icon}
            <span style={{ fontSize: "10px", color: tab.active ? GREEN : "#B0B0B0", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: tab.active ? 500 : 400 }}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
      {/* 分享 Bottom Sheet */}
      {showShare && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
          onClick={() => setShowShare(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "390px", background: "#FFFFFF", borderRadius: "20px 20px 0 0", paddingBottom: "40px", animation: "slideUp 0.3s cubic-bezier(0.32,0.72,0,1)" }}
          >
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
              <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "#E0E0E0" }} />
            </div>
            <div style={{ padding: "4px 20px 16px", borderBottom: "0.5px solid rgba(0,0,0,0.07)" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 600, color: "#1A1A1A", textAlign: "center", fontFamily: "'Noto Sans SC', sans-serif" }}>分享给好友</h3>
              <p style={{ fontSize: "13px", color: "#9A9A9F", textAlign: "center", marginTop: "4px", fontFamily: "'Noto Sans SC', sans-serif" }}>好友注册后，双方各获赠最高 36 个月会员权益</p>
            </div>
            <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
              <button className="active:opacity-70 transition-opacity" style={{ width: "100%", height: "52px", background: GREEN, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 4px 16px rgba(7,193,96,0.32)" }} onClick={() => setShowShare(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", fontFamily: "'Noto Sans SC', sans-serif" }}>分享给好友</span>
              </button>
              <button className="active:opacity-70 transition-opacity" style={{ width: "100%", height: "52px", background: linkCopied ? "rgba(7,193,96,0.08)" : "#F7F8FA", borderRadius: "14px", border: linkCopied ? "1px solid rgba(7,193,96,0.3)" : "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.2s ease" }}
                onClick={() => { navigator.clipboard?.writeText(`https://${referLink}`).catch(() => {}); setLinkCopied(true); setTimeout(() => { setLinkCopied(false); setShowShare(false); }, 1500); }}>
                {linkCopied ? (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>) : (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#4A4A4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#4A4A4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
                <span style={{ fontSize: "15px", fontWeight: 500, color: linkCopied ? GREEN : "#4A4A4A", fontFamily: "'Noto Sans SC', sans-serif" }}>{linkCopied ? "链接已复制 ✓" : "复制推广链接"}</span>
              </button>
              <button className="active:opacity-60 transition-opacity" style={{ width: "100%", height: "44px", background: "transparent", borderRadius: "12px", fontSize: "15px", color: "#9A9A9F", fontFamily: "'Noto Sans SC', sans-serif" }} onClick={() => setShowShare(false)}>取消</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}
