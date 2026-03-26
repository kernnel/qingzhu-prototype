import WechatStatusBar from "@/components/WechatStatusBar";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const GREEN = "#07C160";
const GREEN_LIGHT = "rgba(7,193,96,0.06)";
const GREEN_BORDER = "rgba(7,193,96,0.30)";

type Plan = "standard" | "pro";

// ── 勾选图标 ──────────────────────────────
function CheckIcon({ active }: { active: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
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

// ── 青竹叶子 Logo ─────────────────────────
function LeafLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M11 2C11 2 4 5 4 12C4 16.418 7.134 20 11 20C14.866 20 18 16.418 18 12C18 5 11 2 11 2Z"
        fill={GREEN}
        opacity="0.9"
      />
      <path
        d="M11 20V10M11 10C11 10 8 8 6 10"
        stroke="white"
        strokeWidth="1.4"
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

      {/* ── 顶部页眉 ── */}
      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "0.5px solid rgba(0,0,0,0.07)",
          padding: "10px 16px 10px",
          flexShrink: 0,
        }}
      >
        {/* 第一行：品牌 + 导航 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          {/* 品牌区 */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {/* 回退按钮 */}
            <button
              onClick={() => navigate(-1 as any)}
              className="active:opacity-50 transition-opacity"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#F2F2F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                marginRight: "4px",
              }}
            >
              <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
                <path d="M6.5 1.5L1.5 6.5L6.5 11.5" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <LeafLogo />
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.2px" }}>
              青竹相册
            </span>
          </div>

          {/* 导航区 */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => navigate("/")}
              className="active:opacity-60 transition-opacity"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <span style={{ fontSize: "12px", color: "#8A8A8A" }}>首页</span>
            </button>
            <button
              onClick={() => navigate("/user-center")}
              className="active:opacity-60 transition-opacity"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <span style={{ fontSize: "12px", color: "#8A8A8A" }}>我的</span>
            </button>
            <button
              className="active:opacity-60 transition-opacity"
              style={{
                background: "none",
                border: "1px solid #D8D8D8",
                borderRadius: "6px",
                padding: "3px 8px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#8A8A8A" }}>常见问题</span>
            </button>
          </div>
        </div>

        {/* 主标题区 */}
        <div style={{ textAlign: "center", paddingBottom: "4px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.4px", marginBottom: "5px", lineHeight: 1.2 }}>
            选择您的专业交付方案
          </h1>
          <p style={{ fontSize: "12px", color: "#9A9A9F", lineHeight: 1.5 }}>
            解锁无限潜力，开启专业影像交付新纪元
          </p>
        </div>
      </div>

      {/* ── 主内容区 ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px 0" }}>

        {/* 双栏对比容器 */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
            overflow: "hidden",
            display: "flex",
            marginBottom: "12px",
          }}
        >
          {/* ── 左栏：标准版 ── */}
          <button
            onClick={() => setSelected("standard")}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "20px 14px 16px",
              background: selected === "standard" ? GREEN_LIGHT : "#FFFFFF",
              border: "none",
              borderRight: selected === "standard"
                ? `1.5px solid ${GREEN_BORDER}`
                : "1px solid #F0F0F0",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.2s ease",
              outline: selected === "standard" ? `1.5px solid ${GREEN_BORDER}` : "none",
            }}
          >
            {/* 版本标题 */}
            <div style={{ marginBottom: "4px" }}>
              <span style={{ fontSize: "15px", fontWeight: 600, color: "#3A3A3A" }}>标准版</span>
            </div>
            <p style={{ fontSize: "11px", color: "#AAAAAA", lineHeight: 1.4, marginBottom: "14px" }}>
              基础功能，适合个人轻度交付
            </p>

            {/* 价格 */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "1px", marginBottom: "16px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A1A", lineHeight: 1, paddingBottom: "4px" }}>¥</span>
              <span style={{ fontSize: "42px", fontWeight: 900, color: "#1A1A1A", lineHeight: 1, letterSpacing: "-2px" }}>99</span>
              <span style={{ fontSize: "12px", color: "#9A9A9F", paddingBottom: "5px", marginLeft: "2px" }}>/年</span>
            </div>

            {/* 功能列表 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "9px", flex: 1 }}>
              {standardFeatures.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}>
                  <CheckIcon active={false} />
                  <span style={{ fontSize: "11px", color: "#9A9A9F", lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>

            {/* 购买按钮 */}
            <div
              style={{
                marginTop: "18px",
                height: "40px",
                borderRadius: "8px",
                background: selected === "standard" ? "#E6F9F0" : "#F5F5F5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s ease",
              }}
              onClick={(e) => { e.stopPropagation(); handlePurchase("standard"); }}
            >
              <span style={{
                fontSize: "13px",
                fontWeight: 700,
                color: selected === "standard" ? GREEN : "#AAAAAA",
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
              padding: "20px 14px 16px",
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
                top: "12px",
                right: "10px",
                background: GREEN,
                borderRadius: "4px",
                padding: "2px 7px",
              }}
            >
              <span style={{ fontSize: "9px", fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.5px" }}>推荐</span>
            </div>

            {/* 版本标题 */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
              <span style={{ fontSize: "16px", lineHeight: 1 }}>🔥</span>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#1A1A1A" }}>满足版</span>
            </div>
            <p style={{ fontSize: "11px", color: "#AAAAAA", lineHeight: 1.4, marginBottom: "14px" }}>
              专业功能，适合团队协作与大量交付
            </p>

            {/* 价格 */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "1px", marginBottom: "16px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A1A", lineHeight: 1, paddingBottom: "4px" }}>¥</span>
              <span style={{ fontSize: "42px", fontWeight: 900, color: "#1A1A1A", lineHeight: 1, letterSpacing: "-2px" }}>599</span>
              <span style={{ fontSize: "12px", color: "#9A9A9F", paddingBottom: "5px", marginLeft: "2px" }}>/年</span>
            </div>

            {/* 功能列表 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "9px", flex: 1 }}>
              {proFeatures.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}>
                  <CheckIcon active={true} />
                  <span style={{ fontSize: "11px", color: "#2A2A2A", lineHeight: 1.4, fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>

            {/* 购买按钮 */}
            <div
              style={{
                marginTop: "18px",
                height: "40px",
                borderRadius: "8px",
                background: selected === "pro" ? GREEN : "#F5F5F5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: selected === "pro" ? "0 4px 12px rgba(7,193,96,0.32)" : "none",
                transition: "all 0.2s ease",
              }}
              onClick={(e) => { e.stopPropagation(); handlePurchase("pro"); }}
            >
              <span style={{
                fontSize: "13px",
                fontWeight: 700,
                color: selected === "pro" ? "#FFFFFF" : "#AAAAAA",
              }}>
                {loading && selected === "pro" ? "处理中..." : "购买满足版"}
              </span>
            </div>
          </button>
        </div>

        {/* 价格与合同信息 */}
        <p style={{ textAlign: "center", fontSize: "11px", color: "#BBBBBB", marginBottom: "20px", lineHeight: 1.6 }}>
          按年计费，次年自动续费。可随时取消。
        </p>

        {/* ── 底部试用区 ── */}
        <div style={{ textAlign: "center", paddingBottom: "24px" }}>
          <p style={{ fontSize: "11px", color: "#BBBBBB", marginBottom: "8px" }}>或者……</p>
          <button
            onClick={handleTrial}
            className="active:opacity-60 transition-opacity"
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <span style={{
              fontSize: "13px",
              color: "#9A9A9F",
              textDecoration: "underline",
              textDecorationColor: "rgba(154,154,159,0.5)",
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
