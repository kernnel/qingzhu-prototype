/**
 * 顾客端 · 看过的相册
 * 有数据：2 列卡片网格 + 底部推广条
 * 无数据：居中空状态 + CTA
 */

import { useState } from "react";
import { useLocation } from "wouter";
import WechatStatusBar from "@/components/WechatStatusBar";

// ── Mock 数据 ──
const ALBUMS = [
  {
    id: 1,
    title: "20260323 婚礼…",
    photographer: "陈霏熙",
    avatarColor: "#D4A574",
    viewedAt: "昨天看过",
    // 婚礼封面：户外婚纱照风格渐变
    coverGradient: "linear-gradient(160deg, #8B9E7A 0%, #C5B99A 40%, #E8D5B7 100%)",
    coverType: "wedding",
  },
  {
    id: 2,
    title: "林间漫步 · 预告片",
    photographer: "张晓风",
    avatarColor: "#7A8FA6",
    viewedAt: "2人前看过",
    coverGradient: "linear-gradient(160deg, #4A6741 0%, #7A9E6E 50%, #B8D4A8 100%)",
    coverType: "forest",
  },
  {
    id: 3,
    title: "初见：小满满月…",
    photographer: "陆洁羽",
    avatarColor: "#C4956A",
    viewedAt: "上周看过",
    coverGradient: "linear-gradient(160deg, #E8A090 0%, #F2C4B8 50%, #FDE8E0 100%)",
    coverType: "baby",
  },
  {
    id: 4,
    title: "森之息 · 个人写真",
    photographer: "陈墨熙",
    avatarColor: "#6B8FA6",
    viewedAt: "1个月前看过",
    coverGradient: "linear-gradient(160deg, #1A2E3A 0%, #2D4A5E 40%, #3D6B7A 100%)",
    coverType: "portrait",
  },
];

// ── 封面插图 SVG ──
function CoverIllustration({ type }: { type: string }) {
  if (type === "wedding") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 160 180" fill="none" style={{ position: "absolute", inset: 0 }}>
        {/* 人物剪影 - 新郎 */}
        <ellipse cx="72" cy="60" rx="12" ry="14" fill="rgba(255,255,255,0.25)" />
        <path d="M60 74 Q72 90 84 74 L88 140 H56 Z" fill="rgba(255,255,255,0.2)" />
        {/* 人物剪影 - 新娘 */}
        <ellipse cx="100" cy="58" rx="11" ry="13" fill="rgba(255,255,255,0.25)" />
        <path d="M86 71 Q100 86 114 71 L122 140 H78 Z" fill="rgba(255,255,255,0.15)" />
        {/* 婚纱裙摆 */}
        <path d="M78 100 Q100 115 122 100 L130 145 H70 Z" fill="rgba(255,255,255,0.12)" />
        {/* 花束 */}
        <circle cx="86" cy="88" r="8" fill="rgba(255,200,180,0.4)" />
        <circle cx="92" cy="84" r="6" fill="rgba(255,180,160,0.35)" />
        {/* 树木 */}
        <ellipse cx="20" cy="80" rx="16" ry="40" fill="rgba(0,0,0,0.12)" />
        <ellipse cx="145" cy="70" rx="14" ry="36" fill="rgba(0,0,0,0.10)" />
        {/* 光晕 */}
        <ellipse cx="80" cy="30" rx="40" ry="20" fill="rgba(255,255,255,0.12)" />
      </svg>
    );
  }
  if (type === "forest") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 160 180" fill="none" style={{ position: "absolute", inset: 0 }}>
        {/* 树干 */}
        <rect x="70" y="80" width="20" height="100" fill="rgba(0,0,0,0.2)" />
        {/* 树冠层 */}
        <ellipse cx="80" cy="60" rx="50" ry="45" fill="rgba(0,0,0,0.15)" />
        <ellipse cx="80" cy="40" rx="38" ry="32" fill="rgba(255,255,255,0.1)" />
        {/* 人物 */}
        <ellipse cx="80" cy="95" rx="9" ry="10" fill="rgba(255,255,255,0.3)" />
        <path d="M71 105 Q80 118 89 105 L92 145 H68 Z" fill="rgba(255,255,255,0.22)" />
        {/* 阳光光线 */}
        <path d="M80 0 L80 30" stroke="rgba(255,255,200,0.3)" strokeWidth="2" />
        <path d="M100 5 L95 32" stroke="rgba(255,255,200,0.2)" strokeWidth="1.5" />
        <path d="M60 5 L65 32" stroke="rgba(255,255,200,0.2)" strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === "baby") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 160 180" fill="none" style={{ position: "absolute", inset: 0 }}>
        {/* 包被 */}
        <ellipse cx="80" cy="105" rx="52" ry="55" fill="rgba(255,255,255,0.22)" />
        <ellipse cx="80" cy="108" rx="44" ry="48" fill="rgba(255,255,255,0.18)" />
        {/* 宝宝头 */}
        <ellipse cx="80" cy="62" rx="26" ry="28" fill="rgba(255,220,200,0.35)" />
        {/* 耳朵 */}
        <ellipse cx="54" cy="66" rx="6" ry="8" fill="rgba(255,200,180,0.3)" />
        <ellipse cx="106" cy="66" rx="6" ry="8" fill="rgba(255,200,180,0.3)" />
        {/* 眼睛（闭着） */}
        <path d="M70 62 Q74 65 78 62" stroke="rgba(100,60,40,0.4)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M82 62 Q86 65 90 62" stroke="rgba(100,60,40,0.4)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* 小嘴 */}
        <path d="M76 72 Q80 76 84 72" stroke="rgba(200,100,80,0.4)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* 装饰星星 */}
        <circle cx="30" cy="30" r="2" fill="rgba(255,255,255,0.4)" />
        <circle cx="130" cy="25" r="1.5" fill="rgba(255,255,255,0.35)" />
        <circle cx="140" cy="50" r="1" fill="rgba(255,255,255,0.3)" />
      </svg>
    );
  }
  if (type === "portrait") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 160 180" fill="none" style={{ position: "absolute", inset: 0 }}>
        {/* 山脉 */}
        <path d="M0 120 L40 60 L80 100 L120 40 L160 80 L160 180 L0 180 Z" fill="rgba(255,255,255,0.08)" />
        <path d="M0 140 L50 90 L100 120 L160 70 L160 180 L0 180 Z" fill="rgba(255,255,255,0.06)" />
        {/* 相机图标 */}
        <rect x="52" y="78" width="56" height="40" rx="8" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" fill="none" />
        <circle cx="80" cy="98" r="12" stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none" />
        <circle cx="80" cy="98" r="6" fill="rgba(255,255,255,0.25)" />
        <rect x="62" y="72" width="16" height="8" rx="3" fill="rgba(255,255,255,0.35)" />
        <circle cx="100" cy="84" r="3" fill="rgba(255,255,255,0.4)" />
        {/* 星星 */}
        <circle cx="25" cy="35" r="1.5" fill="rgba(255,255,255,0.5)" />
        <circle cx="135" cy="25" r="2" fill="rgba(255,255,255,0.45)" />
        <circle cx="145" cy="55" r="1" fill="rgba(255,255,255,0.35)" />
        <circle cx="15" cy="65" r="1.5" fill="rgba(255,255,255,0.3)" />
        {/* 文字装饰 */}
        <text x="80" y="135" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="monospace" letterSpacing="2">SAFE EXTREME WORK</text>
      </svg>
    );
  }
  return null;
}

