import WechatStatusBar from "@/components/WechatStatusBar";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const GREEN = "#07C160";
const GREEN_LIGHT = "rgba(7,193,96,0.06)";
const GREEN_BORDER = "rgba(7,193,96,0.28)";

type Plan = "standard" | "pro";

function CheckIcon({ active }: { active: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
      <path
        d="M2 7L5.5 10.5L12 3"
        stroke={active ? GREEN : "#C8C8C8"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MembershipPage() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<Plan>("pro");
  const [loading, setLoading] = useState(false);

  const handlePurchase = (plan: Plan) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast(`🎉 ${plan === "pro" ? "满足版" : "标准版"}开通成功！`, { duration: 2500 });
      setTimeout(() => navigate("/user-center"), 800);
    }, 1400);
  };

  const handleTrial = () => {
    toast("🎉 7 天免费试用已开启！", { duration: 2500 });
    setTimeout(() => navigate("/user-center"), 800);
  };

  const standardFeatures = [
    "单日上传限额：200 张照片",
    "相册保存期限：7 天",
    "交付画质：高清",
  ];

  const proFeatures = [
    "单日上传限额：500 张照片",
    "相册保存期限：30 天",
    "交付画质：4K / 原图无损",
  ];

  return (
    <div
      style={{
        width: "390px",
        height: "844px",
        margin: "0 auto",
        background: "#F7F8FA",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Noto Sans SC', 'PingFang SC', sans-serif",
      }}
    >
      <WechatStatusBar />

      {/* ── 极简头部：只有返回箭头 + 居中标题 ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 16px 12px",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {/* 返回按钮 */}
        <button
          onClick={() => navigate(-1 as any)}
          className="active:opacity-50 transition-opacity"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "#EBEBEB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            flexShrink: 0,
          }}
        >
          <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
            <path d="M6.5 1.5L1.5 6.5L6.5 11.5" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* 居中标题 */}
        <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", pointerEvents: "none" }}>
          <h1 style={{ fontSize: "17px", fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.3px", margin: 0 }}>
            选择适合您的专业方案
          </h1>
        </div>
      </div>

      {/* ── 主内容区 ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 14px 0" }}>

        {/* 双栏对比卡片 */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
            overflow: "hidden",
            display: "flex",
            marginBottom: "14px",
          }}
        >
          {/* ── 左栏：标准版 ── */}
          <button
            onClick={() => setSelected("standard")}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "24px 16px 20px",
              background: selected === "standard" ? GREEN_LIGHT : "#FFFFFF",
              border: "none",
              borderRight: "1px solid #F0F0F0",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.2s ease",
              outline: selected === "standard" ? `1.5px solid ${GREEN_BORDER}` : "none",
            }}
          >
            {/* 版本标题 */}
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#3A3A3A", marginBottom: "5px" }}>
              标准版
            </span>
            <p style={{ fontSize: "11px", color: "#BBBBBB", lineHeight: 1.5, marginBottom: "18px" }}>
              基础配置，满足日常轻量化交付
            </p>

            {/* 价格 */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "1px", marginBottom: "22px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A1A", lineHeight: 1, paddingBottom: "5px" }}>¥</span>
              <span style={{ fontSize: "46px", fontWeight: 900, color: "#1A1A1A", lineHeight: 1, letterSpacing: "-2px" }}>99</span>
              <span style={{ fontSize: "12px", color: "#AAAAAA", paddingBottom: "6px", marginLeft: "3px" }}>/年</span>
            </div>

            {/* 功能列表 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "13px", flex: 1 }}>
              {standardFeatures.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <CheckIcon active={false} />
                  <span style={{ fontSize: "12px", color: "#AAAAAA", lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>

            {/* 购买按钮 */}
            <div
              style={{
                marginTop: "22px",
                height: "42px",
                borderRadius: "9px",
                background: selected === "standard" ? "#E6F9F0" : "#F5F5F5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s ease",
              }}
              onClick={(e) => { e.stopPropagation(); handlePurchase("standard"); }}
            >
              <span style={{
                fontSize: "13px",
                fontWeight: 700,
                color: selected === "standard" ? GREEN : "#C0C0C0",
              }}>
                {loading && selected === "standard" ? "处理中..." : "购买标准版"}
              </span>
            </div>
          </button>

          {/* ── 右栏：满足版 ── */}
          <button
            onClick={() => setSelected("pro")}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "24px 16px 20px",
              background: selected === "pro" ? GREEN_LIGHT : "#FFFFFF",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.2s ease",
              outline: selected === "pro" ? `1.5px solid ${GREEN_BORDER}` : "none",
              position: "relative",
            }}
          >
            {/* 推荐标签 */}
            <div
              style={{
                position: "absolute",
                top: "14px",
                right: "12px",
                background: GREEN,
                borderRadius: "4px",
                padding: "2px 7px",
              }}
            >
              <span style={{ fontSize: "9px", fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.5px" }}>推荐</span>
            </div>

            {/* 版本标题 */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" }}>
              <span style={{ fontSize: "16px", lineHeight: 1 }}>🔥</span>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#1A1A1A" }}>满足版</span>
            </div>
            <p style={{ fontSize: "11px", color: "#BBBBBB", lineHeight: 1.5, marginBottom: "18px" }}>
              专属特权，轻松应对海量高频交付
            </p>

            {/* 价格 */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "1px", marginBottom: "22px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A1A", lineHeight: 1, paddingBottom: "5px" }}>¥</span>
              <span style={{ fontSize: "46px", fontWeight: 900, color: "#1A1A1A", lineHeight: 1, letterSpacing: "-2px" }}>599</span>
              <span style={{ fontSize: "12px", color: "#AAAAAA", paddingBottom: "6px", marginLeft: "3px" }}>/年</span>
            </div>

            {/* 功能列表 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "13px", flex: 1 }}>
              {proFeatures.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <CheckIcon active={true} />
                  <span style={{ fontSize: "12px", color: "#2A2A2A", lineHeight: 1.5, fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>

            {/* 购买按钮 */}
            <div
              style={{
                marginTop: "22px",
                height: "42px",
                borderRadius: "9px",
                background: selected === "pro" ? GREEN : "#F5F5F5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: selected === "pro" ? "0 4px 14px rgba(7,193,96,0.30)" : "none",
                transition: "all 0.2s ease",
              }}
              onClick={(e) => { e.stopPropagation(); handlePurchase("pro"); }}
            >
              <span style={{
                fontSize: "13px",
                fontWeight: 700,
                color: selected === "pro" ? "#FFFFFF" : "#C0C0C0",
              }}>
                {loading && selected === "pro" ? "处理中..." : "购买满足版"}
              </span>
            </div>
          </button>
        </div>

        {/* 价格说明 */}
        <p style={{ textAlign: "center", fontSize: "11px", color: "#C8C8C8", marginBottom: "20px", lineHeight: 1.6 }}>
          按年计费，次年自动续费。可随时取消。
        </p>

        {/* ── 底部试用入口（极度克制） ── */}
        <div style={{ textAlign: "center", paddingBottom: "24px" }}>
          <button
            onClick={handleTrial}
            className="active:opacity-60 transition-opacity"
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <span style={{
              fontSize: "12px",
              color: "#BBBBBB",
              textDecoration: "underline",
              textDecorationColor: "rgba(187,187,187,0.5)",
              textUnderlineOffset: "3px",
            }}>
              先开启 7 天免费试用（标准版）
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
