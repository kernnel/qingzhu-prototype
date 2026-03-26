/**
 * 青竹快传 · 测试导航页
 * 分「摄影师端」和「顾客端」两大入口区域
 */

import { useLocation } from "wouter";

// ── 路由配置 ──
const PHOTOGRAPHER_PAGES = [
  {
    label: "产品首页",
    path: "/home",
    desc: "产品介绍落地页，品牌展示 + CTA",
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <path d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M8 20v-7h6v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },

  {
    label: "相册详情",
    path: "/album",
    desc: "相册管理、照片上传、编辑",
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="4" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="8" cy="10" r="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2 16L7.5 11L11 14L14.5 10L20 16" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "个人中心",
    path: "/user-center",
    desc: "相册列表、数据概览",
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="7" r="4" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M3 19c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "订单记录",
    path: "/orders",
    desc: "历史订单卡片列表",
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="2" width="16" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M7 7h8M7 11h8M7 15h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "设置",
    path: "/settings",
    desc: "账号管理、帮助与支持",
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M11 2v2M11 18v2M2 11h2M18 11h2M4.93 4.93l1.41 1.41M15.66 15.66l1.41 1.41M4.93 17.07l1.41-1.41M15.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "编辑资料",
    path: "/profile-edit",
    desc: "修改头像、简介、联系方式",
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <path d="M15 3l4 4-10 10H5v-4L15 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "会员套餐",
    path: "/membership",
    desc: "标准版 / PRO 版购买",
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <path d="M3 8l8-5 8 5v9a1 1 0 01-1 1H4a1 1 0 01-1-1V8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M8 21V11h6v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "邀请好友",
    path: "/refer-friend",
    desc: "推荐返利、邀请码",
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 19c0-3.3 2.7-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 11v6M13 14h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "摄影师主页",
    path: "/photographer",
    desc: "对外展示的摄影师主页",
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="5" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="11" cy="11.5" r="3" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M8 5l1.5-2h3L14 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="17" cy="8" r="1" fill="currentColor"/>
      </svg>
    ),
  },
];

const CLIENT_PAGES = [
  {
    label: "顾客二次分享",
    path: "/client-share",
    desc: "顾客选取部分照片分享，仅展示照片无下载",
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <circle cx="17" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="5" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="17" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7.3 12.3l7.4 4.3M14.7 6.4l-7.4 4.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "看过的相册",
    path: "/client-albums",
    desc: "顾客历史相册列表，有数据 + 空状态",
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="4" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="7.5" cy="9.5" r="2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M2 15L7 10.5L10 13L13.5 9L20 15" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M16 2L18 4M18 2L16 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },

  {
    label: "分享页",
    path: "/share",
    desc: "相册分享链接落地页",
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <circle cx="17" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="5" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="17" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7.4 9.8L14.6 6.2M7.4 12.2L14.6 15.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "相册已过期",
    path: "/album-expired",
    desc: "顾客通过分享链接访问，但相册已过有效期",
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="5" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="11" cy="11.5" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M9.5 10l3 3M12.5 10l-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M17 2l2 2M19 2l-2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function TestNav() {
  const [, navigate] = useLocation();

  return (
    <div
      className="min-h-screen flex items-start justify-center"
      style={{ background: "#F5F5F5", padding: "40px 20px 60px" }}
    >
      <div style={{ width: "100%", maxWidth: "480px" }}>

        {/* ── Logo 区 ── */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="flex items-center justify-center mb-3"
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(145deg, #07C160 0%, #05A050 100%)",
              boxShadow: "0 8px 24px rgba(7,193,96,0.32)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M6 22V10a2 2 0 012-2h12a2 2 0 012 2v12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10 22V16h8v6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 6V4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1
            className="font-black text-center"
            style={{ fontSize: "22px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", letterSpacing: "-0.3px" }}
          >
            青竹快传
          </h1>
          <p
            className="text-center mt-1"
            style={{ fontSize: "13px", color: "#8A8A8A", fontFamily: "'Noto Sans SC', sans-serif" }}
          >
            原型测试导航
          </p>
        </div>

        {/* ── 摄影师端 ── */}
        <SectionBlock
          title="摄影师端"
          subtitle="摄影师使用的核心功能页面"
          accentColor="#07C160"
          bgColor="rgba(7,193,96,0.06)"
          pages={PHOTOGRAPHER_PAGES}
          onNavigate={navigate}
        />

        <div style={{ height: "20px" }} />

        {/* ── 顾客端 ── */}
        <SectionBlock
          title="顾客端"
          subtitle="顾客浏览相册的视角页面"
          accentColor="#3B82F6"
          bgColor="rgba(59,130,246,0.06)"
          pages={CLIENT_PAGES}
          onNavigate={navigate}
        />

        {/* ── 底部版本号 ── */}
        <p
          className="text-center mt-10"
          style={{ fontSize: "11px", color: "#C8C8C8", fontFamily: "'Noto Sans SC', sans-serif" }}
        >
          Prototype v0.1 · 仅供内部测试
        </p>
      </div>
    </div>
  );
}

// ── 区块组件 ──
function SectionBlock({
  title,
  subtitle,
  accentColor,
  bgColor,
  pages,
  onNavigate,
}: {
  title: string;
  subtitle: string;
  accentColor: string;
  bgColor: string;
  pages: typeof PHOTOGRAPHER_PAGES;
  onNavigate: (path: string) => void;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* 区块标题 */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ background: bgColor, borderBottom: `1px solid ${accentColor}18` }}
      >
        <div
          style={{
            width: "4px",
            height: "20px",
            borderRadius: "2px",
            background: accentColor,
          }}
        />
        <div>
          <p
            className="font-bold"
            style={{ fontSize: "16px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", lineHeight: 1.2 }}
          >
            {title}
          </p>
          <p
            style={{ fontSize: "12px", color: "#8A8A8A", fontFamily: "'Noto Sans SC', sans-serif", marginTop: "2px" }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* 页面列表 */}
      <div>
        {pages.map((page, i) => (
          <button
            key={page.path}
            onClick={() => onNavigate(page.path)}
            className="w-full flex items-center gap-4 text-left active:bg-gray-50 transition-colors"
            style={{
              padding: "14px 20px",
              borderBottom: i < pages.length - 1 ? "0.5px solid #F0F0F0" : "none",
            }}
          >
            {/* 图标容器 */}
            <div
              className="shrink-0 flex items-center justify-center"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: bgColor,
                color: accentColor,
              }}
            >
              {page.icon}
            </div>

            {/* 文字 */}
            <div className="flex-1 min-w-0">
              <p
                className="font-semibold truncate"
                style={{ fontSize: "15px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif" }}
              >
                {page.label}
              </p>
              <p
                className="truncate mt-0.5"
                style={{ fontSize: "12px", color: "#8A8A8A", fontFamily: "'Noto Sans SC', sans-serif" }}
              >
                {page.desc}
              </p>
            </div>

            {/* 路由路径 */}
            <span
              className="shrink-0 font-mono"
              style={{ fontSize: "11px", color: "#C8C8C8" }}
            >
              {page.path}
            </span>

            {/* 箭头 */}
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" className="shrink-0">
              <path d="M1 1l5 5-5 5" stroke="#C8C8CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
