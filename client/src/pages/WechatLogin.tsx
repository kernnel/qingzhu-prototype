/**
 * 青竹快传 · 微信授权登录页
 * 还原设计：极简白底 + 品牌 logo + 微信快捷登录按钮 + 协议勾选
 * 点击登录按钮 → 从下往上弹出微信小程序授权手机号系统弹窗
 */

import WechatStatusBar from "@/components/WechatStatusBar";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function WechatLogin() {
  const [, navigate] = useLocation();
  const [agreed, setAgreed] = useState(false);
  const [shaking, setShaking] = useState(false);

  // 授权弹窗状态
  const [showAuthSheet, setShowAuthSheet] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<number | null>(null);

  const openAuthSheet = () => {
    setShowAuthSheet(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSheetVisible(true));
    });
  };

  const closeAuthSheet = () => {
    setSheetVisible(false);
    setTimeout(() => setShowAuthSheet(false), 320);
  };

  const handleLogin = () => {
    if (!agreed) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    openAuthSheet();
  };

  const handlePhoneSelect = (idx: number) => {
    setSelectedPhone(idx);
    setTimeout(() => {
      closeAuthSheet();
      setTimeout(() => navigate("/user-center"), 200);
    }, 400);
  };

  const handleDeny = () => {
    closeAuthSheet();
  };

  return (
    <div
      style={{
        width: "390px",
        height: "844px",
        margin: "0 auto",
        background: "#F7F7F7",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
      }}
    >
      {/* 顶部双排导航（系统状态栏 + 小程序胶囊） */}
      <WechatStatusBar
        leftSlot={
          <button
            className="flex items-center justify-center active:opacity-50 transition-opacity"
            style={{ width: "36px", height: "36px" }}
            onClick={() => navigate("/client-albums")}
          >
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M8 2L2 9l6 7" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        }
      />

      {/* 主内容区 */}
      <div
        className="flex-1 flex flex-col items-center"
        style={{ paddingTop: "60px" }}
      >
        {/* Logo 圆形 */}
        <div
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            background: "#EFEFEF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect x="8" y="10" width="6" height="24" rx="3" fill="#07C160" opacity="0.85" />
            <rect x="8" y="18" width="6" height="3" rx="1.5" fill="#05A050" />
            <rect x="17" y="6" width="6" height="32" rx="3" fill="#07C160" />
            <rect x="17" y="16" width="6" height="3" rx="1.5" fill="#05A050" />
            <rect x="17" y="26" width="6" height="3" rx="1.5" fill="#05A050" />
            <path d="M28 22h10M33 17l5 5-5 5" stroke="#07C160" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* 标题 */}
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 700,
            color: "#1A1A1A",
            letterSpacing: "-0.3px",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          欢迎使用青竹快传
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "#8A8A8A",
            textAlign: "center",
          }}
        >
          摄影师的高效、无损交付工具
        </p>
      </div>

      {/* 底部操作区 */}
      <div
        style={{
          padding: "0 24px 200px",
          flexShrink: 0,
        }}
      >
        {/* 微信快捷登录按钮 */}
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2.5 active:opacity-85 transition-opacity"
          style={{
            height: "54px",
            background: "#07C160",
            borderRadius: "999px",
            marginBottom: "24px",
            boxShadow: "0 4px 20px rgba(7,193,96,0.35)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M8.5 5C4.91 5 2 7.46 2 10.5c0 1.7.9 3.22 2.3 4.24L3.5 17l2.3-1.15A7.6 7.6 0 0 0 8.5 16c.35 0 .7-.02 1.04-.06A5.5 5.5 0 0 1 9.5 14c0-3.04 2.69-5.5 6-5.5.2 0 .4.01.6.03C15.3 6.55 12.17 5 8.5 5Z"
              fill="white"
            />
            <path
              d="M20 14c0-2.21-2.01-4-4.5-4S11 11.79 11 14s2.01 4 4.5 4c.6 0 1.17-.1 1.7-.28L19.5 19l-.8-1.8A3.9 3.9 0 0 0 20 14Z"
              fill="white"
            />
          </svg>
          <span
            style={{
              fontSize: "17px",
              fontWeight: 600,
              color: "#FFFFFF",
              letterSpacing: "0.02em",
            }}
          >
            微信快捷登录
          </span>
        </button>

        {/* 协议勾选 */}
        <div
          className="flex items-start gap-2.5"
          style={shaking ? { animation: "shake 0.4s ease" } : {}}
        >
          <button
            onClick={() => setAgreed(!agreed)}
            className="flex-shrink-0 flex items-center justify-center active:opacity-60 transition-opacity"
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "3px",
              border: agreed ? "none" : "1.5px solid #CCCCCC",
              background: agreed ? "#07C160" : "transparent",
              marginTop: "1px",
            }}
          >
            {agreed && (
              <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                <path d="M1 4l3 3 6-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <p style={{ fontSize: "12px", color: "#8A8A8A", lineHeight: 1.6 }}>
            我已阅读并同意
            <span style={{ color: "#07C160", textDecoration: "underline", cursor: "pointer" }}>《用户服务协议》</span>
            和
            <span style={{ color: "#07C160", textDecoration: "underline", cursor: "pointer" }}>《隐私政策》</span>
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          微信小程序授权手机号系统弹窗
          从下往上滑出，完全还原微信原生样式
      ══════════════════════════════════════ */}
      {showAuthSheet && (
        <>
          {/* 遮罩层 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 20,
              background: sheetVisible ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
              transition: "background 0.3s ease",
            }}
            onClick={handleDeny}
          />

          {/* 弹窗主体 */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 30,
              transform: sheetVisible ? "translateY(0)" : "translateY(100%)",
              transition: "transform 0.32s cubic-bezier(0.32,0.72,0,1)",
              borderRadius: "20px 20px 0 0",
              background: "#F2F2F7",
              paddingBottom: "34px",
            }}
          >
            {/* 顶部把手 */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: "10px", paddingBottom: "4px" }}>
              <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "rgba(0,0,0,0.18)" }} />
            </div>

            {/* 小程序信息头 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 20px 10px",
              }}
            >
              {/* 小程序 logo */}
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #07C160, #05A050)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="26" height="26" viewBox="0 0 44 44" fill="none">
                  <rect x="8" y="10" width="6" height="24" rx="3" fill="white" opacity="0.85" />
                  <rect x="17" y="6" width="6" height="32" rx="3" fill="white" />
                  <path d="M28 22h10M33 17l5 5-5 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>青竹快传</div>
                <div style={{ fontSize: "12px", color: "#8A8A8E", marginTop: "2px" }}>申请获取你的手机号</div>
              </div>
            </div>

            {/* 分割线 */}
            <div style={{ height: "0.5px", background: "rgba(0,0,0,0.1)", margin: "0 0 8px" }} />

            {/* 说明文字 */}
            <div style={{ padding: "12px 20px 8px", fontSize: "13px", color: "#8A8A8E", lineHeight: 1.6 }}>
              该小程序将获取你的手机号，用于账号注册与登录。
            </div>

            {/* 手机号选项 */}
            {[
              { label: "本机号码", number: "138 **** 8888", verified: true },
              { label: "其他手机号", number: "手动输入", verified: false },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handlePhoneSelect(idx)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "calc(100% - 32px)",
                  margin: "6px 16px 0",
                  padding: "14px 16px",
                  background: selectedPhone === idx ? "rgba(7,193,96,0.08)" : "#FFFFFF",
                  borderRadius: "12px",
                  border: selectedPhone === idx ? "1.5px solid rgba(7,193,96,0.4)" : "1.5px solid transparent",
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "14px", color: "#8A8A8E", marginBottom: "3px" }}>{item.label}</div>
                  <div style={{ fontSize: "17px", fontWeight: 600, color: "#1A1A1A" }}>{item.number}</div>
                </div>
                {item.verified && (
                  <div
                    style={{
                      padding: "3px 8px",
                      background: "rgba(7,193,96,0.1)",
                      borderRadius: "999px",
                      fontSize: "11px",
                      color: "#07C160",
                      fontWeight: 500,
                    }}
                  >
                    已验证
                  </div>
                )}
                {selectedPhone === idx && (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8" fill="#07C160" />
                    <path d="M5 9l3 3 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}

            {/* 拒绝按钮 */}
            <button
              onClick={handleDeny}
              style={{
                display: "block",
                width: "calc(100% - 32px)",
                margin: "12px 16px 0",
                padding: "14px",
                background: "transparent",
                borderRadius: "12px",
                fontSize: "16px",
                color: "#8A8A8E",
                textAlign: "center",
                cursor: "pointer",
                border: "none",
              }}
            >
              拒绝
            </button>
          </div>
        </>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
