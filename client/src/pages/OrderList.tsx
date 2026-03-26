import WechatStatusBar from "@/components/WechatStatusBar";
import { useLocation } from "wouter";

function StatusBar() {
  return <WechatStatusBar />;
}

type OrderStatus = "paid" | "pending" | "refunded";

interface Order {
  id: string;
  orderNo: string;
  createdAt: string;
  amount: number;
  planName: string;
  status: OrderStatus;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  paid:     { label: "已完成", color: "#07C160", bg: "rgba(7,193,96,0.08)" },
  pending:  { label: "待支付", color: "#FF9500", bg: "rgba(255,149,0,0.08)" },
  refunded: { label: "已退款", color: "#9A9A9F", bg: "rgba(0,0,0,0.05)" },
};

const ORDERS: Order[] = [
  {
    id: "1",
    orderNo: "QZ20260318001",
    createdAt: "2026.03.18 14:32",
    amount: 599,
    planName: "满足版会员 · 年度",
    status: "paid",
  },
  {
    id: "2",
    orderNo: "QZ20260101002",
    createdAt: "2026.01.01 09:15",
    amount: 99,
    planName: "标准版会员 · 年度",
    status: "refunded",
  },
];

export default function OrderList() {
  const [, navigate] = useLocation();

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "6px 20px 14px",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => navigate("/user-center")}
          className="active:opacity-50 transition-opacity"
          style={{ marginRight: "16px" }}
        >
          <svg width="11" height="18" viewBox="0 0 11 18" fill="none">
            <path d="M9 2L2 9L9 16" stroke="#1A1A1A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span style={{ fontSize: "17px", fontWeight: 600, color: "#1A1A1A" }}>
          订单记录
        </span>
      </div>

      {/* 内容区 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 16px 32px" }}>
        {ORDERS.length === 0 ? (
          /* 空状态 */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60%",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "20px",
                background: "#EFEFEF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="6" y="4" width="20" height="24" rx="3" stroke="#C0C0C0" strokeWidth="1.8" />
                <path d="M11 11h10M11 16h10M11 21h6" stroke="#C0C0C0" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontSize: "15px", color: "#B0B0B0", fontWeight: 400 }}>
              暂无订单记录
            </span>
          </div>
        ) : (
          /* 订单卡片列表 */
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {ORDERS.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status];
              return (
                <div
                  key={order.id}
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "18px 18px 16px",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* 顶行：套餐名 + 状态标签 */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "14px",
                    }}
                  >
                    <span style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>
                      {order.planName}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: statusCfg.color,
                        background: statusCfg.bg,
                        padding: "3px 10px",
                        borderRadius: "999px",
                        flexShrink: 0,
                        marginLeft: "8px",
                      }}
                    >
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* 分割线 */}
                  <div style={{ height: "0.5px", background: "#F0F0F0", marginBottom: "14px" }} />

                  {/* 信息行 */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {/* 订单号 */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "13px", color: "#9A9A9F" }}>订单号</span>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#4A4A4A",
                          fontFamily: "'DIN Alternate', monospace",
                          letterSpacing: "0.3px",
                        }}
                      >
                        {order.orderNo}
                      </span>
                    </div>
                    {/* 创建时间 */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "13px", color: "#9A9A9F" }}>创建时间</span>
                      <span style={{ fontSize: "13px", color: "#4A4A4A" }}>{order.createdAt}</span>
                    </div>
                    {/* 金额 */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "13px", color: "#9A9A9F" }}>实付金额</span>
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#1A1A1A",
                          fontFamily: "'DIN Alternate', 'SF Pro Display', sans-serif",
                        }}
                      >
                        ¥{order.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
