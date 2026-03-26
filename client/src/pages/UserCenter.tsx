/**
 * 青竹快传 · 个人中心（极简版）
 * 设计语言：纯粹 · 无数据 · 极致留白
 *
 * 核心原则：
 * - 彻底删除所有数字、额度、进度条等业务数据
 * - 背景 #F7F8FA，卡片纯白，分组之间充足间距
 * - 图标统一线性 1.5px / #8A8A8A，右箭头极度弱化
 * - 唯一高光：品牌绿 #07C160 + 金色 PRO 徽章
 */

import { useState } from "react";
import { useLocation } from "wouter";

// ─────────────────────────────────────────────────────────────
// 统一线性图标库  线宽 1.5px · 颜色 #8A8A8A
// ─────────────────────────────────────────────────────────────
const S = { stroke: "#8A8A8A", strokeWidth: "1.5", fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function IcoOrder() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="3.5" y="2.5" width="13" height="15" rx="2.5" {...S} />
      <path d="M7 7h6M7 10.5h6M7 14h4" {...S} />
    </svg>
  );
}
function IcoFriend() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="8" cy="7" r="3" {...S} />
      <path d="M2 17c0-3.314 2.686-5 6-5s6 1.686 6 5" {...S} />
      <path d="M15 6v4M13 8h4" {...S} />
    </svg>
  );
}
function IcoSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3" {...S} />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41" {...S} />
    </svg>
  );
}
function IcoService() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M4 8a6 6 0 0 1 12 0v3" {...S} />
      <rect x="2.5" y="10.5" width="3" height="4.5" rx="1.5" {...S} />
      <rect x="14.5" y="10.5" width="3" height="4.5" rx="1.5" {...S} />
      <path d="M17.5 15v1a2 2 0 0 1-2 2h-2.5" {...S} />
    </svg>
  );
}
function IcoHelp() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" {...S} />
      <path d="M7.5 8a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" {...S} />
      <circle cx="10" cy="15" r="0.75" fill="#8A8A8A" />
    </svg>
  );
}

// 极度弱化的右箭头
function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <path d="M5.5 3.5L9 7l-3.5 3.5" stroke="#D8D8DD" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 菜单行：上下 padding 充足，保证呼吸感
// ─────────────────────────────────────────────────────────────
interface RowProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  isFirst?: boolean;
  isLast?: boolean;
  onClick?: () => void;
}

