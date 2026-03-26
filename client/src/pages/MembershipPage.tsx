import WechatStatusBar from "@/components/WechatStatusBar";
import { useLocation } from "wouter";
import { toast } from "sonner";

const GREEN = "#07C160";

function CheckIcon({ active }: { active: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
      <path
        d="M2.5 7.5L5.5 10.5L12.5 3.5"
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

  const handlePurchaseStandard = () => {
    toast("🎉 标准版开通成功！", { duration: 2500 });
    setTimeout(() => navigate("/user-center"), 800);
  };

  const handlePurchasePro = () => {
    toast("🎉 满足版开通成功！", { duration: 2500 });
    setTimeout(() => navigate("/user-center"), 800);
  };

  const handleTrial = () => {
    toast("🎉 7 天免费试用已开启！", { duration: 2500 });
    setTimeout(() => navigate("/user-center"), 800);
  };

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

      {/* ── 极简头部 ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 16px 12px",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <button
          onClick={() => navigate(-1 as any)}
          className="active:opacity-50 transition-opacity"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "#E4E4E4",
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

        <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", pointerEvents: "none" }}>
          <h1 style={{ fontSize: "17px", fontWeight: 700, color: "#1A1A1A", margin: 0, letterSpacing: "-0.2px" }}>
            选择适合您的专业方案
          </h1>
        </div>
      </div>

      {/* ── 主内容区 ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 14px 0" }}>

        {/* 双列卡片容器 */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>

          {/* ── 标准版 ── */}
          <div
            style={{
              flex: 1,
              background: "#FFFFFF",
              borderRadius: "16px",
              border: "1.5px solid #EBEBEB",
              padding: "20px 16px 16px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ fontSize: "15px", fontWeight: 500, color: "#1A1A1A", marginBottom: "14px" }}>
              标准版
            </span>

            {/* 价格 */}
            <div style={{ display: "flex", alignItems: "flex-end", marginBottom: "20px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A1A", paddingBottom: "6px" }}>¥</span>
              <span style={{ fontSize: "48px", fontWeight: 900, color: "#1A1A1A", lineHeight: 1, letterSpacing: "-2px" }}>99</span>
              <span style={{ fontSize: "13px", color: "#AAAAAA", paddingBottom: "6px", marginLeft: "3px" }}>/年</span>
            </div>

            {/* 权益列表 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
              {["每日 200 张照片", "7 天保存", "高清交付"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckIcon active={false} />
                  <span style={{ fontSize: "13px", color: "#AAAAAA" }}>{item}</span>
                </div>
              ))}
            </div>

            {/* 购买按钮 */}
            <button
              onClick={handlePurchaseStandard}
              className="active:opacity-80 transition-opacity"
              style={{
                marginTop: "20px",
                width: "100%",
                height: "48px",
                borderRadius: "12px",
                background: "#E8F9F0",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "15px", fontWeight: 700, color: GREEN }}>购买标准版</span>
            </button>
          </div>

          {/* ── 满足版 ── */}
          <div
            style={{
              flex: 1,
              background: "#FFFFFF",
              borderRadius: "16px",
              border: "1.5px solid #EBEBEB",
              padding: "20px 16px 16px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "14px" }}>
              <span style={{ fontSize: "17px", lineHeight: 1 }}>🔥</span>
              <span style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>满足版</span>
            </div>

            {/* 价格 */}
            <div style={{ display: "flex", alignItems: "flex-end", marginBottom: "20px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A1A", paddingBottom: "6px" }}>¥</span>
              <span style={{ fontSize: "48px", fontWeight: 900, color: "#1A1A1A", lineHeight: 1, letterSpacing: "-2px" }}>599</span>
              <span style={{ fontSize: "13px", color: "#AAAAAA", paddingBottom: "6px", marginLeft: "3px" }}>/年</span>
            </div>

            {/* 权益列表 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
              {["每日 500 张照片", "30 天保存", "原图交付"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckIcon active={true} />
                  <span style={{ fontSize: "13px", color: "#1A1A1A", fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* 购买按钮 */}
            <button
              onClick={handlePurchasePro}
              className="active:opacity-80 transition-opacity"
              style={{
                marginTop: "20px",
                width: "100%",
                height: "48px",
                borderRadius: "12px",
                background: GREEN,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 14px rgba(7,193,96,0.32)",
              }}
            >
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF" }}>购买满足版</span>
            </button>
          </div>
        </div>

        {/* ── 7天试用按钮 ── */}
        <button
          onClick={handleTrial}
          className="active:opacity-70 transition-opacity"
          style={{
            width: "100%",
            height: "52px",
            borderRadius: "14px",
            background: "#FFFFFF",
            border: "1.5px solid #E8E8E8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <span style={{ fontSize: "15px", color: "#3A3A3A" }}>
            先开启 7 天免费试用（标准版）
          </span>
        </button>
      </div>
    </div>
  );
}
