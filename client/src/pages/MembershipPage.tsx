import WechatStatusBar from "@/components/WechatStatusBar";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const GREEN = "#07C160";

export default function MembershipPage() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);

  const handlePurchaseStandard = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast("🎉 标准版开通成功！", { duration: 2500 });
      setTimeout(() => navigate("/user-center"), 800);
    }, 1400);
  };

  const handlePurchasePro = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast("🎉 满足版开通成功！", { duration: 2500 });
      setTimeout(() => navigate("/user-center"), 800);
    }, 1400);
  };

  const handleTrial = () => {
    toast("🎉 7 天免费试用已开启！", { duration: 2500 });
    setTimeout(() => navigate("/user-center"), 800);
  };

  const CheckIcon = ({ active }: { active?: boolean }) => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M2.5 7.5L5.5 10.5L12.5 3.5"
        stroke={active ? GREEN : "#CCCCCC"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div
      style={{
        width: "390px",
        height: "844px",
        margin: "0 auto",
        background: "#F2F2F2",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Noto Sans SC', 'PingFang SC', sans-serif",
      }}
    >
      <WechatStatusBar />

      {/* ── 顶部导航：回退 / 标题 / 胶囊标签 三者垂直居中齐平 ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 16px 10px",
          flexShrink: 0,
          gap: "10px",
        }}
      >
        {/* 回退按钮 */}
        <button
          onClick={() => navigate(-1 as any)}
          className="active:opacity-50 transition-opacity"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#E8E8E8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            border: "none",
          }}
        >
          <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
            <path d="M7.5 1.5L2 7.5L7.5 13.5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* 标题 */}
        <span
          style={{
            flex: 1,
            fontSize: "17px",
            fontWeight: 700,
            color: "#1A1A1A",
            lineHeight: 1,
          }}
        >
          选择适合您的专业方案
        </span>

        {/* 胶囊标签 */}
        <div
          style={{
            flexShrink: 0,
            background: "rgba(7,193,96,0.12)",
            borderRadius: "999px",
            padding: "4px 10px",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 600, color: GREEN }}>
            限时优惠
          </span>
        </div>
      </div>

      {/* ── 主内容区 ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 0" }}>

        {/* 双列定价卡片 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>

          {/* 标准版卡片 */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              padding: "18px 16px 16px",
              border: "1.5px solid #EBEBEB",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* 版本名 */}
            <span style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A", marginBottom: "10px" }}>
              标准版
            </span>

            {/* 价格 */}
            <div style={{ display: "flex", alignItems: "baseline", marginBottom: "2px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A1A" }}>¥</span>
              <span style={{ fontSize: "40px", fontWeight: 900, color: "#1A1A1A", lineHeight: 1, letterSpacing: "-1px" }}>99</span>
              <span style={{ fontSize: "12px", color: "#9A9A9F", marginLeft: "2px" }}>/年</span>
            </div>
            {/* 划线原价 */}
            <span style={{ fontSize: "11px", color: "#CCCCCC", textDecoration: "line-through", marginBottom: "14px" }}>
              ¥129/年
            </span>

            {/* 权益列表 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px", flex: 1 }}>
              {["每日 200 张照片", "7 天保存", "高清交付"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <CheckIcon active={false} />
                  <span style={{ fontSize: "12px", color: "#9A9A9F" }}>{item}</span>
                </div>
              ))}
            </div>

            {/* 购买按钮 */}
            <button
              onClick={handlePurchaseStandard}
              disabled={loading}
              className="active:opacity-80 transition-opacity"
              style={{
                width: "100%",
                height: "44px",
                borderRadius: "12px",
                background: "#E6F9F0",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 700, color: GREEN }}>购买标准版</span>
            </button>
          </div>

          {/* 满足版卡片 */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              padding: "18px 16px 16px",
              border: "1.5px solid #EBEBEB",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* 版本名 + 火焰 */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "10px" }}>
              <span style={{ fontSize: "16px", lineHeight: 1 }}>🔥</span>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>满足版</span>
            </div>

            {/* 价格 */}
            <div style={{ display: "flex", alignItems: "baseline", marginBottom: "14px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A1A" }}>¥</span>
              <span style={{ fontSize: "40px", fontWeight: 900, color: "#1A1A1A", lineHeight: 1, letterSpacing: "-1px" }}>599</span>
              <span style={{ fontSize: "12px", color: "#9A9A9F", marginLeft: "2px" }}>/年</span>
            </div>

            {/* 权益列表 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px", flex: 1 }}>
              {["每日 500 张照片", "30 天保存", "原图交付"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <CheckIcon active={true} />
                  <span style={{ fontSize: "12px", color: "#1A1A1A", fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* 购买按钮 */}
            <button
              onClick={handlePurchasePro}
              disabled={loading}
              className="active:opacity-80 transition-opacity"
              style={{
                width: "100%",
                height: "44px",
                borderRadius: "12px",
                background: GREEN,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(7,193,96,0.35)",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>购买满足版</span>
            </button>
          </div>
        </div>

        {/* 免费试用按钮（小尺寸，放在底部内容区） */}
        <button
          onClick={handleTrial}
          className="active:opacity-70 transition-opacity"
          style={{
            width: "100%",
            height: "50px",
            borderRadius: "14px",
            background: "#FFFFFF",
            border: "1.5px solid #E8E8E8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <span style={{ fontSize: "14px", color: "#3A3A3A", fontWeight: 400 }}>
            先开启 7 天免费试用（标准版）
          </span>
        </button>

        {/* 信任文字 */}
        <p style={{ textAlign: "center", fontSize: "11px", color: "#C8C8C8", marginBottom: "16px" }}>
          支付安全保障 · 支持随时取消续费
        </p>
      </div>
    </div>
  );
}
