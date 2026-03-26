import WechatStatusBar from "@/components/WechatStatusBar";
import { useState } from "react";
import { useLocation } from "wouter";

// ─────────────────────────────────────
// 图标
// ─────────────────────────────────────
function IconChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke="#C7C7CC" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─────────────────────────────────────
// 单行菜单
// ─────────────────────────────────────
interface MenuRowProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value?: string;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  danger?: boolean;
}

function MenuRow({
  icon, iconBg, iconColor, label, value, badge, badgeColor,
  onClick, isFirst, isLast, danger,
}: MenuRowProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      className="w-full flex items-center px-4 transition-colors"
      style={{
        height: "54px",
        background: pressed ? "#F5F5F5" : "#FFFFFF",
        borderRadius: isFirst && isLast ? "16px"
          : isFirst ? "16px 16px 0 0"
          : isLast ? "0 0 16px 16px"
          : "0",
        borderBottom: isLast ? "none" : "0.5px solid rgba(0,0,0,0.06)",
        transition: "background 0.12s ease",
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={onClick}
    >
      <div
        className="flex items-center justify-center flex-shrink-0 mr-3"
        style={{ width: "32px", height: "32px", borderRadius: "8px", background: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <span
        className="flex-1 text-left"
        style={{
          fontSize: "15px",
          color: danger ? "#FF3B30" : "#1A1A1A",
          fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
          fontWeight: 400,
        }}
      >
        {label}
      </span>
      {value && (
        <span style={{ fontSize: "14px", color: "#8A8A8A", marginRight: "6px", fontFamily: "'PingFang SC', sans-serif" }}>
          {value}
        </span>
      )}
      {badge && (
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded-full mr-2"
          style={{ background: badgeColor || "#07C160", color: "#fff" }}
        >
          {badge}
        </span>
      )}
      <IconChevron />
    </button>
  );
}

function MenuGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden" style={{ borderRadius: "16px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────
// 退出确认弹窗
// ─────────────────────────────────────
function LogoutSheet({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div className="mx-3 mb-3" style={{ borderRadius: "16px", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ background: "rgba(250,250,250,0.97)", backdropFilter: "blur(20px)" }}>
          <div className="px-4 py-4 text-center" style={{ borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "13px", color: "#8A8A8A", fontFamily: "'PingFang SC', sans-serif" }}>
              退出后需重新登录才能使用青竹快传
            </p>
          </div>
          <button
            className="w-full py-4 text-center"
            style={{ fontSize: "17px", color: "#FF3B30", fontFamily: "'PingFang SC', sans-serif", fontWeight: 500 }}
            onClick={onConfirm}
          >
            退出登录
          </button>
        </div>
      </div>
      <div className="mx-3 mb-8" style={{ borderRadius: "16px", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
        <button
          className="w-full py-4 text-center"
          style={{
            background: "rgba(250,250,250,0.97)",
            backdropFilter: "blur(20px)",
            fontSize: "17px",
            color: "#007AFF",
            fontFamily: "'PingFang SC', sans-serif",
            fontWeight: 600,
          }}
          onClick={onClose}
        >
          取消
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// 主页面
// ─────────────────────────────────────
export default function SettingsPage() {
  const [, navigate] = useLocation();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div
      style={{
        width: "390px",
        height: "844px",
        margin: "0 auto",
        background: "#F2F2F7",
        fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* 状态栏 */}
      <WechatStatusBar />

      {/* 顶部导航 */}
      <div
        className="flex items-center px-4 flex-shrink-0"
        style={{ paddingBottom: "12px" }}
      >
        <button
          className="flex items-center justify-center mr-3"
          style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(0,0,0,0.06)" }}
          onClick={() => navigate("/user-center")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8l4 4" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#1A1A1A" }}>账号与设置</h1>
      </div>

      {/* 内容区（固定高度，不滚动） */}
      <div className="flex-1 px-4" style={{ paddingBottom: "24px", display: "flex", flexDirection: "column", gap: "0" }}>

        {/* 用户信息卡片 */}
        <div
          className="flex items-center px-4 mb-5"
          style={{
            height: "76px",
            background: "#FFFFFF",
            borderRadius: "16px",
            boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
            cursor: "pointer",
          }}
          onClick={() => navigate("/profile-edit")}
        >
          <div
            className="flex-shrink-0 mr-3 overflow-hidden"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3A3A3A 0%, #1A1A1A 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="12" r="6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              <path d="M4 28c0-6.627 5.373-10 12-10s12 3.373 12 10" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#1A1A1A" }}>陈墨熙</span>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: "linear-gradient(90deg,#C9A227,#E8C84A)", color: "#fff" }}
              >
                标准版
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "#8A8A8A", marginTop: "2px" }}>点击编辑个人资料</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="#C7C7CC" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* 统一菜单列表（不分组） */}
        <MenuGroup>
          <MenuRow
            icon={
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 17c0-3.866 3.134-6 7-6s7 2.134 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
            iconBg="transparent"
            iconColor="#8A8A8E"
            label="个人资料"
            onClick={() => navigate("/profile-edit")}
            isFirst
          />
          <MenuRow
            icon={
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="2" width="14" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 7h6M7 10.5h6M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
            iconBg="transparent"
            iconColor="#8A8A8E"
            label="订单记录"
            onClick={() => navigate("/orders")}
          />
          <MenuRow
            icon={
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.4l-4.8 2.5.9-5.4L2.2 7.7l5.4-.8L10 2Z"
                  stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            }
            iconBg="transparent"
            iconColor="#8A8A8E"
            label="推荐朋友"
            onClick={() => navigate("/refer-friend")}
          />
          <MenuRow
            icon={
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M17 13.5c0 .4-.1.8-.3 1.2-.2.4-.4.7-.8.9-.5.3-1 .4-1.6.4-.8 0-1.7-.2-2.5-.7L5.7 9.2C5.2 8.4 5 7.5 5 6.7c0-.6.1-1.1.4-1.6.2-.4.5-.6.9-.8.4-.2.8-.3 1.2-.3.2 0 .4 0 .5.1.2.1.3.2.4.4l1.6 2.4c.1.2.2.3.2.5 0 .2-.1.4-.2.5L9 8.5c0 .1-.1.1-.1.2 0 .1 0 .2.1.3l1.9 1.9c.1.1.2.1.3.1.1 0 .2 0 .2-.1l.5-.5c.2-.2.3-.2.5-.2.2 0 .4.1.5.2l2.4 1.6c.2.1.3.3.4.4.1.2.1.4.1.5Z"
                  stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            }
            iconBg="transparent"
            iconColor="#8A8A8E"
            label="联系客服"
            onClick={() => {}}
          />
          <MenuRow
            icon={
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.22 3.22l1.42 1.42M15.36 15.36l1.42 1.42M3.22 16.78l1.42-1.42M15.36 4.64l1.42-1.42"
                  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            }
            iconBg="transparent"
            iconColor="#8A8A8E"
            label="设置"
            onClick={() => navigate("/app-settings")}
          />
          <MenuRow
            icon={
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="3" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 8h8M6 11.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            }
            iconBg="transparent"
            iconColor="#8A8A8E"
            label="用户协议"
            onClick={() => {}}
          />
          <MenuRow
            icon={
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 9v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="10" cy="6.5" r="0.8" fill="currentColor" />
              </svg>
            }
            iconBg="transparent"
            iconColor="#8A8A8E"
            label="隐身条款"
            isLast
            onClick={() => {}}
          />
        </MenuGroup>

        {/* 退出登录 */}
        <div style={{ marginTop: "16px" }}>
          <MenuGroup>
            <MenuRow
              icon={
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M7 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3" stroke="#FF3B30" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M13 14l3-4-3-4M16 10H8" stroke="#FF3B30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              iconBg="rgba(255,59,48,0.08)"
              iconColor="#FF3B30"
              label="退出登录"
              danger
              isFirst
              isLast
              onClick={() => setShowLogout(true)}
            />
          </MenuGroup>
        </div>

        {/* 版本号 */}
        <p className="text-center" style={{ fontSize: "12px", color: "#C7C7CC", marginTop: "auto", paddingTop: "20px" }}>
          青竹快传 · v1.2.0 · © 2026
        </p>
      </div>

      {/* 退出确认弹窗 */}
      {showLogout && (
        <LogoutSheet
          onClose={() => setShowLogout(false)}
          onConfirm={() => navigate("/")}
        />
      )}
    </div>
  );
}
