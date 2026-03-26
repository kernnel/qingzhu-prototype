import WechatStatusBar from "@/components/WechatStatusBar";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const GREEN = "#07C160";

function StatusBar() {
  return <WechatStatusBar />;
}

type Plan = "standard" | "pro";

const PLANS: Record<Plan, {
  name: string;
  price: string;
  period: string;
  features: { text: string }[];
  note: string;
}> = {
  standard: {
    name: "标准版",
    price: "¥99",
    period: "/年",
    features: [
      { text: "200 张/日上传额度" },
      { text: "相册 7 天有效期" },
      { text: "4K 原图无损下载" },
    ],
    note: "适合轻量使用的摄影师",
  },
  pro: {
    name: "满足版",
    price: "¥599",
    period: "/年",
    features: [
      { text: "500 张/日上传额度" },
      { text: "相册 30 天有效期" },
      { text: "4K 原图无损下载" },
    ],
    note: "高频交付的专业摄影师首选",
  },
};

export default function MembershipPage() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<Plan>("pro");
  const [loading, setLoading] = useState(false);
  const [showTrialSheet, setShowTrialSheet] = useState(false);

  const plan = PLANS[selected];

  const handlePurchase = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast(`🎉 ${plan.name}开通成功！`, { duration: 2500 });
      setTimeout(() => navigate("/user-center"), 800);
    }, 1400);
  };

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
        fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
      }}
    >
      <StatusBar />

      {/* 顶部导航 */}
      <div style={{ display: "flex", alignItems: "flex-start", padding: "6px 20px 0", flexShrink: 0 }}>
        <button
          onClick={() => navigate("/user-center")}
          className="active:opacity-50 transition-opacity"
          style={{ marginRight: "14px", paddingTop: "3px" }}
        >
          <svg width="11" height="18" viewBox="0 0 11 18" fill="none">
            <path d="M9 2L2 9L9 16" stroke="#1A1A1A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <div style={{ fontSize: "19px", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.2 }}>
            升级专业版
          </div>
          <div style={{ fontSize: "12px", color: "#9A9A9F", marginTop: "3px", fontWeight: 400 }}>
            为专业摄影师量身定制，极速交付每一张作品
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px 0" }}>

        {/* ── 横向双选卡片 ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>

          {/* 标准版 */}
          <button
            onClick={() => setSelected("standard")}
            className="active:scale-[0.97] transition-transform"
            style={{
              height: "104px",
              borderRadius: "18px",
              background: selected === "standard" ? "#1A1A1A" : "#FFFFFF",
              border: selected === "standard" ? "none" : "1.5px solid #EBEBEB",
              boxShadow: selected === "standard"
                ? "0 8px 28px rgba(0,0,0,0.22)"
                : "0 1px 6px rgba(0,0,0,0.05)",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "all 0.22s ease",
            }}
          >
            <span style={{
              fontSize: "12px",
              fontWeight: 500,
              color: selected === "standard" ? "rgba(255,255,255,0.55)" : "#9A9A9F",
            }}>
              标准版
            </span>
            <div>
              <span style={{
                fontSize: "26px",
                fontWeight: 800,
                color: selected === "standard" ? "#FFFFFF" : "#1A1A1A",
                fontFamily: "'DIN Alternate', 'SF Pro Display', sans-serif",
                letterSpacing: "-0.5px",
              }}>
                ¥99
              </span>
              <span style={{
                fontSize: "12px",
                color: selected === "standard" ? "rgba(255,255,255,0.4)" : "#9A9A9F",
                marginLeft: "2px",
              }}>
                /年
              </span>
            </div>
          </button>

          {/* 满足版 */}
          <button
            onClick={() => setSelected("pro")}
            className="active:scale-[0.97] transition-transform"
            style={{
              height: "104px",
              borderRadius: "18px",
              background: selected === "pro" ? "#1A1A1A" : "#FFFFFF",
              border: selected === "pro" ? "none" : "1.5px solid #EBEBEB",
              boxShadow: selected === "pro"
                ? "0 8px 28px rgba(0,0,0,0.22)"
                : "0 1px 6px rgba(0,0,0,0.05)",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "all 0.22s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <span style={{
                fontSize: "12px",
                fontWeight: 500,
                color: selected === "pro" ? "rgba(255,255,255,0.55)" : "#9A9A9F",
              }}>
                满足版
              </span>
              <span style={{
                fontSize: "10px",
                fontWeight: 600,
                color: selected === "pro" ? GREEN : "#9A9A9F",
                background: selected === "pro" ? "rgba(7,193,96,0.18)" : "rgba(0,0,0,0.05)",
                padding: "2px 7px",
                borderRadius: "999px",
              }}>
                最受欢迎
              </span>
            </div>
            <div>
              <span style={{
                fontSize: "26px",
                fontWeight: 800,
                color: selected === "pro" ? "#FFFFFF" : "#1A1A1A",
                fontFamily: "'DIN Alternate', 'SF Pro Display', sans-serif",
                letterSpacing: "-0.5px",
              }}>
                ¥599
              </span>
              <span style={{
                fontSize: "12px",
                color: selected === "pro" ? "rgba(255,255,255,0.4)" : "#9A9A9F",
                marginLeft: "2px",
              }}>
                /年
              </span>
            </div>
          </button>
        </div>

        {/* ── 动态权益清单 ── */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: "20px 20px 18px",
            boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
          }}
        >
          {/* 套餐名 + 备注 */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "16px" }}>
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#1A1A1A" }}>
              {plan.name}特权
            </span>
            <span style={{ fontSize: "11px", color: "#B0B0B0" }}>{plan.note}</span>
          </div>

          {/* 权益列表 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {plan.features.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "11px" }}>
                <div style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "rgba(7,193,96,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l2.5 2.5L9 1" stroke={GREEN} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontSize: "14px", color: "#2A2A2A", lineHeight: 1.4 }}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* 共有说明 */}
          <div style={{
            marginTop: "16px",
            paddingTop: "14px",
            borderTop: "0.5px solid #F0F0F0",
            fontSize: "12px",
            color: "#C0C0C0",
            lineHeight: 1.6,
          }}>
            所有版本均支持 4K 原图交付 · 专属分享链接 · 云端安全存储
          </div>
        </div>

        {/* 底部留白（给吸底栏留空间） */}
        <div style={{ height: "130px" }} />
      </div>

      {/* ── 吸底 CTA ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "0.5px solid rgba(0,0,0,0.07)",
          padding: "12px 16px 34px",
        }}
      >
        {/* 免费试用小字链接（仅标准版显示） */}
        {selected === "standard" && (
          <button
            onClick={() => setShowTrialSheet(true)}
            className="active:opacity-60 transition-opacity"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              width: "100%",
              marginBottom: "10px",
            }}
          >
            <span style={{ fontSize: "12px", color: "#9A9A9F" }}>
              🎁 首次开通可享 7 天标准版免费试用
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M3 2l4 3-4 3" stroke="#9A9A9F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* 全宽大按钮 */}
        <button
          onClick={handlePurchase}
          disabled={loading}
          className="active:opacity-85 transition-opacity"
          style={{
            width: "100%",
            height: "54px",
            borderRadius: "16px",
            background: loading ? "#A8D8BC" : GREEN,
            boxShadow: loading ? "none" : "0 6px 20px rgba(7,193,96,0.38)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s ease",
          }}
        >
          {loading ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="animate-spin">
                <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />
                <path d="M12 3a9 9 0 0 1 9 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF" }}>处理中...</span>
            </>
          ) : (
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.3px" }}>
              立即解锁 {plan.name}特权
            </span>
          )}
        </button>

        {/* 信任文字 */}
        <div style={{ textAlign: "center", marginTop: "8px" }}>
          <span style={{ fontSize: "11px", color: "#C8C8C8" }}>
            支付安全保障 · 支持随时取消续费
          </span>
        </div>
      </div>

      {/* ── 免费试用确认 Sheet ── */}
      {showTrialSheet && (
        <>
          <div
            onClick={() => setShowTrialSheet(false)}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 40,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0, left: 0, right: 0,
              background: "#FFFFFF",
              borderRadius: "20px 20px 0 0",
              padding: "24px 20px 40px",
              zIndex: 50,
            }}
          >
            {/* 把手 */}
            <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "#E0E0E0", margin: "0 auto 20px" }} />

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "20px", marginBottom: "8px" }}>🎁</div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#1A1A1A", marginBottom: "6px" }}>
                7 天免费试用
              </div>
              <div style={{ fontSize: "13px", color: "#6A6A6A", lineHeight: 1.6 }}>
                试用期间享有标准版全部权益<br />
                上传的照片同样保存 7 天
              </div>
            </div>

            {/* 权益回顾 */}
            <div style={{ background: "#F7F8FA", borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
              {PLANS.standard.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: i < PLANS.standard.features.length - 1 ? "8px" : 0 }}>
                  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                    <path d="M1 5.5l3.5 3.5L13 1" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontSize: "13px", color: "#3A3A3A" }}>{f.text}</span>
                </div>
              ))}
            </div>

            {/* 警告 */}
            <div style={{
              background: "rgba(255,77,79,0.06)",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <span style={{ fontSize: "13px" }}>⚠️</span>
              <span style={{ fontSize: "12px", color: "#FF4D4F" }}>
                免费试用为终身仅限 1 次，试用后不自动续费
              </span>
            </div>

            <button
              onClick={() => {
                setShowTrialSheet(false);
                setTimeout(() => {
                  toast("🎉 7 天免费试用已开启！", { duration: 2500 });
                  setTimeout(() => navigate("/user-center"), 800);
                }, 300);
              }}
              className="active:opacity-80 transition-opacity"
              style={{
                width: "100%",
                height: "52px",
                borderRadius: "14px",
                background: GREEN,
                boxShadow: "0 4px 16px rgba(7,193,96,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF" }}>确认开启免费试用</span>
            </button>

            <button
              onClick={() => setShowTrialSheet(false)}
              className="active:opacity-50 transition-opacity"
              style={{ width: "100%", marginTop: "12px", padding: "8px" }}
            >
              <span style={{ fontSize: "15px", color: "#9A9A9F" }}>取消</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
