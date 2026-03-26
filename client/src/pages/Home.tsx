/**
 * 青竹快传 · 首页
 * 设计风格：竹光通透 · 中国当代极简主义 × 高端 SaaS
 * 用途：摄影师端引导落地页，一屏内完成品牌展示 + 功能介绍 + 新建相册 CTA
 * 主色：#07C160（微信绿）| 背景：温暖米白 #FAFAF8
 *
 * 授权逻辑：
 * - 首次点击「新建相册」→ 检测未授权 → 从下往上弹出微信系统授权弹窗
 * - 点击手机号选项 → 授权成功 → 跳转相册管理页
 * - 点击「不允许」→ 关闭弹窗，停留首页
 */

import WechatStatusBar from "@/components/WechatStatusBar";
import { useState } from "react";
import { useLocation } from "wouter";

// 功能介绍数据
const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3L25 8.5V19.5L14 25L3 19.5V8.5L14 3Z" stroke="#07C160" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M14 3V25M3 8.5L25 19.5M25 8.5L3 19.5" stroke="#07C160" strokeWidth="1.2" strokeOpacity="0.4"/>
      </svg>
    ),
    title: "极速上传",
    desc: "批量照片秒传，告别漫长等待",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="4" stroke="#07C160" strokeWidth="1.5"/>
        <path d="M9 14L12.5 17.5L19 11" stroke="#07C160" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "一键交付",
    desc: "生成专属链接，客户扫码即看",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#07C160" strokeWidth="1.5"/>
        <path d="M14 9V14.5L17.5 17" stroke="#07C160" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "实时追踪",
    desc: "查看浏览记录，掌握客户动态",
  },
];

// 模拟的手机号列表（微信绑定号码）
const MOCK_PHONES = [
  { number: "136****4003", label: "微信绑定号码" },
  { number: "132****4354", label: "" },
];

