/**
 * 青竹快传 · 个人中心 V2
 * 设计语言：竹光通透 · Bento Box 模块化网格 × 无界瀑布流
 *
 * 核心设计理念：
 * 1. 极简名片（左对齐头像 + 姓名 / 职业，右侧收纳订单 + 设置图标）
 * 2. Bento Box 仪表盘（60% 主模块额度卡 + 20% 浏览 + 20% 保存）
 * 3. 无界相册瀑布流（两列大圆角卡片，吸顶分类 Tab + 毛玻璃效果）
 * 4. 悬浮 FAB（右下角 #07C160 弥散阴影圆形按钮）
 */

import WechatStatusBar from "@/components/WechatStatusBar";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

// ─────────────────────────────────────
// 状态栏
// ─────────────────────────────────────
function StatusBar() {
  return <WechatStatusBar />;
}

// ─────────────────────────────────────
// 模拟相册数据
// ─────────────────────────────────────
// expiresAt: 距离现在的小时数（正数=未来，负数=已过期）
const NOW = Date.now();
const h = (hours: number) => new Date(NOW + hours * 3600_000);
const ALBUMS_DATA = [
  { id: 1, name: "婚礼跟拍精选", count: 128, views: "1.2k", date: "03.18", status: "active",  color: "#D4B896", expiresAt: h(52)  },
  { id: 2, name: "毕业季写真",   count: 86,  views: "340",  date: "03.12", status: "active",  color: "#A8C4A0", expiresAt: h(18)  },
  { id: 3, name: "商业产品拍摄", count: 54,  views: "890",  date: "02.28", status: "done",    color: "#B0C4D8", expiresAt: h(-72) },
  { id: 4, name: "家庭亲子写真", count: 72,  views: "560",  date: "02.14", status: "done",    color: "#D4B8C8", expiresAt: h(-48) },
  { id: 5, name: "企业年会活动", count: 210, views: "2.1k", date: "01.06", status: "expired", color: "#C8C0B0", expiresAt: h(-200)},
  { id: 6, name: "时尚大片",     count: 45,  views: "180",  date: "03.20", status: "active",  color: "#C4B0A8", expiresAt: h(6)   },
];

/** 返回「剩余 X 天」或「剩余 X 小时」文案，已过期返回 null */
function getRemainingLabel(expiresAt: Date): string | null {
  const diffMs = expiresAt.getTime() - Date.now();
  if (diffMs <= 0) return null;
  const diffHours = Math.ceil(diffMs / 3600_000);
  if (diffHours < 24) return `剩余 ${diffHours} 小时`;
  return `剩余 ${Math.ceil(diffHours / 24)} 天`;
}

// 展示空状态时将此改为 []
const ALBUMS = ALBUMS_DATA;

const STATUS_LABEL: Record<string, { text: string; color: string; bg: string }> = {
  active:  { text: "进行中", color: "#07C160", bg: "rgba(7,193,96,0.12)" },
  done:    { text: "已过期", color: "#9A9A9F", bg: "rgba(0,0,0,0.06)" },
  expired: { text: "已过期", color: "#9A9A9F", bg: "rgba(0,0,0,0.06)" },
};

