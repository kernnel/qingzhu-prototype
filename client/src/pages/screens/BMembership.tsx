// B端 3.4 会员购买页 (MembershipPage)
import { useState } from "react";
import { Check, Zap } from "lucide-react";
import { toast } from "sonner";

interface Props { onBack: () => void; onSuccess: () => void; }

const plans = [
  {
    id: "standard",
    name: "标准版",
    price: "¥99",
    period: "/年",
    perks: ["200张/日上传额度", "相册7天有效期", "基础数据统计", "微信分享链接"],
  },
  {
    id: "pro",
    name: "满足版",
    price: "¥599",
    period: "/年",
    perks: ["500张/日上传额度", "相册30天有效期", "高级数据统计", "微信分享链接", "优先客服支持", "批量管理工具"],
  },
];

export default function BMembership({ onBack, onSuccess }: Props) {
  const [selected, setSelected] = useState("pro");
  const [loading, setLoading] = useState(false);
  const plan = plans.find(p => p.id === selected)!;

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("开通成功！");
      setTimeout(onSuccess, 800);
    }, 1500);
  };

  return (
    <div style={{ background: "#f9fafb", minHeight: 700, paddingBottom: 100 }}>
      {/* Plan Cards */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>选择套餐</div>
        <div style={{ display: "flex", gap: 12 }}>
          {plans.map(p => (
            <button key={p.id} onClick={() => setSelected(p.id)}
              style={{ flex: 1, borderRadius: 16, padding: "16px 12px", border: `2px solid ${selected === p.id ? "#22c55e" : "#e5e7eb"}`, background: selected === p.id ? "#f0fdf4" : "#fff", textAlign: "left", cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: selected === p.id ? "#16a34a" : "#374151" }}>{p.price}</span>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>{p.period}</span>
              </div>
              {selected === p.id && (
                <div style={{ marginTop: 8, width: 20, height: 20, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={12} color="white" strokeWidth={3} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Perks */}
      <div style={{ margin: "16px 16px 0", background: "#fff", borderRadius: 16, padding: "16px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <Zap size={14} color="#22c55e" /> {plan.name}权益清单
        </div>
        {plan.perks.map(perk => (
          <div key={perk} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f9fafb" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Check size={10} color="#16a34a" strokeWidth={3} />
            </div>
            <span style={{ fontSize: 14, color: "#374151" }}>{perk}</span>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div style={{ position: "absolute", bottom: 34, left: 0, right: 0, padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {selected === "standard" && (
          <button style={{ background: "none", border: "none", color: "#22c55e", fontSize: 13, fontWeight: 600, textDecoration: "underline" }}>
            免费试用（一次性，不自动续费）
          </button>
        )}
        <button onClick={handlePay} disabled={loading}
          style={{ height: 52, borderRadius: 26, background: loading ? "#86efac" : "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", fontSize: 17, fontWeight: 700, border: "none", boxShadow: "0 8px 20px rgba(34,197,94,0.35)", fontFamily: "'Noto Sans SC', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {loading ? (
            <><svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" /></svg> 发起支付中...</>
          ) : `立即开通 ${plan.name}`}
        </button>
      </div>
    </div>
  );
}