function Row({ icon, label, badge, isFirst, isLast, onClick }: RowProps) {
  const [pressed, setPressed] = useState(false);

  const r = isFirst && isLast ? "16px"
    : isFirst ? "16px 16px 0 0"
    : isLast ? "0 0 16px 16px"
    : "0";

  return (
    <button
      className="w-full flex items-center"
      style={{
        padding: "0 16px",
        minHeight: "56px",          // 充足行高
        background: pressed ? "#F5F6F8" : "#FFFFFF",
        borderRadius: r,
        borderBottom: isLast ? "none" : "0.5px solid rgba(0,0,0,0.06)",
        transition: "background 0.1s ease",
        textAlign: "left",
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={onClick}
    >
      {/* 图标 */}
      <span style={{ width: "22px", display: "flex", justifyContent: "center", flexShrink: 0, marginRight: "12px" }}>
        {icon}
      </span>

      {/* 文字 */}
      <span
        className="flex-1"
        style={{ fontSize: "15px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 400 }}
      >
        {label}
      </span>

      {/* 极弱角标 */}
      {badge && (
        <span
          style={{
            fontSize: "11px",
            color: "#07C160",
            background: "rgba(7,193,96,0.07)",
            padding: "2px 8px",
            borderRadius: "20px",
            marginRight: "8px",
            fontFamily: "'Noto Sans SC', sans-serif",
            fontWeight: 400,
            letterSpacing: "0.2px",
          }}
        >
          {badge}
        </span>
      )}

      <Chevron />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// 分组卡片容器
// ─────────────────────────────────────────────────────────────
function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      {/* 分组标题 */}
      <p
        style={{
          fontSize: "12px",
          color: "#9A9A9F",
          marginBottom: "6px",
          paddingLeft: "4px",
          fontFamily: "'Noto Sans SC', sans-serif",
          letterSpacing: "0.3px",
        }}
      >
        {label}
      </p>
      <div
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 1px 8px rgba(0,0,0,0.055)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 退出确认弹窗
// ─────────────────────────────────────────────────────────────
function LogoutSheet({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.36)" }}
      onClick={onClose}
    >
      <div className="mx-3 mb-3 rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div style={{ background: "rgba(249,249,249,0.97)", backdropFilter: "blur(20px)" }}>
          <div
            className="px-4 py-4 text-center"
            style={{ borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}
          >
            <p style={{ fontSize: "13px", color: "#8A8A8A", fontFamily: "'Noto Sans SC', sans-serif" }}>
              退出后需重新登录才能使用青竹快传
            </p>
          </div>
          <button
            className="w-full py-4 text-center"
            style={{ fontSize: "17px", color: "#FF4D4F", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 500 }}
            onClick={onConfirm}
          >
            退出登录
          </button>
        </div>
      </div>
      <div className="mx-3 mb-8 rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button
          className="w-full py-4 text-center"
          style={{
            background: "rgba(249,249,249,0.97)",
            backdropFilter: "blur(20px)",
            fontSize: "17px",
            color: "#007AFF",
            fontFamily: "'Noto Sans SC', sans-serif",
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

// ─────────────────────────────────────────────────────────────
// 主页面
// ─────────────────────────────────────────────────────────────
export default function UserCenter() {
  const [, navigate] = useLocation();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div
      style={{
        background: "#F7F8FA",
        fontFamily: "'Noto Sans SC', sans-serif",
        maxWidth: "390px",
        margin: "0 auto",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── 状态栏 ── */}
      <div
        className="flex justify-between items-center px-5 flex-shrink-0"
        style={{ paddingTop: "14px", paddingBottom: "4px" }}
      >
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#1C1C1E" }}>9:41</span>
        <div className="flex items-center gap-1.5">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
            <rect x="0" y="6" width="3" height="6" rx="0.8" fill="#1C1C1E" />
            <rect x="4.5" y="4" width="3" height="8" rx="0.8" fill="#1C1C1E" />
            <rect x="9" y="2" width="3" height="10" rx="0.8" fill="#1C1C1E" />
            <rect x="13.5" y="0" width="3" height="12" rx="0.8" fill="#1C1C1E" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M8 9.5C8.83 9.5 9.5 10.17 9.5 11S8.83 12.5 8 12.5 6.5 11.83 6.5 11 7.17 9.5 8 9.5Z" fill="#1C1C1E" />
            <path d="M4.5 7.5C5.6 6.4 7.2 5.7 8 5.7s2.4.7 3.5 1.8" stroke="#1C1C1E" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M2 5C3.8 3.2 5.8 2.2 8 2.2s4.2 1 6 2.8" stroke="#1C1C1E" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <div className="flex items-center gap-0.5">
            <div className="w-[22px] h-[11px] rounded-[2.5px] border border-[#1C1C1E]/50 relative">
              <div className="absolute inset-[1.5px] right-[3px] bg-[#1C1C1E] rounded-[1.5px]" />
            </div>
            <div className="w-[1.5px] h-[5px] bg-[#1C1C1E]/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* ── 可滚动内容区 ── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: "0 16px 48px" }}
      >

        {/* ════════════════════════════════
            1. 身份确认区（可点击进入编辑资料）
        ════════════════════════════════ */}
        <button
          className="flex flex-col items-center w-full active:opacity-75 transition-opacity"
          style={{ paddingTop: "36px", paddingBottom: "40px" }}
          onClick={() => navigate("/profile-edit")}
        >
          {/* 头像：无光晕，干净深色，右下角编辑角标 */}
          <div style={{ position: "relative", width: "72px", height: "72px", flexShrink: 0 }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "linear-gradient(145deg, #3D3D3D 0%, #1C1C1E 100%)",
                boxShadow: "0 4px 18px rgba(0,0,0,0.13)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="15" r="7" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                <path d="M5 36c0-8.284 6.716-12 15-12s15 3.716 15 12"
                  stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            {/* 编辑角标 */}
            <div
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "#FFFFFF",
                boxShadow: "0 1px 5px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                <path d="M9.5 1.5a1.5 1.5 0 0 1 2.12 2.12L4 11.24l-2.5.5.5-2.5L9.5 1.5Z"
                  stroke="#1A1A1A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* 姓名 + PRO 徽章 */}
          <div className="flex items-center gap-2 mt-4">
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#1A1A1A",
                letterSpacing: "-0.4px",
                fontFamily: "'Noto Sans SC', sans-serif",
              }}
            >
              陈墨熙
            </h1>
            {/* 精致金色 PRO 徽章 */}
            <div
              style={{
                background: "#1A1A1A",
                borderRadius: "6px",
                padding: "2px 7px",
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path d="M5 1l1 2.5L9 4 7 6l.5 3L5 7.5 2.5 9 3 6 1 4l3-.5L5 1Z"
                  fill="#C9A227" />
              </svg>
              <span style={{ fontSize: "11px", color: "#C9A227", fontWeight: 700, letterSpacing: "0.5px" }}>
                PRO
              </span>
            </div>
          </div>

          {/* 点击提示 */}
          <p style={{ fontSize: "12px", color: "#B0B0B0", marginTop: "6px", fontFamily: "'Noto Sans SC', sans-serif" }}>
            点击编辑资料
          </p>
        </button>

        {/* ════════════════════════════════
            2. 业务与资产 分组
        ════════════════════════════════ */}
        <Group label="业务与资产">
          <Row
            icon={<IcoOrder />}
            label="订单记录"
            isFirst
            onClick={() => navigate("/orders")}
          />
          <Row
            icon={<IcoFriend />}
            label="推荐朋友"
             badge="收益中"
             isLast
             onClick={() => navigate("/refer-friend")}
          />
        </Group>

        {/* 分组间距 */}
        <div style={{ height: "24px" }} />

        {/* ════════════════════════════════
            3. 系统与支持 分组
        ════════════════════════════════ */}
        <Group label="系统与支持">
          <Row
            icon={<IcoSettings />}
            label="设置"
            isFirst
            onClick={() => navigate("/settings")}
          />
          <Row
            icon={<IcoService />}
            label="联系客服"
            onClick={() => {}}
          />
          <Row
            icon={<IcoHelp />}
            label="帮助与反馈"
            isLast
            onClick={() => {}}
          />
        </Group>

        {/* 分组间距 */}
        <div style={{ height: "24px" }} />

        {/* ════════════════════════════════
            4. 退出登录
        ════════════════════════════════ */}
        <div
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 1px 8px rgba(0,0,0,0.055)",
          }}
        >
          <button
            className="w-full flex items-center justify-center"
            style={{
              minHeight: "56px",
              background: "#FFFFFF",
              fontSize: "15px",
              color: "#FF4D4F",
              fontFamily: "'Noto Sans SC', sans-serif",
              fontWeight: 400,
              transition: "background 0.1s ease",
            }}
            onPointerDown={(e) => (e.currentTarget.style.background = "#FFF5F5")}
            onPointerUp={(e) => (e.currentTarget.style.background = "#FFFFFF")}
            onPointerLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
            onClick={() => setShowLogout(true)}
          >
            退出登录
          </button>
        </div>

        {/* 版本号 */}
        <p
          className="text-center"
          style={{ marginTop: "32px", fontSize: "12px", color: "#C7C7CC", fontFamily: "'Noto Sans SC', sans-serif" }}
        >
          青竹快传 v1.2.0
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