// ─────────────────────────────────────
// 相册卡片
// ─────────────────────────────────────
function AlbumCard({ album, onPress }: { album: typeof ALBUMS_DATA[0]; onPress?: () => void }) {
  const [pressed, setPressed] = useState(false);
  const st = STATUS_LABEL[album.status];
  const isActive = album.status === "active";
  const remainingLabel = isActive ? getRemainingLabel(album.expiresAt) : null;
  // 不足 24 小时时用警示色
  const isUrgent = isActive && remainingLabel?.includes("小时");
  const BRAND_GREEN = "#07C160";
  const URGENT_ORANGE = "#FF6B35";
  const activeBorderColor = isUrgent ? URGENT_ORANGE : BRAND_GREEN;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        background: "#FFFFFF",
        boxShadow: pressed
          ? "0 1px 4px rgba(0,0,0,0.06)"
          : "0 2px 10px rgba(0,0,0,0.07)",
        transform: pressed ? "scale(0.97)" : "scale(1)",
        transition: "all 0.15s ease",
        cursor: "pointer",
        border: "1.5px solid transparent",
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={() => onPress?.()}
    >
      {/* ── 封面图区 ── */}
      <div
        className="w-full relative"
        style={{
          height: "118px",
          background: `linear-gradient(145deg, ${album.color}CC 0%, ${album.color}88 100%)`,
        }}
      >
        {/* 相机图标占位 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" style={{ opacity: 0.32 }}>
            <rect x="2" y="8" width="28" height="20" rx="4" stroke="white" strokeWidth="1.8" />
            <circle cx="16" cy="18" r="5.5" stroke="white" strokeWidth="1.8" />
            <path d="M11 8l2-4h6l2 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="25" cy="12" r="1.5" fill="white" />
          </svg>
        </div>

        {/* 状态标签：左上角 */}
        <div className="absolute top-2 left-2">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              color: isActive ? activeBorderColor : st.color,
              background: "rgba(255,255,255,0.92)",
              fontFamily: "'Noto Sans SC', sans-serif",
              backdropFilter: "blur(4px)",
            }}
          >
            {isActive && remainingLabel ? remainingLabel : st.text}
          </span>
        </div>


      </div>

      {/* ── 文字区：三行微排版 ── */}
      <div className="px-3 pt-2.5 pb-3">
        {/* 第一行：主标题，黑体粗体 15pt，截断 */}
        <p
          className="font-semibold truncate"
          style={{
            fontSize: "14px",
            color: "#1A1A1A",
            fontFamily: "'Noto Sans SC', sans-serif",
            lineHeight: "1.3",
          }}
        >
          {album.name}
        </p>

        {/* 第二行：张数 + 眼睛图标 + 浏览量 */}
        <div
          className="flex items-center gap-1 mt-1"
          style={{ color: "#8A8A8A" }}
        >
          <span style={{ fontSize: "12px", fontFamily: "'Noto Sans SC', sans-serif" }}>
            {album.count}张
          </span>
          <span style={{ fontSize: "10px", color: "#C0C0C0" }}>·</span>
          {/* 眼睛图标 */}
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
            <path d="M1 7C1 7 3 3 7 3s6 4 6 4-2 4-6 4-6-4-6-4Z"
              stroke="#8A8A8A" strokeWidth="1.2" strokeLinejoin="round" />
            <circle cx="7" cy="7" r="1.8" stroke="#8A8A8A" strokeWidth="1.2" />
          </svg>
          <span style={{ fontSize: "12px", fontFamily: "'Noto Sans SC', sans-serif" }}>
            {album.views}
          </span>
        </div>

        {/* 第三行：创建日期，极淡灰 */}
        <p
          className="mt-0.5"
          style={{
            fontSize: "11px",
            color: "#B0B0B0",
            fontFamily: "'Noto Sans SC', sans-serif",
          }}
        >
          {album.date} 创建
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// 设置弹窗（底部 Sheet）
// ─────────────────────────────────────
function SettingsSheet({ visible, onClose, onLogout }: {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (visible) requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
    else setMounted(false);
  }, [visible]);
  if (!visible && !mounted) return null;

  const items = [
    { icon: "🔔", label: "通知设置" },
    { icon: "🔒", label: "隐私与安全" },
    { icon: "🌙", label: "外观设置" },
    { icon: "🗑️", label: "清理缓存", sub: "12.3 MB" },
    { icon: "📖", label: "使用教程" },
    { icon: "💬", label: "联系客服" },
  ];

  return (
    <>
      <div
        className="absolute inset-0 z-20 transition-all duration-300"
        style={{ background: mounted ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)" }}
        onClick={onClose}
      />
      <div
        className="absolute bottom-0 left-0 right-0 z-30 transition-transform duration-300 ease-out"
        style={{
          transform: mounted ? "translateY(0)" : "translateY(100%)",
          borderRadius: "24px 24px 0 0",
          background: "#F7F8FA",
          paddingBottom: "16px",
        }}
      >
        {/* 把手 */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-[#D0D0D0]" />
        </div>
        <p className="text-center text-[16px] font-bold text-[#1A1A1A] mb-3"
          style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>设置</p>

        <div className="mx-4 rounded-2xl overflow-hidden" style={{ background: "#FFFFFF" }}>
          {items.map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-3 px-4 active:bg-black/5 transition-colors"
              style={{
                height: "52px",
                borderBottom: i < items.length - 1 ? "0.5px solid rgba(0,0,0,0.07)" : "none",
              }}
              onClick={() => { toast(`${item.label}功能即将上线`); onClose(); }}
            >
              <span className="text-[18px]">{item.icon}</span>
              <span className="flex-1 text-left text-[15px] text-[#1A1A1A]"
                style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>{item.label}</span>
              {item.sub && (
                <span className="text-[12px] text-[#ABABAB]"
                  style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>{item.sub}</span>
              )}
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M1 1l5 5-5 5" stroke="#C7C7CC" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>

        {/* 退出登录 */}
        <div className="mx-4 mt-3 rounded-2xl overflow-hidden" style={{ background: "#FFFFFF" }}>
          <button
            className="w-full flex items-center justify-center active:bg-black/5 transition-colors"
            style={{ height: "52px" }}
            onClick={onLogout}
          >
            <span className="text-[15px] font-medium" style={{ color: "#FF3B30", fontFamily: "'Noto Sans SC', sans-serif" }}>
              退出登录
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────
// 退出确认弹窗
// ─────────────────────────────────────
function LogoutSheet({ visible, onConfirm, onCancel }: {
  visible: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (visible) requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
    else setMounted(false);
  }, [visible]);
  if (!visible && !mounted) return null;

  return (
    <>
      <div className="absolute inset-0 z-40 transition-all duration-300"
        style={{ background: mounted ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)" }}
        onClick={onCancel} />
      <div className="absolute bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out"
        style={{
          transform: mounted ? "translateY(0)" : "translateY(100%)",
          borderRadius: "20px 20px 0 0", background: "#F2F2F7",
          overflow: "hidden", paddingBottom: "8px",
        }}>
        <div className="px-5 pt-5 pb-4 text-center">
          <p className="text-[13px] text-[#8E8E93]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
            退出后需重新授权手机号登录
          </p>
        </div>
        <div className="mx-4 rounded-2xl overflow-hidden" style={{ background: "#FFFFFF" }}>
          <button onClick={onConfirm} className="w-full flex items-center justify-center active:opacity-60" style={{ height: "56px" }}>
            <span className="text-[17px] font-medium" style={{ color: "#FF4D4F", fontFamily: "'Noto Sans SC', sans-serif" }}>确认退出</span>
          </button>
        </div>
        <div className="mx-4 mt-3 mb-2 rounded-2xl overflow-hidden" style={{ background: "#FFFFFF" }}>
          <button onClick={onCancel} className="w-full flex items-center justify-center active:opacity-60" style={{ height: "56px" }}>
            <span className="text-[17px] font-medium text-[#1C1C1E]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>取消</span>
          </button>
        </div>
      </div>
    </>
  );
}

// ═════════════════════════════════════
// 主页面
// ═════════════════════════════════════
export default function UserCenterV2() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [showSettings, setShowSettings] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabSentinelRef = useRef<HTMLDivElement>(null);

  // 额度数据（快用完时触发橙色呼吸晕影）
  const used = 100;
  const total = 200;
  const ratio = used / total;
  const isLow = ratio >= 0.8;

  // 监听滚动实现 Tab 吸顶
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const sentinel = tabSentinelRef.current;
      if (!sentinel) return;
      const rect = sentinel.getBoundingClientRect();
      const containerRect = el.getBoundingClientRect();
      setIsSticky(rect.top <= containerRect.top + 60);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const filtered = activeTab === "all"
    ? ALBUMS
    : ALBUMS.filter((a) => {
        if (activeTab === "active")  return a.status === "active";
        if (activeTab === "expired") return a.status === "done" || a.status === "expired";
        return false;
      });

  const handleLogout = () => {
    setShowLogout(false);
    setShowSettings(false);
    setTimeout(() => { toast("已退出登录"); navigate("/"); }, 350);
  };

  const expiredCount = ALBUMS.filter(a => a.status === "done" || a.status === "expired").length;
  const TABS_CONFIG = [
    { key: "all",     label: "全部",   count: ALBUMS.length },
    { key: "active",  label: "进行中", count: ALBUMS.filter(a => a.status === "active").length },
    { key: "expired", label: "已过期", count: expiredCount },
  ];

  return (
    <div className="min-h-screen bg-[#EFEFEF] flex items-center justify-center p-4">
      {/* 手机外壳 */}
      <div
        className="relative flex flex-col overflow-hidden shadow-2xl"
        style={{
          width: "390px",
          height: "844px",
          borderRadius: "44px",
          background: "#F7F8FA",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        {/* ══ 可滚动内容区 ══ */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: "none", paddingBottom: "100px" }}
        >
          {/* ── 1. 极简名片区（无底色） ── */}
          <div style={{ background: "#F7F8FA" }}>
            <StatusBar />
            <div className="flex items-center justify-between px-5 pt-4 pb-5">
              {/* 左：头像 + 姓名 */}
              <div className="flex items-center gap-3">
                {/* 头像 48×48 - 点击进入个人资料 */}
                <div
                  className="rounded-2xl overflow-hidden shrink-0 active:opacity-70 transition-opacity"
                  style={{
                    width: "48px", height: "48px",
                    background: "linear-gradient(145deg, #3A3A3A 0%, #5C5040 100%)",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.18)",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/profile-edit")}
                >
                  <div className="w-full h-full flex items-end justify-center">
                    <svg width="38" height="40" viewBox="0 0 70 72" fill="none" style={{ marginBottom: "-2px" }}>
                      <ellipse cx="35" cy="80" rx="28" ry="22" fill="rgba(255,255,255,0.18)" />
                      <circle cx="35" cy="30" r="16" fill="rgba(255,255,255,0.22)" />
                      <rect x="26" y="38" width="18" height="13" rx="3" fill="rgba(255,255,255,0.30)" />
                      <rect x="30" y="35" width="8" height="5" rx="1.5" fill="rgba(255,255,255,0.22)" />
                      <circle cx="35" cy="44.5" r="4" fill="rgba(255,255,255,0.15)" />
                      <circle cx="35" cy="44.5" r="2.5" fill="rgba(255,255,255,0.25)" />
                    </svg>
                  </div>
                </div>
                {/* 文字 */}
                <div>
                  <div className="flex items-center gap-2">
                    <h1
                      className="text-[20px] font-bold text-[#1A1A1A] active:opacity-60 transition-opacity"
                      style={{ fontFamily: "'Noto Sans SC', sans-serif", letterSpacing: "-0.3px", cursor: "pointer" }}
                      onClick={() => navigate("/profile-edit")}
                    >
                      陈墨熙
                    </h1>
                    {/* PRO 标签 */}
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded active:opacity-60 transition-opacity"
                      style={{
                        background: "linear-gradient(135deg, #D4A843 0%, #B49650 100%)",
                        color: "#FFFFFF",
                        fontFamily: "'Noto Sans SC', sans-serif",
                        letterSpacing: "0.05em",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate("/membership")}
                    >
                      标准版
                    </span>
                  </div>
                  <p
                    className="text-[12px] text-[#8C8C8C]"
                    style={{ fontFamily: "'Noto Sans SC', sans-serif", marginTop: "1px" }}
                  >
                    会员 2026.12.31 到期
                  </p>
                </div>
              </div>

              {/* 右：设置图标 */}
              <div className="flex items-center gap-1">
                {/* 设置图标（齿轮） */}
                <button
                  onClick={() => navigate("/settings")}
                  className="flex items-center justify-center rounded-xl active:bg-black/8 transition-colors"
                  style={{ width: "38px", height: "38px" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                      stroke="#4A4A5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    />
                    <path
                      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                      stroke="#4A4A5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── 2. Bento Box 仪表盘 ── */}
          <div className="px-4 mb-5">
            <div className="flex gap-3" style={{ height: "88px" }}>

              {/* 主模块（60%）：额度卡 */}
              <div
                className="relative flex flex-col justify-center px-4 rounded-2xl overflow-hidden"
                style={{
                  flex: "0 0 calc(60% - 6px)",
                  background: "#FFFFFF",
                  boxShadow: isLow
                    ? "0 2px 16px rgba(255,149,0,0.22), 0 0 0 1px rgba(255,149,0,0.12)"
                    : "0 2px 12px rgba(0,0,0,0.07)",
                  transition: "box-shadow 0.4s ease",
                }}
              >
                {/* 低额度呼吸晕影 */}
                {isLow && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse at 50% 120%, rgba(255,149,0,0.12) 0%, transparent 70%)",
                      animation: "pulse 2s ease-in-out infinite",
                    }}
                  />
                )}

                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[11px] text-[#8C8C8C]"
                    style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                  >
                    今日已传
                  </span>
                  {/* 极克制升级入口 */}
                  <button
                    onClick={() => navigate("/membership")}
                    className="active:opacity-50 transition-opacity"
                  >
                    <span style={{ fontSize: "11px", color: "#B0B0B0", fontFamily: "'Noto Sans SC', sans-serif" }}>
                      升级满足版 ›
                    </span>
                  </button>
                </div>

                {/* 数字 */}
                <div className="flex items-baseline gap-0.5 mb-2">
                  <span
                    className="text-[18px] font-bold"
                    style={{
                      color: isLow ? "#FF9500" : "#1A1A1A",
                      fontFamily: "'Noto Sans SC', sans-serif",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {used}
                  </span>
                  <span
                    className="text-[12px] text-[#ABABAB]"
                    style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                  >
                    / {total} 张
                  </span>
                </div>

                {/* 进度条 */}
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: "3px", background: "rgba(0,0,0,0.07)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${ratio * 100}%`,
                      background: isLow
                        ? "linear-gradient(90deg, #FF9500 0%, #FF6B00 100%)"
                        : "linear-gradient(90deg, #07C160 0%, #05A050 100%)",
                    }}
                  />
                </div>
              </div>

              {/* 右侧两个副模块（各 20%） */}
              <div className="flex flex-col gap-3" style={{ flex: "0 0 calc(40% - 6px)" }}>
                {/* 累计浏览 */}
                <div
                  className="flex-1 flex flex-col items-center justify-center rounded-lg"
                  style={{
                    background: "#FFFFFF",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  }}
                >
                  <span
                    className="text-[10px] text-[#ABABAB] mb-0.5"
                    style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                  >
                    已上传照片数量
                  </span>
                  <span
                    className="text-[17px] font-bold text-[#1A1A1A]"
                    style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                  >
                    1.2k
                  </span>
                </div>

                {/* 累计保存 */}
                <div
                  className="flex-1 flex flex-col items-center justify-center rounded-lg"
                  style={{
                    background: "#FFFFFF",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  }}
                >
                  <span
                    className="text-[10px] text-[#ABABAB] mb-0.5"
                    style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                  >
                    相册数量
                  </span>
                  <span
                    className="text-[17px] font-bold text-[#1A1A1A]"
                    style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                  >
                    450
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 3. 吸顶 Tab 哨兵 ── */}
          <div ref={tabSentinelRef} />

          {/* 吸顶 Tab 栏（毛玻璃） */}
          <div
            className="transition-all duration-200"
            style={{
              position: isSticky ? "sticky" : "relative",
              top: isSticky ? "0px" : "auto",
              zIndex: 10,
              background: isSticky
                ? "rgba(247,248,250,0.85)"
                : "transparent",
              backdropFilter: isSticky ? "blur(12px)" : "none",
              WebkitBackdropFilter: isSticky ? "blur(12px)" : "none",
              borderBottom: isSticky ? "0.5px solid rgba(0,0,0,0.08)" : "none",
              paddingTop: isSticky ? "8px" : "0",
            }}
          >
            <div className="flex items-center px-4 pb-3 gap-0">
              {TABS_CONFIG.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="relative flex items-center gap-1.5 pb-1 mr-5 transition-all"
                  >
                    <span
                      style={{
                        fontFamily: "'Noto Sans SC', sans-serif",
                        fontSize: isActive ? "15px" : "14px",
                        fontWeight: isActive ? 700 : 400,
                        color: isActive ? "#1A1A1A" : "#8C8C8C",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {tab.label}
                    </span>
                    <span
                      className="text-[10px] font-bold px-1.5 rounded-full"
                      style={{
                        background: "rgba(0,0,0,0.06)",
                        color: isActive ? "#555555" : "#ABABAB",
                        fontFamily: "'Noto Sans SC', sans-serif",
                        minWidth: "18px",
                        textAlign: "center",
                        padding: "1px 5px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {tab.count}
                    </span>
                    {isActive && (
                      <div
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full"
                        style={{ background: "#07C160" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 4. 两列相册瀑布流 ── */}
          {filtered.length === 0 ? (
            /* 空状态 */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px 24px 64px",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "20px",
                  background: "rgba(0,0,0,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="2" y="7" width="28" height="20" rx="4" stroke="#C0C0C0" strokeWidth="1.8" />
                  <circle cx="16" cy="17" r="5" stroke="#C0C0C0" strokeWidth="1.8" />
                  <path d="M11 7l2-4h6l2 4" stroke="#C0C0C0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p style={{ fontSize: "14px", color: "#B0B0B0", fontWeight: 400, fontFamily: "'PingFang SC', sans-serif" }}>
                暂无相册
              </p>
              <button
                onClick={() => toast("新建相册功能即将上线")}
                style={{
                  marginTop: "4px",
                  padding: "9px 24px",
                  borderRadius: "999px",
                  background: "linear-gradient(135deg, #07C160 0%, #05A050 100%)",
                  boxShadow: "0 4px 16px rgba(7,193,96,0.35)",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  fontFamily: "'PingFang SC', sans-serif",
                }}
              >
                新建相册
              </button>
            </div>
          ) : (
            <div
              className="px-4 pb-4"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {filtered.map((album) => (
                <AlbumCard key={album.id} album={album} onPress={() => navigate("/album")} />
              ))}
            </div>
          )}
        </div>

        {/* ── 5. 悬浮 FAB ── */}
        <div
          className="absolute"
          style={{
            bottom: "32px",
            right: "24px",
            zIndex: 15,
          }}
        >
          <button
            onClick={() => navigate("/album")}
            className="flex items-center justify-center rounded-full active:scale-90 transition-all duration-150"
            style={{
              width: "56px",
              height: "56px",
              background: "linear-gradient(135deg, #07C160 0%, #05A050 100%)",
              boxShadow: "0 4px 24px rgba(7,193,96,0.55), 0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#1C1C1E]/20 rounded-full pointer-events-none" />

        {/* ══ 设置弹窗 ══ */}
        <SettingsSheet
          visible={showSettings}
          onClose={() => setShowSettings(false)}
          onLogout={() => { setShowSettings(false); setTimeout(() => setShowLogout(true), 200); }}
        />

        {/* ══ 退出确认弹窗 ══ */}
        <LogoutSheet
          visible={showLogout}
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      </div>

      {/* 呼吸动画样式 */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