// ── 摄影师头像 ──
function Avatar({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="shrink-0 flex items-center justify-center"
      style={{
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        background: color,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5.5" r="3" fill="rgba(255,255,255,0.9)" />
        <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

export default function ClientAlbumList() {
  const [, navigate] = useLocation();
  // 切换有数据 / 无数据演示
  const [isEmpty, setIsEmpty] = useState(false);

  return (
    <div
      className="relative flex flex-col"
      style={{
        width: "100%",
        maxWidth: "390px",
        margin: "0 auto",
        minHeight: "100vh",
        background: "#F7F7F7",
        fontFamily: "'Noto Sans SC', sans-serif",
      }}
    >
      {/* ══ 顶部导航栏（与胶囊齐平） ══ */}
      <WechatStatusBar />

      {/* ══ 有数据状态 ══ */}
      {!isEmpty && (
        <>
          {/* 大标题区 */}
          <div className="px-5 pt-2 pb-6" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h1
                className="font-black"
                style={{ fontSize: "28px", color: "#1A1A1A", letterSpacing: "-0.5px", lineHeight: 1.2 }}
              >
                看过的相册
              </h1>
              <p style={{ fontSize: "14px", color: "#8A8A8A", marginTop: "6px" }}>
                这些美好瞬间，値得反复回味
              </p>
            </div>
            {/* 垂圆桶按钮（胶囊下方） */}
            <button
              onClick={() => setIsEmpty(true)}
              className="flex items-center justify-center active:opacity-50 transition-opacity"
              style={{ width: "36px", height: "36px", marginTop: "4px", flexShrink: 0 }}
            >
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="3" width="18" height="3" rx="1.5" fill="#1A1A1A" opacity="0.5" />
                <path d="M5 6l1.2 12a1 1 0 001 .9h7.6a1 1 0 001-.9L17 6" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                <path d="M9 10v5M13 10v5" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
                <path d="M8.5 3.5h5" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              </svg>
            </button>
          </div>

          {/* 2 列卡片网格 */}
          <div
            className="grid grid-cols-2 px-4"
            style={{ gap: "14px", paddingBottom: "100px" }}
          >
            {ALBUMS.map((album) => (
              <button
                key={album.id}
                onClick={() => navigate("/share")}
                className="flex flex-col text-left active:scale-[0.97] transition-transform"
                style={{
                  background: "#FFFFFF",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                }}
              >
                {/* 封面 */}
                <div
                  className="relative w-full"
                  style={{
                    aspectRatio: "1 / 1.1",
                    background: album.coverGradient,
                    overflow: "hidden",
                  }}
                >
                  <CoverIllustration type={album.coverType} />
                </div>

                {/* 信息区 */}
                <div className="px-3 py-3">
                  {/* 相册名 */}
                  <p
                    className="font-semibold truncate"
                    style={{ fontSize: "14px", color: "#1A1A1A", lineHeight: 1.3 }}
                  >
                    {album.title}
                  </p>

                  {/* 摄影师 */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <Avatar name={album.photographer} color={album.avatarColor} />
                    <span style={{ fontSize: "12px", color: "#8A8A8A" }}>
                      {album.photographer} 拍摄
                    </span>
                  </div>

                  {/* 浏览时间 */}
                  <div className="flex items-center gap-1 mt-1.5">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="5.5" stroke="#C8C8C8" strokeWidth="1.2" />
                      <path d="M7 4.5V7L9 8.5" stroke="#C8C8C8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: "11px", color: "#C8C8C8" }}>
                      {album.viewedAt}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 底部推广条（吸底） */}
          <div
            className="fixed bottom-0 left-1/2"
            style={{
              transform: "translateX(-50%)",
              width: "100%",
              maxWidth: "390px",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderTop: "0.5px solid rgba(0,0,0,0.06)",
              padding: "12px 20px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 20,
            }}
          >
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="4" width="14" height="11" rx="2" stroke="#8A8A8A" strokeWidth="1.4" />
                <circle cx="6.5" cy="9" r="1.5" stroke="#8A8A8A" strokeWidth="1.2" />
                <path d="M2 13L6 9.5L8.5 12L11 9L16 13" stroke="#8A8A8A" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: "13px", color: "#8A8A8A" }}>
                想拥有同款相册？
              </span>
            </div>
            <button
              onClick={() => navigate("/wechat-login")}
              className="active:opacity-60 transition-opacity"
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#07C160",
              }}
            >
              免费创建 &gt;
            </button>
          </div>
        </>
      )}

      {/* ══ 空状态 ══ */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center flex-1" style={{ paddingTop: "20px", paddingBottom: "60px", minHeight: "calc(100vh - 100px)" }}>
          {/* 标题（空状态时顶部也有） */}
          <div className="w-full px-5 mb-8">
            <h1
              className="font-bold"
              style={{ fontSize: "20px", color: "#1A1A1A" }}
            >
              看过的相册
            </h1>
          </div>

          {/* 空状态图标 */}
          <div
            className="flex items-center justify-center mb-8"
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "32px",
              background: "linear-gradient(145deg, #F0FBF5 0%, #E6F9F0 100%)",
            }}
          >
            <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
              {/* 扫描框四角 */}
              <path d="M14 28V16H26" stroke="#C8E6D4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M54 16H66V28" stroke="#C8E6D4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M66 52V64H54" stroke="#C8E6D4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M26 64H14V52" stroke="#C8E6D4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {/* 中心六边形 */}
              <path
                d="M40 24L52 31V45L40 52L28 45V31Z"
                stroke="#07C160"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M40 30L48 35V45L40 50L32 45V35Z"
                fill="#07C160"
                opacity="0.15"
              />
              {/* 中心点 */}
              <circle cx="40" cy="40" r="3" fill="#07C160" opacity="0.5" />
            </svg>
          </div>

          {/* 文案 */}
          <h2
            className="font-bold text-center"
            style={{ fontSize: "20px", color: "#1A1A1A", marginBottom: "12px" }}
          >
            还没有看过的相册
          </h2>
          <p
            className="text-center"
            style={{
              fontSize: "15px",
              color: "#8A8A8A",
              lineHeight: "1.7",
              maxWidth: "260px",
              marginBottom: "40px",
            }}
          >
            当摄影师向你分享作品时，那些美好瞬间会安全地陈列在这里
          </p>

          {/* CTA 按钮 */}
          <button
            onClick={() => navigate("/wechat-login")}
            className="flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
            style={{
              width: "240px",
              height: "52px",
              borderRadius: "999px",
              background: "#FFFFFF",
              border: "1.5px solid #E8E8E8",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              fontSize: "16px",
              fontWeight: 600,
              color: "#1A1A1A",
            }}
          >
            {/* 星星图标 */}
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L11.5 7.5H17L12.5 11L14 16.5L10 13.5L6 16.5L7.5 11L3 7.5H8.5Z" fill="#07C160" />
              <circle cx="16" cy="4" r="1.5" fill="#07C160" opacity="0.6" />
              <circle cx="4" cy="16" r="1" fill="#07C160" opacity="0.4" />
            </svg>
            我也要创建相册
          </button>

          {/* 演示切换按钮 */}
          <button
            onClick={() => setIsEmpty(false)}
            className="mt-8 active:opacity-50 transition-opacity"
            style={{ fontSize: "12px", color: "#C8C8C8" }}
          >
            查看有数据状态 →
          </button>
        </div>
      )}
    </div>
  );
}