export default function Home() {
  const [pressed, setPressed] = useState(false);
  const [, navigate] = useLocation();

  // 授权状态：false = 未授权，true = 已授权
  const [authorized, setAuthorized] = useState(false);
  // 弹窗显示状态
  const [showAuthSheet, setShowAuthSheet] = useState(false);
  // 弹窗动画状态
  const [sheetVisible, setSheetVisible] = useState(false);
  // 选中的手机号
  const [selectedPhone, setSelectedPhone] = useState<number | null>(null);

  const openAuthSheet = () => {
    setShowAuthSheet(true);
    setSelectedPhone(null);
    // 下一帧触发入场动画
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSheetVisible(true));
    });
  };

  const closeAuthSheet = () => {
    setSheetVisible(false);
    setTimeout(() => setShowAuthSheet(false), 320);
  };

  const handleCreateAlbum = () => {
    setPressed(true);
    setTimeout(() => {
      setPressed(false);
      navigate("/wechat-login");
    }, 150);
  };

  const handlePhoneSelect = (idx: number) => {
    setSelectedPhone(idx);
    setTimeout(() => {
      setAuthorized(true);
      closeAuthSheet();
      setTimeout(() => navigate("/album"), 350);
    }, 400);
  };

  const handleDeny = () => {
    closeAuthSheet();
  };

  return (
    <div className="min-h-screen bg-[#EFEFEF] flex items-center justify-center p-4">
      {/* 手机外壳 */}
      <div
        className="relative bg-[#FAFAF8] overflow-hidden shadow-2xl"
        style={{
          width: "390px",
          height: "844px",
          borderRadius: "44px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        {/* 背景装饰图 */}
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663462913958/JJcvfcAkBQD6g2Lm3uZPmD/qingzhu-hero-bg-5NbuuNJTUJJvDAesYsiAva.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ opacity: 0.6 }}
        />

        {/* 状态栏 */}
        <div className="relative z-10">
          <WechatStatusBar
            leftSlot={
              <button
                onClick={() => navigate("/user-center")}
                className="flex items-center justify-center active:opacity-60 transition-opacity"
                style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(7,193,96,0.10)" }}
              >
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="8" r="4" stroke="#07C160" strokeWidth="1.6"/>
                  <path d="M3 19c0-4.42 3.58-8 8-8s8 3.58 8 8" stroke="#07C160" strokeWidth="1.6" strokeLinecap="round"/>
                  {/* 会员皇冠小角标 */}
                  <path d="M16 5l1.2-2 1.2 1.5 1.6-2.5v4H16Z" fill="#D4A843" stroke="none"/>
                </svg>
              </button>
            }
          />
        </div>

        {/* 主内容区 */}
        <div className="relative z-10 flex flex-col h-full px-7" style={{ paddingTop: "28px", paddingBottom: "40px" }}>

          {/* Logo + 品牌名 */}
          <div className="animate-fade-in flex items-center gap-2.5 mb-1">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: "44px",
                height: "44px",
                background: "linear-gradient(135deg, #07C160 0%, #05A050 100%)",
                boxShadow: "0 4px 14px rgba(7,193,96,0.35)",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M13 22V8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M10 14.5h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M10 10h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M13 12C11 10 7 9.5 6 7c2.5 0 5.5 1.5 7 5Z" fill="white" fillOpacity="0.9"/>
                <path d="M13 9C15 7 19 6.5 20 4c-2.5 0-5.5 1.5-7 5Z" fill="white" fillOpacity="0.7"/>
              </svg>
            </div>
            <div>
              <div className="text-[20px] font-black text-[#1C1C1E] leading-tight" style={{ fontFamily: "'Noto Sans SC', sans-serif", letterSpacing: "-0.3px" }}>
                青竹快传
              </div>
              <div className="text-[11px] text-[#07C160] font-medium tracking-widest uppercase" style={{ letterSpacing: "0.12em" }}>
                PHOTO DELIVERY
              </div>
            </div>
          </div>

          {/* Slogan */}
          <div className="animate-slide-up delay-100 mt-8 mb-2">
            <h1
              className="text-[32px] font-black text-[#1C1C1E] leading-[1.2]"
              style={{ fontFamily: "'Noto Sans SC', sans-serif", letterSpacing: "-0.5px" }}
            >
              拍完即传，<br />
              <span style={{ color: "#07C160" }}>快人一步</span>
            </h1>
          </div>
          <p className="animate-slide-up delay-200 text-[14px] text-[#6B6B6B] leading-relaxed mt-2" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
            专为摄影师打造的极速交片工具，<br />让每一次交付都成为品牌加分项。
          </p>

          {/* 功能介绍 */}
          <div className="animate-slide-up delay-300 mt-8 grid grid-cols-3 gap-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center rounded-2xl py-4 px-2"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(7,193,96,0.08)",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full mb-3"
                  style={{ width: "52px", height: "52px", background: "rgba(7,193,96,0.08)" }}
                >
                  {f.icon}
                </div>
                <div className="text-[13px] font-bold text-[#1C1C1E] mb-1" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                  {f.title}
                </div>
                <div className="text-[11px] text-[#8C8C8C] leading-snug" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1" style={{ maxHeight: "32px" }} />

          {/* 分隔线 */}
          <div className="animate-fade-in delay-500 flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#07C160]/30 to-transparent" />
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="2.5" fill="#07C160" fillOpacity="0.5"/>
            </svg>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#07C160]/30 to-transparent" />
          </div>

          {/* 主 CTA 按钮 */}
          <button
            onClick={handleCreateAlbum}
            className="animate-scale-in delay-600 btn-ripple w-full flex items-center justify-center gap-2.5 text-white font-bold text-[17px] rounded-2xl transition-all duration-150"
            style={{
              height: "56px",
              background: "linear-gradient(135deg, #07C160 0%, #05A050 100%)",
              boxShadow: "0 6px 24px rgba(7,193,96,0.4)",
              fontFamily: "'Noto Sans SC', sans-serif",
              transform: pressed ? "scale(0.97)" : "scale(1)",
              letterSpacing: "0.02em",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="5" width="18" height="14" rx="3" stroke="white" strokeWidth="1.6"/>
              <path d="M7 5V3.5C7 2.67 7.67 2 8.5 2h5c.83 0 1.5.67 1.5 1.5V5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M11 9v6M8 12h6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            新建相册
          </button>


        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#1C1C1E]/20 rounded-full pointer-events-none" />

        {/* ══════════════════════════════════════
            微信系统授权弹窗（从下往上滑出）
            完全还原微信小程序 getPhoneNumber 系统弹窗样式
        ══════════════════════════════════════ */}
        {showAuthSheet && (
          <>
            {/* 遮罩层 */}
            <div
              className="absolute inset-0 z-20 transition-all duration-300"
              style={{
                background: sheetVisible ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
              }}
              onClick={handleDeny}
            />

            {/* 弹窗主体 */}
            <div
              className="absolute bottom-0 left-0 right-0 z-30 transition-transform duration-300 ease-out"
              style={{
                transform: sheetVisible ? "translateY(0)" : "translateY(100%)",
                borderRadius: "20px 20px 0 0",
                background: "#F2F2F7",
                overflow: "hidden",
              }}
            >
              {/* 顶部品牌栏 */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ background: "#FFFFFF" }}
              >
                <div className="flex items-center gap-2.5">
                  {/* 小程序图标 */}
                  <div
                    className="flex items-center justify-center rounded-lg"
                    style={{
                      width: "32px",
                      height: "32px",
                      background: "linear-gradient(135deg, #07C160 0%, #05A050 100%)",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 26 26" fill="none">
                      <path d="M13 22V8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M10 14.5h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M10 10h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M13 12C11 10 7 9.5 6 7c2.5 0 5.5 1.5 7 5Z" fill="white" fillOpacity="0.9"/>
                      <path d="M13 9C15 7 19 6.5 20 4c-2.5 0-5.5 1.5-7 5Z" fill="white" fillOpacity="0.7"/>
                    </svg>
                  </div>
                  <span
                    className="text-[15px] font-medium text-[#1C1C1E]"
                    style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                  >
                    青竹快传 申请
                  </span>
                </div>
                {/* 信息图标 */}
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: "28px", height: "28px", background: "#E5E5EA" }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="#8E8E93" strokeWidth="1.2"/>
                    <path d="M7 6.5V10" stroke="#8E8E93" strokeWidth="1.3" strokeLinecap="round"/>
                    <circle cx="7" cy="4.5" r="0.7" fill="#8E8E93"/>
                  </svg>
                </div>
              </div>

              {/* 标题区 */}
              <div className="px-5 pt-5 pb-4" style={{ background: "#FFFFFF" }}>
                <h2
                  className="text-[20px] font-bold text-[#1C1C1E] mb-1.5"
                  style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                >
                  申请获取并验证你的手机号
                </h2>
                <p
                  className="text-[14px] text-[#8E8E93]"
                  style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                >
                  用于账号绑定、快捷登录及重要消息通知
                </p>
              </div>

              {/* 手机号选项列表 */}
              <div className="mx-4 mt-3 rounded-2xl overflow-hidden" style={{ background: "#FFFFFF" }}>
                {MOCK_PHONES.map((phone, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePhoneSelect(idx)}
                    className="w-full flex flex-col items-center justify-center transition-all active:opacity-70"
                    style={{
                      height: "64px",
                      borderBottom: idx < MOCK_PHONES.length - 1 ? "0.5px solid rgba(0,0,0,0.1)" : "none",
                      background: selectedPhone === idx ? "rgba(7,193,96,0.06)" : "transparent",
                    }}
                  >
                    <span
                      className="text-[18px] font-medium text-[#1C1C1E]"
                      style={{ fontFamily: "'Noto Sans SC', sans-serif", letterSpacing: "0.05em" }}
                    >
                      {phone.number}
                    </span>
                    {phone.label && (
                      <span
                        className="text-[12px] text-[#8E8E93] mt-0.5"
                        style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                      >
                        {phone.label}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* 不允许按钮 */}
              <div className="mx-4 mt-3 rounded-2xl overflow-hidden" style={{ background: "#FFFFFF" }}>
                <button
                  onClick={handleDeny}
                  className="w-full flex items-center justify-center transition-all active:opacity-70"
                  style={{ height: "56px" }}
                >
                  <span
                    className="text-[17px] text-[#1C1C1E]"
                    style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                  >
                    不允许
                  </span>
                </button>
              </div>

              {/* 管理号码 */}
              <div className="flex items-center justify-center py-4">
                <button
                  onClick={() => {}}
                  className="text-[14px] text-[#07C160] active:opacity-60"
                  style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                >
                  管理号码
                </button>
              </div>

              {/* 底部安全区 */}
              <div style={{ height: "20px" }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
