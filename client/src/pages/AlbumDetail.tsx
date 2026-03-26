import WechatStatusBar from "@/components/WechatStatusBar";
/**
 * 青竹快传 · 相册管理页 v4
 * 设计风格：竹光通透 · 沉浸封面 · 沉底中控流
 *
 * 1. 顶部封面区（屏幕高度约25%，21:9扁比例）：标题+设置icon+数据悬浮在封面左下角
 * 2. 白色圆角卡片（16px圆角顶部）向上覆盖封面底部边缘，内含日期分组+4列直角网格
 * 3. 底部默认态：左侧「编辑」文字按钮 + 右侧「添加照片」浅色胶囊 + 「一键分享交片」绿色胶囊
 * 4. 编辑模式：顶部导航变「取消/已选X项/全选」，网格勾选态，底部工具栏「下载|设为封面|删除」
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

// ── 上传状态类型 ──
type UploadStatus = "idle" | "uploading" | "done";

// ─────────────────────────────────────
// 定价方案选择弹窗 —「选择照片上传」按钮触发
// ─────────────────────────────────────
function ProUpgradeModal({ visible, onClose, onConfirm }: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!visible) return null;

  const CheckIcon = ({ active }: { active?: boolean }) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 7L5.5 10.5L12 3" stroke={active ? "#07C160" : "#BBBBBB"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div
      className="absolute inset-0 z-[80] flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col"
        style={{
          width: "340px",
          background: "#FFFFFF",
          borderRadius: "12px",
          padding: "28px 20px 20px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
          animation: "modalIn 0.32s cubic-bezier(0.34,1.56,0.64,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute flex items-center justify-center active:opacity-50 transition-opacity"
          style={{ top: "14px", right: "14px", width: "30px", height: "30px", borderRadius: "50%", background: "#F2F2F2" }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2L2 10" stroke="#8A8A8A" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>

        {/* 标题 */}
        <p className="text-center font-bold" style={{ fontSize: "19px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", marginBottom: "20px" }}>
          选择适合您的专业方案
        </p>

        {/* 两列方案卡片 */}
        <div className="flex gap-1.5" style={{ marginBottom: "12px" }}>
          {/* 标准版 */}
          <div className="flex flex-col flex-1" style={{ border: "1.5px solid #E8E8E8", borderRadius: "9px", padding: "16px 14px 14px" }}>
            <span style={{ fontSize: "14px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 500, marginBottom: "8px" }}>标准版</span>
            <div className="flex items-baseline" style={{ marginBottom: "14px" }}>
              <span style={{ fontSize: "13px", color: "#1A1A1A", fontWeight: 700 }}>¥</span>
              <span style={{ fontSize: "36px", color: "#1A1A1A", fontWeight: 900, lineHeight: 1, fontFamily: "'Noto Sans SC', sans-serif" }}>99</span>
              <span style={{ fontSize: "12px", color: "#8A8A8A", marginLeft: "2px" }}>/年</span>
            </div>
            <div className="flex flex-col gap-2" style={{ marginBottom: "16px" }}>
              {["每日 200 张照片", "7 天保存", "高清交付"].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckIcon active={false} />
                  <span style={{ fontSize: "12px", color: "#8A8A8A", fontFamily: "'Noto Sans SC', sans-serif" }}>{item}</span>
                </div>
              ))}
            </div>
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center active:opacity-80 transition-opacity"
              style={{ height: "42px", borderRadius: "8px", background: "#E6F9F0", border: "none" }}
            >
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#07C160", fontFamily: "'Noto Sans SC', sans-serif" }}>购买标准版</span>
            </button>
          </div>

          {/* 满足版 */}
          <div className="flex flex-col flex-1" style={{ border: "1.5px solid #E8E8E8", borderRadius: "9px", padding: "16px 14px 14px" }}>
            <div className="flex items-center gap-1" style={{ marginBottom: "8px" }}>
              <span style={{ fontSize: "16px" }}>🔥</span>
              <span style={{ fontSize: "14px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 500 }}>满足版</span>
            </div>
            <div className="flex items-baseline" style={{ marginBottom: "14px" }}>
              <span style={{ fontSize: "13px", color: "#1A1A1A", fontWeight: 700 }}>¥</span>
              <span style={{ fontSize: "36px", color: "#1A1A1A", fontWeight: 900, lineHeight: 1, fontFamily: "'Noto Sans SC', sans-serif" }}>599</span>
              <span style={{ fontSize: "12px", color: "#8A8A8A", marginLeft: "2px" }}>/年</span>
            </div>
            <div className="flex flex-col gap-2" style={{ marginBottom: "16px" }}>
              {["每日 500 张照片", "30 天保存", "原图交付"].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckIcon active={true} />
                  <span style={{ fontSize: "12px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
            <button
              onClick={onConfirm}
              className="w-full flex items-center justify-center active:opacity-80 transition-opacity"
              style={{ height: "42px", borderRadius: "8px", background: "#07C160", border: "none" }}
            >
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", fontFamily: "'Noto Sans SC', sans-serif" }}>购买满足版</span>
            </button>
          </div>
        </div>

        {/* 底部免费试用按钮 */}
        <button
          onClick={onConfirm}
          className="w-full flex items-center justify-center active:opacity-80 transition-opacity"
          style={{ height: "34px", borderRadius: "8px", background: "#FFFFFF", border: "1.5px solid #E8E8E8" }}
        >
          <span style={{ fontSize: "12px", color: "#8A8A8A", fontFamily: "'Noto Sans SC', sans-serif" }}>先开启 7 天免费试用（标准版）</span>
        </button>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────
// 上传限额两步走弹窗 —「继续上传」按钮触发
// Step 1: 极简阻断弹窗  |  Step 2: 底部升起权益引导 Sheet
// ─────────────────────────────────────
function UploadLimitModal({ visible, onClose, onConfirm }: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);

  // 每次弹窗打开时重置到 Step 1
  useEffect(() => {
    if (visible) setStep(1);
  }, [visible]);

  if (!visible) return null;

  const overlayStyle: React.CSSProperties = {
    background: "rgba(0,0,0,0.50)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  };

  // ─────────────────────────────────────
  // Step 1: 极简阻断弹窗（参考截图1）
  // ─────────────────────────────────────
  if (step === 1) {
    return (
      <div
        className="absolute inset-0 z-[80] flex items-center justify-center"
        style={overlayStyle}
        onClick={onClose}
      >
        <div
          className="relative flex flex-col items-center"
          style={{
            width: "280px",
            background: "#FFFFFF",
            borderRadius: "28px",
            padding: "36px 24px 24px",
            boxShadow: "0 20px 56px rgba(0,0,0,0.14)",
            animation: "limitModalIn 0.28s cubic-bezier(0.34,1.4,0.64,1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 水杯容量满图标 */}
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "18px",
              background: "#F2F2F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "22px",
            }}
          >
            {/* 水杯 SVG：宽口杯形，底部充满，中部有分界线 */}
            <svg width="32" height="38" viewBox="0 0 32 38" fill="none">
              {/* 杯身轮廓：上宽下窄的梯形 */}
              <path
                d="M4 6 L6 34 Q6 36 8 36 L24 36 Q26 36 26 34 L28 6 Z"
                stroke="#AAAAAA"
                strokeWidth="1.8"
                strokeLinejoin="round"
                fill="none"
              />
              {/* 杯口横线 */}
              <line x1="3" y1="6" x2="29" y2="6" stroke="#AAAAAA" strokeWidth="1.8" strokeLinecap="round"/>
              {/* 充满内容（占杯子下半部分） */}
              <path
                d="M8.2 20 L9.8 34 Q9.8 35 11 35 L21 35 Q22.2 35 22.2 34 L23.8 20 Z"
                fill="#CCCCCC"
              />
              {/* 分界虚线 */}
              <line x1="7.5" y1="20" x2="24.5" y2="20" stroke="#AAAAAA" strokeWidth="1.2" strokeDasharray="2.5 2"/>
            </svg>
          </div>

          {/* 主标题 */}
          <p
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#1A1A1A",
              fontFamily: "'Noto Sans SC', sans-serif",
              letterSpacing: "-0.3px",
              lineHeight: "1.3",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            今日上传额度已满
          </p>

          {/* 副标题 */}
          <p
            style={{
              fontSize: "13px",
              color: "#8A8A8A",
              fontFamily: "'Noto Sans SC', sans-serif",
              lineHeight: "1.8",
              marginBottom: "28px",
              textAlign: "center",
            }}
          >
            当前标准版限传 200 张/日，<br/>请明日再试，或升级解锁更大额度。
          </p>

          {/* 左右双按钮 */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center active:opacity-70 transition-opacity"
              style={{
                height: "50px",
                borderRadius: "14px",
                background: "#F2F2F2",
                border: "none",
              }}
            >
              <span style={{ fontSize: "15px", fontWeight: 500, color: "#555555", fontFamily: "'Noto Sans SC', sans-serif" }}>
                我知道了
              </span>
            </button>
            <button
              onClick={() => setStep(2)}
              className="flex-1 flex items-center justify-center active:opacity-90 transition-opacity"
              style={{
                height: "50px",
                borderRadius: "14px",
                background: "#07C160",
                border: "none",
                boxShadow: "0 4px 16px rgba(7,193,96,0.38)",
              }}
            >
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF", fontFamily: "'Noto Sans SC', sans-serif" }}>
                升级满足版
              </span>
            </button>
          </div>
        </div>

        <style>{`
          @keyframes limitModalIn {
            from { opacity: 0; transform: scale(0.93) translateY(10px); }
            to   { opacity: 1; transform: scale(1)   translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // ─────────────────────────────────────
  // Step 2: 底部升起 Sheet — 升级尊享权益（参考截图2）
  // ─────────────────────────────────────
  const benefits = [
    {
      icon: (
        // 云+上传箭头图标
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M22 18H8a5 5 0 1 1 1.02-9.9A7 7 0 0 1 22 13a4 4 0 0 1 0 5Z" stroke="#555" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
          <path d="M14 22v-6M11.5 18.5l2.5-2.5 2.5 2.5" stroke="#555" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "单日 500 张超大上传额度",
      desc: "是标准版的 2.5 倍，轻松应对大型拍摄",
    },
    {
      icon: (
        // 时钟图标
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="9" stroke="#555" strokeWidth="1.6" fill="none"/>
          <path d="M14 9v5l3 3" stroke="#555" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "30 天长效保存期限",
      desc: "标准版仅 7 天，满足版延长至 30 天",
    },
    {
      icon: (
        // 图片/原图图标
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="4" y="6" width="20" height="16" rx="3" stroke="#555" strokeWidth="1.6" fill="none"/>
          <circle cx="10" cy="12" r="2" stroke="#555" strokeWidth="1.4" fill="none"/>
          <path d="M4 19l5-4 4 3 3-2.5 8 5.5" stroke="#555" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "4K / 原图无损交付",
      desc: "每一张照片保留完整像素与色彩信息",
    },
  ];

  return (
    <div
      className="absolute inset-0 z-[80] flex items-end justify-center"
      style={overlayStyle}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full"
        style={{
          background: "#F2F2F2",
          borderRadius: "28px 28px 0 0",
          padding: "12px 16px 32px",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.16)",
          animation: "sheetUp 0.32s cubic-bezier(0.32,0.72,0,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 拖条 */}
        <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "#CCCCCC", margin: "0 auto 16px" }} />

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute flex items-center justify-center active:opacity-50 transition-opacity"
          style={{ top: "16px", right: "16px", width: "30px", height: "30px", borderRadius: "50%", background: "#E4E4E4" }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2L2 10" stroke="#888" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>

        {/* 标题 */}
        <p
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#1A1A1A",
            fontFamily: "'Noto Sans SC', sans-serif",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          升级尊享权益
        </p>

        {/* 权益列表 */}
        <div className="flex flex-col gap-3" style={{ marginBottom: "20px" }}>
          {benefits.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-4"
              style={{
                background: "#FFFFFF",
                borderRadius: "16px",
                padding: "16px 18px",
              }}
            >
              <div style={{ flexShrink: 0, width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {b.icon}
              </div>
              <div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", marginBottom: "3px" }}>
                  {b.title}
                </p>
                <p style={{ fontSize: "12px", color: "#8A8A8A", fontFamily: "'Noto Sans SC', sans-serif", lineHeight: "1.5" }}>
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 立即升级按钮 */}
        <button
          onClick={onConfirm}
          className="w-full flex items-center justify-center active:opacity-90 transition-opacity"
          style={{
            height: "54px",
            borderRadius: "16px",
            background: "#07C160",
            border: "none",
            boxShadow: "0 4px 18px rgba(7,193,96,0.38)",
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF", fontFamily: "'Noto Sans SC', sans-serif", letterSpacing: "0.02em" }}>
            立即升级 ¥599/年
          </span>
        </button>
      </div>

      <style>{`
        @keyframes limitModalIn {
          from { opacity: 0; transform: scale(0.93) translateY(10px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
        @keyframes sheetUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const TODAY = "3月23日 星期日";
const UPLOAD_PHOTOS = [
  { id: 101, bg: "#D8EDD4", date: TODAY }, { id: 102, bg: "#C3DFBE", date: TODAY },
  { id: 103, bg: "#E2F0DE", date: TODAY }, { id: 104, bg: "#BBDAB5", date: TODAY },
  { id: 105, bg: "#CDE8C8", date: TODAY }, { id: 106, bg: "#D4EBD0", date: TODAY },
  { id: 107, bg: "#C8E3C3", date: TODAY }, { id: 108, bg: "#E6F2E3", date: TODAY },
  { id: 109, bg: "#BFD9BA", date: TODAY }, { id: 110, bg: "#D0E9CB", date: TODAY },
  { id: 111, bg: "#C5E0C0", date: TODAY }, { id: 112, bg: "#DAECD6", date: TODAY },
  { id: 113, bg: "#D8EDD4", date: TODAY }, { id: 114, bg: "#C3DFBE", date: TODAY },
  { id: 115, bg: "#E2F0DE", date: TODAY }, { id: 116, bg: "#BBDAB5", date: TODAY },
  { id: 117, bg: "#CDE8C8", date: TODAY }, { id: 118, bg: "#D4EBD0", date: TODAY },
  { id: 119, bg: "#C8E3C3", date: TODAY }, { id: 120, bg: "#E6F2E3", date: TODAY },
];

// ── 单张环形进度条组件 ──
function CircleProgress({ progress }: { progress: number }) {
  const r = 10;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="14" cy="14" r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
      <circle
        cx="14" cy="14" r={r} fill="none"
        stroke="#07C160" strokeWidth="2.5"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.35s ease" }}
      />
    </svg>
  );
}

function generateAlbumName() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}${m}${d} 相册`;
}

const MOCK_PHOTOS = [
  { id: 1, bg: "#D8EDD4", date: "3月23日 星期日" },
  { id: 2, bg: "#C3DFBE", date: "3月23日 星期日" },
  { id: 3, bg: "#E2F0DE", date: "3月23日 星期日" },
  { id: 4, bg: "#BBDAB5", date: "3月23日 星期日" },
  { id: 5, bg: "#CDE8C8", date: "3月23日 星期日" },
  { id: 6, bg: "#D4EBD0", date: "3月23日 星期日" },
  { id: 7, bg: "#C8E3C3", date: "3月22日 星期六" },
  { id: 8, bg: "#E6F2E3", date: "3月22日 星期六" },
  { id: 9, bg: "#BFD9BA", date: "3月22日 星期六" },
  { id: 10, bg: "#D0E9CB", date: "3月22日 星期六" },
  { id: 11, bg: "#C5E0C0", date: "3月22日 星期六" },
  { id: 12, bg: "#DAECD6", date: "3月22日 星期六" },
];

const COVER_IMAGE = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";

// 按日期分组
function groupByDate(photos: typeof MOCK_PHOTOS) {
  const groups: { date: string; items: typeof MOCK_PHOTOS }[] = [];
  photos.forEach((p) => {
    const last = groups[groups.length - 1];
    if (last && last.date === p.date) {
      last.items.push(p);
    } else {
      groups.push({ date: p.date, items: [p] });
    }
  });
  return groups;
}

// ── 设置弹出表单组件 ──
function SettingsSheet({
  albumName,
  onClose,
  onSave,
}: {
  albumName: string;
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const [name, setName] = useState(albumName);
  return (
    <>
      {/* 遮罩 */}
      <div
        className="absolute inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.45)" }}
        onClick={onClose}
      />
      {/* 半框面板 */}
      <div
        className="absolute bottom-0 left-0 right-0 z-50 flex flex-col"
        style={{ background: "#FFFFFF", borderRadius: "20px 20px 0 0", paddingBottom: "34px" }}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-[36px] h-[4px] rounded-full bg-[#E0E0E0]" />
        </div>
        <div className="flex items-center justify-between px-5 pb-4 pt-1" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <button onClick={onClose} className="text-[15px] text-[#8A8A8A] active:opacity-60" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>取消</button>
          <span className="text-[16px] font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>相册设置</span>
          <button onClick={() => { onSave(name); onClose(); }} className="text-[15px] font-semibold active:opacity-60" style={{ color: "#07C160", fontFamily: "'Noto Sans SC', sans-serif" }}>保存</button>
        </div>
        <div className="px-5 pt-5">
          <div>
            <label className="block text-[12px] text-[#8A8A8A] mb-2" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>相册名称</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-[15px] text-[#1A1A1A] outline-none px-4"
              style={{ height: "48px", borderRadius: "12px", background: "#F7F7F7", fontFamily: "'Noto Sans SC', sans-serif", border: "1.5px solid transparent" }}
              onFocus={(e) => (e.currentTarget.style.border = "1.5px solid #07C160")}
              onBlur={(e) => (e.currentTarget.style.border = "1.5px solid transparent")}
              placeholder="输入相册名称"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function StatusBar({ light = false, leftSlot }: { light?: boolean; leftSlot?: React.ReactNode }) {
  return <WechatStatusBar light={light} leftSlot={leftSlot} />;
}

// ── 全屏图片预览组件 ──
// EXIF 模拟数据
const EXIF_DATA = [
  { label: "文件名", value: "DSC_0847.jpg" },
  { label: "文件大小", value: "8.5 MB" },
  { label: "分辨率", value: "5472 × 3648" },
  { label: "上传时间", value: "2026-03-20 14:32" },
  { label: "相机型号", value: "Sony A7R IV" },
  { label: "镜头", value: "FE 85mm f/1.4 GM" },
  { label: "光圈", value: "f/1.8" },
  { label: "快门", value: "1/200s" },
  { label: "ISO", value: "400" },
  { label: "焦距", value: "85mm" },
];

function PhotoPreview({
  photos,
  initialIndex,
  onClose,
}: {
  photos: { id: number; bg: string; date: string }[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);
  const [showInfo, setShowInfo] = useState(false);
  // 自动隐藏 UI
  const [uiVisible, setUiVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 跟手滑动状态
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isHorizontalDrag = useRef<boolean | null>(null);
  const sheetTouchStartY = useRef<number | null>(null);

  // 重置自动隐藏计时器
  const resetHideTimer = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setUiVisible(true);
    hideTimerRef.current = setTimeout(() => setUiVisible(false), 3000);
  };

  useEffect(() => {
    resetHideTimer();
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); };
  }, []);

  // 切换照片时重置计时
  useEffect(() => { resetHideTimer(); }, [current]);

  const goPrev = () => { if (current > 0) { setCurrent((i) => i - 1); setDragX(0); } }
  const goNext = () => { if (current < photos.length - 1) { setCurrent((i) => i + 1); setDragX(0); } }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (showInfo) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalDrag.current = null;
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (showInfo || touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // 确定拖动方向
    if (isHorizontalDrag.current === null) {
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        isHorizontalDrag.current = Math.abs(dx) > Math.abs(dy);
      }
    }
    if (isHorizontalDrag.current) {
      e.preventDefault();
      setIsDragging(true);
      // 边界阱鼿：到头时阻力增大
      const isAtEdge = (dx > 0 && current === 0) || (dx < 0 && current === photos.length - 1);
      setDragX(isAtEdge ? dx * 0.25 : dx);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (showInfo || touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (isHorizontalDrag.current) {
      const threshold = 60;
      if (dx < -threshold && current < photos.length - 1) {
        goNext();
      } else if (dx > threshold && current > 0) {
        goPrev();
      } else {
        // 回弹
        setDragX(0);
      }
    } else if (!isDragging) {
      // 单击切换 UI 显隐
      resetHideTimer();
    }
    setIsDragging(false);
    touchStartX.current = null;
    touchStartY.current = null;
    isHorizontalDrag.current = null;
  };

  const photo = photos[current];
  const uiTransition = "opacity 0.35s ease";

  return (
    <div
      className="absolute inset-0 z-[60] flex flex-col"
      style={{ background: "#000000", touchAction: "pan-y" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 顶部导航：左返回 + 右ⓘ */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{
          height: "56px",
          paddingTop: "8px",
          opacity: uiVisible ? 1 : 0,
          transition: uiTransition,
          pointerEvents: uiVisible ? "auto" : "none",
        }}
      >
        <button
          onClick={onClose}
          className="flex items-center justify-center active:opacity-50 transition-opacity"
          style={{ width: "40px", height: "40px" }}
        >
          <svg width="11" height="18" viewBox="0 0 11 18" fill="none">
            <path d="M9 2L2 9l7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {/* 右上ⓘ按鈕 — 毛玻璃极简风 */}
        <button
          className="flex items-center justify-center active:opacity-50 transition-opacity"
          style={{
            width: "36px", height: "36px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
          onClick={() => { setShowInfo(true); resetHideTimer(); }}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8.5" stroke="white" strokeWidth="1.2"/>
            <path d="M10 9v6" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            <circle cx="10" cy="6.5" r="0.9" fill="white"/>
          </svg>
        </button>
      </div>

      {/* 图片主体区域（全屏居中，支持跟手滑动） */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{ cursor: "default" }}
        onClick={resetHideTimer}
      >
        {/* 滑动容器：展示当前、前一张、后一张 */}
        <div
          className="absolute inset-0 flex items-center"
          style={{
            transform: `translateX(calc(${-current * 100}% + ${dragX}px))`,
            transition: isDragging ? "none" : "transform 0.32s cubic-bezier(0.25,0.46,0.45,0.94)",
            width: `${photos.length * 100}%`,
          }}
        >
          {photos.map((p, idx) => (
            <div
              key={p.id}
              className="h-full flex items-center justify-center"
              style={{ width: `${100 / photos.length}%`, flexShrink: 0 }}
            >
              <div
                style={{
                  background: p.bg,
                  aspectRatio: "3/4",
                  width: "100%",
                  maxHeight: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="56" height="56" viewBox="0 0 22 22" fill="none" style={{ opacity: 0.12 }}>
                  <rect x="2" y="4" width="18" height="14" rx="2.5" stroke="white" strokeWidth="1.3"/>
                  <circle cx="8" cy="10" r="2" stroke="white" strokeWidth="1.2"/>
                  <path d="M2 16L7.5 11L11 14L14.5 10L20 16" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* 幽灵左箭头 */}
        {current > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); resetHideTimer(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center active:scale-90 transition-transform"
            style={{
              opacity: uiVisible ? 0.45 : 0,
              transition: `opacity 0.35s ease, transform 0.15s ease`,
              pointerEvents: uiVisible ? "auto" : "none",
              filter: "drop-shadow(0px 1px 4px rgba(0,0,0,0.6))",
              width: "32px",
              height: "32px",
            }}
          >
            <svg width="12" height="22" viewBox="0 0 12 22" fill="none">
              <path d="M10 2L2 11l8 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* 幽灵右箭头 */}
        {current < photos.length - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); resetHideTimer(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center active:scale-90 transition-transform"
            style={{
              opacity: uiVisible ? 0.45 : 0,
              transition: `opacity 0.35s ease, transform 0.15s ease`,
              pointerEvents: uiVisible ? "auto" : "none",
              filter: "drop-shadow(0px 1px 4px rgba(0,0,0,0.6))",
              width: "32px",
              height: "32px",
            }}
          >
            <svg width="12" height="22" viewBox="0 0 12 22" fill="none">
              <path d="M2 2l8 9-8 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* 底部区域 */}
      <div className="shrink-0" style={{ paddingBottom: "34px", opacity: uiVisible ? 1 : 0, transition: uiTransition, pointerEvents: uiVisible ? "auto" : "none" }}>
        {/* 进度文字 + 线性进度条 */}
        <div className="px-5 pt-3 pb-4">
          <div
            className="text-white font-bold mb-2"
            style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "16px", letterSpacing: "0.02em" }}
          >
            {current + 1} / {photos.length}
          </div>
          {/* 进度条：品牌绿 #07C160，极细 2px */}
          <div
            className="w-full overflow-hidden"
            style={{ height: "2px", background: "rgba(255,255,255,0.15)", borderRadius: "1px" }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${((current + 1) / photos.length) * 100}%`,
                background: "#07C160",
                borderRadius: "1px",
              }}
            />
          </div>
        </div>

        {/* 底部四个操作按鈕 — Icon Only，无底色，24px 细线图标 */}
        <div
          className="flex items-center justify-around px-6"
          style={{
            borderTop: "0.5px solid rgba(255,255,255,0.1)",
            paddingTop: "12px",
          }}
        >
          {/* 设为封面 */}
          <button
            className="flex flex-col items-center gap-1.5 active:opacity-40 transition-opacity"
            onClick={() => toast("已设为相册封面", { duration: 1800 })}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v9M12 3l-3 3M12 3l3 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H3a1 1 0 00-1 1v7a1 1 0 001 1h18a1 1 0 001-1v-7a1 1 0 00-1-1h-2" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: "10px", color: "#8A8A8A", fontFamily: "'Noto Sans SC', sans-serif" }}>设为封面</span>
          </button>

          {/* 旋转 */}
          <button
            className="flex flex-col items-center gap-1.5 active:opacity-40 transition-opacity"
            onClick={() => toast("已旋转 90°", { duration: 1500 })}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 12a9 9 0 11-9-9" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M17 3l4 4-4 4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: "10px", color: "#8A8A8A", fontFamily: "'Noto Sans SC', sans-serif" }}>旋转</span>
          </button>

          {/* 查看原图 */}
          <button
            className="flex flex-col items-center gap-1.5 active:opacity-40 transition-opacity"
            onClick={() => toast("正在加载原图…", { duration: 1800 })}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="white" strokeWidth="1.3"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="white" strokeWidth="1.3"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="white" strokeWidth="1.3"/>
              <path d="M14 17.5h7M17.5 14v7" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: "10px", color: "#8A8A8A", fontFamily: "'Noto Sans SC', sans-serif" }}>查看原图</span>
          </button>

          {/* 删除 — 细线红色，无底色 */}
          <button
            className="flex flex-col items-center gap-1.5 active:opacity-40 transition-opacity"
            onClick={() => toast("已删除该张照片", { duration: 1800 })}
          >
            <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
              <path d="M2 5h18M8 5V3a1 1 0 011-1h4a1 1 0 011 1v2" stroke="#FF4D4F" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M4 5l1.4 13.1a1 1 0 001 .9h9.2a1 1 0 001-.9L18 5" stroke="#FF4D4F" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9.5v6M13 9.5v6" stroke="#FF4D4F" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: "10px", color: "#FF4D4F", fontFamily: "'Noto Sans SC', sans-serif" }}>删除</span>
          </button>
        </div>
      </div>

      {/* ══ EXIF 信息面板（Bottom Sheet） ══ */}
      {showInfo && (
        <>
          {/* 暗色遮罩 */}
          <div
            className="absolute inset-0 z-[70]"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setShowInfo(false)}
          />
          {/* 面板本体 */}
          <div
            className="absolute bottom-0 left-0 right-0 z-[80]"
            style={{
              background: "rgba(28,28,30,0.82)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: "16px 16px 0 0",
              paddingBottom: "34px",
              animation: "slideUp 0.28s cubic-bezier(0.32,0.72,0,1)",
            }}
            onTouchStart={(e) => { sheetTouchStartY.current = e.touches[0].clientY; }}
            onTouchEnd={(e) => {
              if (sheetTouchStartY.current !== null) {
                const dy = e.changedTouches[0].clientY - sheetTouchStartY.current;
                if (dy > 60) setShowInfo(false);
                sheetTouchStartY.current = null;
              }
            }}
          >
            {/* 拖拽把手 */}
            <div className="flex justify-center pt-3 pb-4">
              <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.25)" }} />
            </div>

            {/* 标题 */}
            <div className="flex items-center justify-between px-5 mb-4">
              <span
                style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF", fontFamily: "'Noto Sans SC', sans-serif", letterSpacing: "-0.2px" }}
              >
                照片信息
              </span>
              <button
                onClick={() => setShowInfo(false)}
                className="active:opacity-50 transition-opacity"
                style={{
                  width: "28px", height: "28px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* 分割线 */}
            <div style={{ height: "0.5px", background: "rgba(255,255,255,0.1)", marginBottom: "4px" }} />

            {/* EXIF 数据列表 */}
            <div className="px-5">
              {EXIF_DATA.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between"
                  style={{
                    paddingTop: "11px",
                    paddingBottom: "11px",
                    borderBottom: idx < EXIF_DATA.length - 1 ? "0.5px solid rgba(255,255,255,0.07)" : "none",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "'Noto Sans SC', sans-serif" }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.88)", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 500 }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0.6 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
    </div>
  );
}

export default function AlbumDetail() {
  const [, navigate] = useLocation();
  const [albumName, setAlbumName] = useState(generateAlbumName);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(albumName);
  const [hasPhotos, setHasPhotos] = useState(false);
  const [photos, setPhotos] = useState(MOCK_PHOTOS);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  // ── 上传相关状态 ──
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadQueue, setUploadQueue] = useState<typeof UPLOAD_PHOTOS>([]);
  const [uploadedIds, setUploadedIds] = useState<number[]>([]);
  const [uploadDone, setUploadDone] = useState(0);
  const uploadCancelRef = useRef(false);
  // ── 回到顶部 ──
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const handleGridScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 280);
  };
  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── 逐张上传模拟逻辑 ──
  useEffect(() => {
    if (uploadStatus !== "uploading" || uploadQueue.length === 0) return;
    uploadCancelRef.current = false;
    let current = 0;
    const total = uploadQueue.length;

    const uploadNext = () => {
      if (uploadCancelRef.current) {
        setUploadStatus("idle");
        setUploadQueue([]);
        setUploadedIds([]);
        setUploadDone(0);
        return;
      }
      if (current >= total) {
        setUploadStatus("done");
        setHasPhotos(true);
        setTimeout(() => {
          setUploadStatus("idle");
          setUploadQueue([]);
          setUploadedIds([]);
          setUploadDone(0);
        }, 1200);
        return;
      }
      const photo = uploadQueue[current];
      // 每张上传模拟 600-1000ms
      const delay = 600 + Math.random() * 400;
      setTimeout(() => {
        setUploadedIds(prev => [...prev, photo.id]);
        setUploadDone(prev => prev + 1);
        current++;
        uploadNext();
      }, delay);
    };

    uploadNext();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadStatus]);

  const handleNameConfirm = () => {
    if (tempName.trim()) setAlbumName(tempName.trim());
    setEditingName(false);
  };

  const handleUpload = () => {
    // 先弹出 PRO 解锁弹窗
    setShowProModal(true);
  };

  const handleProConfirm = () => {
    setShowProModal(false);
    toast("7 天免费体验已开启，尽情上传吧！", { duration: 2500 });
    // 开启后直接进入选图
    setTimeout(() => setShowPicker(true), 400);
  };

  const handlePickerConfirm = () => {
    setShowPicker(false);
    // 立刻展示缩略图（本地缓存）
    setPhotos(prev => [...prev, ...UPLOAD_PHOTOS]);
    setHasPhotos(true);
    // 启动上传队列
    setUploadQueue(UPLOAD_PHOTOS);
    setUploadedIds([]);
    setUploadDone(0);
    setUploadStatus("uploading");
  };

  const handleShare = () => {
    setShowShare(true);
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selected.length === photos.length) {
      setSelected([]);
    } else {
      setSelected(photos.map((p) => p.id));
    }
  };

  const exitEditMode = () => {
    setEditMode(false);
    setSelected([]);
  };

  const handleSaveSettings = (newName: string) => {
    if (newName.trim()) setAlbumName(newName.trim());
    toast("相册设置已保存", { duration: 1800 });
  };

  return (
    <div className="min-h-screen bg-[#EFEFEF] flex items-center justify-center p-4">
      <div
        className="relative bg-[#F2F2F2] overflow-hidden shadow-2xl flex flex-col"
        style={{
          width: "390px",
          height: "844px",
          borderRadius: "44px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >

        {/* ══════════════════════════════════════
            封面区（含状态栏+导航+信息）- 编辑/浏览态保持一致
        ══════════════════════════════════════ */}
        <div
            className="relative shrink-0"
            style={{ height: "212px" }}
          >
            {/* 封面图 */}
            <img
              src={COVER_IMAGE}
              alt="相册封面"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* 全封面暗角遮罩（底部向上渐变） */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
              }}
            />
            {/* 顶部防眩光遮罩（从上往下渐变，保证导航文字可读） */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.12) 35%, transparent 60%)",
              }}
            />
            {/* 顶部状态栏 + 导航栏：返回按钮通过 leftSlot 内置，与胶囊按钮垂直居中对齐 */}
            <div className="relative z-10">
              <StatusBar
                light={true}
                leftSlot={
                  <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-1.5 active:opacity-50 transition-opacity"
                  >
                    <svg width="11" height="18" viewBox="0 0 11 18" fill="none">
                      <path d="M9 2L2 9L9 16" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[15px] font-medium text-white" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>返回</span>
                  </button>
                }
              />
            </div>
            {/* 左下角信息悬浮层 */}
            <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-3">
              {/* 相册标题 + 设置icon */}
              <div className="flex items-center gap-2 mb-1.5" style={{ alignItems: "center" }}>
                {editingName ? (
                  <input
                    autoFocus
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={handleNameConfirm}
                    onKeyDown={(e) => e.key === "Enter" && handleNameConfirm()}
                    className="text-[20px] font-black text-white bg-transparent border-b border-white/60 outline-none flex-1"
                    style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                  />
                ) : (
                  <button
                    onClick={() => { setTempName(albumName); setEditingName(true); }}
                    className="text-[20px] font-black text-white leading-tight truncate max-w-[240px] active:opacity-70"
                    style={{ fontFamily: "'Noto Sans SC', sans-serif", letterSpacing: "-0.3px" }}
                  >
                    {albumName}
                  </button>
                )}
                {/* 设置 icon */}
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center justify-center active:opacity-60 transition-opacity shrink-0"
                  style={{ width: "28px", height: "28px" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6"/>
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              {/* 数据行 */}
              <div className="flex items-center gap-2.5" style={{ paddingBottom: "20px" }}>
                <div className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="2.5" width="12" height="9" rx="2" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2"/>
                    <circle cx="5" cy="6.5" r="1.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1.1"/>
                    <path d="M1 10L4.5 7.5L6.5 9L9 6.5L13 10" stroke="rgba(255,255,255,0.75)" strokeWidth="1.1" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[12px] text-white/80" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                    <span className="font-semibold text-white">{hasPhotos ? photos.length : 0}</span> 张照片
                  </span>
                </div>
                <div className="w-[3px] h-[3px] rounded-full bg-white/40" />
                <div className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7C1 7 3 3 7 3s6 4 6 4-2 4-6 4-6-4-6-4z" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2"/>
                    <circle cx="7" cy="7" r="1.8" stroke="rgba(255,255,255,0.75)" strokeWidth="1.1"/>
                  </svg>
                  <span className="text-[12px] text-white/80" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                    <span className="font-semibold text-white">{hasPhotos ? 24 : 0}</span> 次浏览
                  </span>
                </div>
              </div>
            </div>
          </div>

        {/* ══════════════════════════════════════
            白色圆角卡片容器（向上覆盖封面底部）
        ══════════════════════════════════════ */}
        <div
          ref={scrollContainerRef}
          onScroll={handleGridScroll}
          className="flex-1 overflow-y-auto relative"
          style={{
            background: "#FFFFFF",
            borderRadius: "16px 16px 0 0",
            marginTop: "-16px",
            paddingTop: "0",
            paddingBottom: hasPhotos ? "100px" : "0",
            scrollbarWidth: "none",
          }}
        >

          {/* 空状态 */}
          {!hasPhotos && (
            <div className="flex flex-col items-center px-6 animate-fade-in" style={{ paddingTop: "44px", paddingBottom: "40px" }}>
              <div
                className="flex items-center justify-center mb-5"
                style={{ width: "80px", height: "80px", borderRadius: "24px", background: "rgba(7,193,96,0.06)" }}
              >
                <svg width="42" height="42" viewBox="0 0 46 46" fill="none">
                  <path d="M32 28H34a7 7 0 000-14 7 7 0 00-13.5-2.5A6 6 0 1012 28h4" stroke="#C8C8C8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 38V28M18 33l5-5 5 5" stroke="#07C160" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <button
                onClick={handleUpload}
                className="w-full flex items-center justify-center gap-2.5 text-white font-bold text-[16px] rounded-2xl transition-all active:scale-[0.97] mb-5"
                style={{
                  height: "50px",
                  background: "linear-gradient(135deg, #07C160 0%, #05A050 100%)",
                  boxShadow: "0 6px 20px rgba(7,193,96,0.36)",
                  fontFamily: "'Noto Sans SC', sans-serif",
                  letterSpacing: "0.03em",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3v14M3 10h14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
                选择照片上传
              </button>

              <div className="w-full space-y-2.5">
                {[
                  "支持 JPG 格式，单张最大 100MB",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="shrink-0 mt-[3px] text-[#C8C8C8] text-[10px]">·</span>
                    <p className="text-[12px] leading-[1.7] text-[#8A8A8A]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 有图状态：4列直角网格 */}
          {hasPhotos && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-4" style={{ gap: "1.5px" }}>
                {photos.map((p) => (
                  <div
                    key={p.id}
                    className="aspect-square relative overflow-hidden"
                    style={{ background: "#F0F0F0", borderRadius: "0px" }}
                    onClick={() => {
                      if (editMode) { toggleSelect(p.id); }
                      else { setPreviewIndex(photos.indexOf(p)); }
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 22 22" fill="none" style={{ opacity: 0.28 }}>
                        <rect x="2" y="4" width="18" height="14" rx="2.5" stroke="#888888" strokeWidth="1.3"/>
                        <circle cx="8" cy="10" r="2" stroke="#888888" strokeWidth="1.2"/>
                        <path d="M2 16L7.5 11L11 14L14.5 10L20 16" stroke="#888888" strokeWidth="1.2" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {/* ── 上传中遇罩 + 环形进度 ── */}
                    {uploadStatus === "uploading" && uploadQueue.some(q => q.id === p.id) && !uploadedIds.includes(p.id) && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
                        <CircleProgress progress={0.5} />
                      </div>
                    )}
                    {/* ── 编辑模式勾选框 ── */}
                    {editMode && (
                      <>
                        {selected.includes(p.id) && (
                          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.20)" }} />
                        )}
                        <div className="absolute top-1.5 right-1.5 z-10">
                          <div
                            className="w-[20px] h-[20px] rounded-full flex items-center justify-center transition-all duration-150"
                            style={{
                              background: selected.includes(p.id) ? "#07C160" : "transparent",
                              border: selected.includes(p.id) ? "none" : "1.5px solid rgba(255,255,255,0.9)",
                              boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                            }}
                          >
                            {selected.includes(p.id) && (
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 底部「完」结束文案 ── */}
          {hasPhotos && (
            <div
              className="flex items-center justify-center gap-3"
              style={{ paddingTop: "20px", paddingBottom: "16px", paddingLeft: "32px", paddingRight: "32px" }}
            >
              <div style={{ flex: 1, height: "1px", background: "#EEEEEE" }} />
              <span
                style={{
                  fontSize: "11px",
                  color: "#C8C8C8",
                  fontFamily: "'Noto Sans SC', sans-serif",
                  letterSpacing: "0.12em",
                  whiteSpace: "nowrap",
                }}
              >
                完
              </span>
              <div style={{ flex: 1, height: "1px", background: "#EEEEEE" }} />
            </div>
          )}
        </div>

        {/* ══ 上传状态舱（上传中时从底部升起） ══ */}
        <div
          className="absolute left-0 right-0 z-30"
          style={{
            bottom: uploadStatus === "uploading" ? "0" : "-200px",
            transition: "bottom 0.38s cubic-bezier(0.34,1.56,0.64,1)",
            paddingBottom: "28px",
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingTop: "12px",
          }}
        >
          <div
            style={{
              background: "#1A1A1A",
              borderRadius: "20px",
              padding: "18px 16px 18px 18px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.32)",
            }}
          >
            {/* 第一行：火箭图标 + 文案 + 取消按钮 */}
            <div className="flex items-center gap-3">
              <span style={{ fontSize: "18px", lineHeight: 1 }}>&#128640;</span>
              <div className="flex-1">
                <span className="text-white text-[14px] font-semibold" style={{ fontFamily: "'Noto Sans SC', sans-serif", letterSpacing: "0.02em" }}>
                  正在极速上传 ({uploadDone}/{uploadQueue.length})
                </span>
              </div>
              <button
                onClick={() => { uploadCancelRef.current = true; }}
                className="flex items-center justify-center active:opacity-70 transition-opacity shrink-0"
                style={{
                  height: "32px",
                  paddingLeft: "14px",
                  paddingRight: "14px",
                  borderRadius: "999px",
                  background: "transparent",
                  color: "#FF4D4F",
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                取消
              </button>
            </div>
            {/* 进度条 */}
            <div className="mt-4 mb-1 h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: uploadQueue.length > 0 ? `${(uploadDone / uploadQueue.length) * 100}%` : "0%",
                  background: "linear-gradient(90deg, #07C160, #05E070)",
                  transition: "width 0.4s ease",
                  boxShadow: "0 0 8px rgba(7,193,96,0.6)",
                }}
              />
            </div>
            {/* 警示文案 */}
            <p
              className="text-[11px] leading-[1.5]"
              style={{
                marginTop: "10px",
                marginBottom: "4px",
                color: "rgba(255,255,255,0.45)",
                fontFamily: "'Noto Sans SC', sans-serif",
                letterSpacing: "0.01em",
              }}
            >
              请保持屏幕常亮，切出此页面将导致上传中断
            </p>
          </div>
        </div>

        {/* ══ 悬浮回到顶部按钮 ══ */}
        {hasPhotos && (
          <div
            style={{
              position: "absolute",
              right: "16px",
              bottom: "96px",
              zIndex: 25,
              transition: "opacity 0.28s ease, transform 0.28s ease",
              opacity: showScrollTop && uploadStatus !== "uploading" ? 1 : 0,
              transform: showScrollTop && uploadStatus !== "uploading" ? "translateY(0)" : "translateY(10px)",
              pointerEvents: showScrollTop && uploadStatus !== "uploading" ? "auto" : "none",
            }}
          >
            <button
              onClick={scrollToTop}
              className="flex items-center justify-center active:scale-90 transition-transform"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.14), 0 0 0 0.5px rgba(0,0,0,0.06)",
              }}
              aria-label="回到顶部"
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M9 14V5M5 8.5L9 4.5L13 8.5" stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
        {/* ══════════════════════════════════════
            底部操作栏（有图时显示）
        ══════════════════════════════════════ */}
        {hasPhotos && (
          <div
            className="absolute bottom-0 left-0 right-0 z-20"
            style={{
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 -1px 0 rgba(0,0,0,0.06), 0 -6px 20px rgba(0,0,0,0.04)",
              borderRadius: "0 0 44px 44px",
              overflow: "hidden",
              opacity: uploadStatus === "uploading" ? 0 : 1,
              pointerEvents: uploadStatus === "uploading" ? "none" : "auto",
              transition: "opacity 0.25s ease",
            }}
          >
            {/* ── 默认态底栏 ── */}
            <div
              className="flex items-center px-4 gap-2"
              style={{
                paddingTop: "10px",
                paddingBottom: "28px",
                transition: "opacity 0.22s ease, transform 0.22s ease",
                opacity: editMode ? 0 : 1,
                transform: editMode ? "translateY(70px)" : "translateY(0)",
                pointerEvents: editMode ? "none" : "auto",
                position: editMode ? "absolute" : "relative",
                width: "100%",
                top: 0,
              }}
            >
              {/* 左侧：编辑（纯文字，无背景） */}
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1.5 active:opacity-50 transition-opacity shrink-0"
                style={{
                  height: "44px",
                  paddingLeft: "4px",
                  paddingRight: "8px",
                  color: "#8A8A8A",
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" stroke="#8A8A8A" strokeWidth="1.4"/>
                  <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" stroke="#8A8A8A" strokeWidth="1.4"/>
                  <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" stroke="#8A8A8A" strokeWidth="1.4"/>
                  <path d="M9.5 11.5L11 13L14.5 9.5" stroke="#07C160" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                编辑
              </button>

              {/* 右侧：继续上传（绿色主胶囊）+ 发送给客户（次级灰色胶囊）*/}
              <div className="flex-1 flex items-center justify-end gap-2">
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-1.5 transition-all active:scale-[0.96]"
                  style={{
                    height: "44px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    borderRadius: "999px",
                    background: "#F0F0F0",
                    color: "#1A1A1A",
                    fontFamily: "'Noto Sans SC', sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                    <path d="M15 3L8 10M15 3H10M15 3V8" stroke="#1A1A1A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 4H4a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  分享
                </button>
                <button
                  onClick={() => setShowLimitModal(true)}
                  className="flex items-center justify-center gap-1.5 text-white transition-all active:scale-[0.97]"
                  style={{
                    height: "44px",
                    paddingLeft: "18px",
                    paddingRight: "18px",
                    borderRadius: "999px",
                    background: "linear-gradient(135deg, #07C160 0%, #05A050 100%)",
                    boxShadow: "0 4px 14px rgba(7,193,96,0.32)",
                    fontFamily: "'Noto Sans SC', sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                    <path d="M10 3v14M3 10h14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                  </svg>
                  继续上传
                </button>
              </div>
            </div>

            {/* ── 编辑模式底栏：全选（左）+ 取消 + 删除（右） ── */}
            <div
              className="flex items-center justify-between px-4"
              style={{
                paddingTop: "10px",
                paddingBottom: "28px",
                transition: "opacity 0.22s ease, transform 0.22s ease",
                opacity: editMode ? 1 : 0,
                transform: editMode ? "translateY(0)" : "translateY(70px)",
                pointerEvents: editMode ? "auto" : "none",
                position: editMode ? "relative" : "absolute",
                width: "100%",
                top: 0,
              }}
            >
              {/* 左侧：全选 */}
              <button
                onClick={selectAll}
                className="flex items-center gap-1.5 active:opacity-50 transition-opacity"
                style={{ height: "44px", paddingRight: "8px" }}
              >
                <div
                  className="w-[22px] h-[22px] rounded-full flex items-center justify-center transition-all duration-150"
                  style={{
                    background: selected.length === photos.length ? "#07C160" : "transparent",
                    border: selected.length === photos.length ? "none" : "1.5px solid #CCCCCC",
                  }}
                >
                  {selected.length === photos.length && (
                    <svg width="11" height="9" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span
                  className="text-[14px] font-medium"
                  style={{ color: selected.length === photos.length ? "#07C160" : "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif" }}
                >
                  {selected.length === photos.length ? "取消全选" : "全选"}
                </span>
              </button>

              {/* 右侧：取消 + 删除胶囊 */}
              <div className="flex items-center gap-3">
                <button
                  onClick={exitEditMode}
                  className="text-[14px] active:opacity-50 transition-opacity"
                  style={{ color: "#8A8A8A", fontFamily: "'Noto Sans SC', sans-serif", height: "44px", paddingLeft: "4px", paddingRight: "4px" }}
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    if (selected.length === 0) { toast("请先选择照片", { duration: 1500 }); return; }
                    toast(`已删除 ${selected.length} 张照片`, { duration: 2000 });
                    setSelected([]);
                    setEditMode(false);
                  }}
                  className="flex items-center gap-1.5 active:scale-[0.96] transition-all"
                  style={{
                    height: "36px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    borderRadius: "999px",
                    background: selected.length > 0 ? "#FFF1F0" : "#F5F5F5",
                    color: selected.length > 0 ? "#FF4D4F" : "#BBBBBB",
                    fontFamily: "'Noto Sans SC', sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    transition: "all 0.18s ease",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 22 22" fill="none">
                    <path
                      d="M3 6h16M8 6V4.5a1 1 0 011-1h4a1 1 0 011 1V6M9.5 10v6M12.5 10v6M4 6l1 12a1 1 0 001 .9h8a1 1 0 001-.9l1-12"
                      stroke={selected.length > 0 ? "#FF4D4F" : "#BBBBBB"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                  删除{selected.length > 0 ? ` ${selected.length}` : ""}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* ── PRO 解锁弹窗（黑金礼盒）—选择照片上传 ── */}
        <ProUpgradeModal
          visible={showProModal}
          onClose={() => setShowProModal(false)}
          onConfirm={handleProConfirm}
        />
        {/* ── 上传限额告知弹窗（冷静克制）—继续上传 ── */}
        <UploadLimitModal
          visible={showLimitModal}
          onClose={() => setShowLimitModal(false)}
          onConfirm={() => { setShowLimitModal(false); navigate("/membership"); }}
        />

        {/* ── 设置弹出面板 ── */}
        {showSettings && (
          <SettingsSheet
            albumName={albumName}
            onClose={() => setShowSettings(false)}
            onSave={handleSaveSettings}
          />
        )}

        {/* ══ 分享面板 ══ */}
        <div
          className="absolute inset-0 z-40"
          style={{
            background: "rgba(0,0,0,0.45)",
            opacity: showShare ? 1 : 0,
            pointerEvents: showShare ? "auto" : "none",
            transition: "opacity 0.25s ease",
          }}
          onClick={() => setShowShare(false)}
        />
        <div
          className="absolute left-0 right-0 bottom-0 z-50 flex flex-col"
          style={{
            transform: showShare ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.34s cubic-bezier(0.32,0.72,0,1)",
            background: "#FFFFFF",
            borderRadius: "20px 20px 0 0",
            paddingBottom: "34px",
          }}
        >
          {/* 拖把手柄 */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-[36px] h-[4px] rounded-full bg-[#E0E0E0]" />
          </div>
          {/* 标题栏 */}
          <div
            className="flex items-center justify-between px-5 pb-4 pt-1"
            style={{ borderBottom: "1px solid #F0F0F0" }}
          >
            <div style={{ width: 40 }} />
            <span className="text-[16px] font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>分享相册</span>
            <button
              onClick={() => setShowShare(false)}
              className="text-[15px] active:opacity-60"
              style={{ color: "#8A8A8A", fontFamily: "'Noto Sans SC', sans-serif", width: 40, textAlign: "right" }}
            >
              关闭
            </button>
          </div>

          {/* 分享选项列表 */}
          <div className="px-5 pt-5 space-y-3">
            {/* 发送给好友 */}
            <button
              onClick={() => { setShowShare(false); toast("已打开分享面板", { duration: 1800 }); }}
              className="w-full flex items-center gap-4 active:bg-gray-50 transition-colors"
              style={{
                height: "64px",
                borderRadius: "14px",
                background: "#F7F7F7",
                padding: "0 18px",
              }}
            >
              {/* 微信好友图标 */}
              <div
                className="flex items-center justify-center shrink-0"
                style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#07C160" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11.5C9 13.43 7.43 15 5.5 15S2 13.43 2 11.5 3.57 8 5.5 8 9 9.57 9 11.5Z" fill="white"/>
                  <path d="M15.5 9C15.5 11.21 13.71 13 11.5 13S7.5 11.21 7.5 9 9.29 5 11.5 5 15.5 6.79 15.5 9Z" fill="white"/>
                  <path d="M22 11.5C22 13.43 20.43 15 18.5 15S15 13.43 15 11.5 16.57 8 18.5 8 22 9.57 22 11.5Z" fill="white"/>
                  <path d="M5.5 15C3.57 15 2 16.12 2 17.5V18h7v-.5C9 16.12 7.43 15 5.5 15Z" fill="white"/>
                  <path d="M18.5 15C16.57 15 15 16.12 15 17.5V18h7v-.5C22 16.12 20.43 15 18.5 15Z" fill="white"/>
                  <path d="M11.5 13C9.01 13 7 14.34 7 16V17h9v-1C16 14.34 13.99 13 11.5 13Z" fill="white"/>
                </svg>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[15px] font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>发送给好友</span>
                <span className="text-[12px] text-[#8A8A8A]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>通过微信好友发送相册链接</span>
              </div>
              <svg className="ml-auto" width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M1 1l5 5-5 5" stroke="#C8C8CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ══ 图片预览全屏浏览器 ══ */}
        {previewIndex !== null && (
          <PhotoPreview
            photos={photos}
            initialIndex={previewIndex}
            onClose={() => setPreviewIndex(null)}
          />
        )}

        {/* ══ 微信选图器弹框（原生三选项样式） ══ */}
        {/* 半透明黑色递层 */}
        <div
          className="absolute inset-0 z-40"
          style={{
            background: "rgba(0,0,0,0.45)",
            opacity: showPicker ? 1 : 0,
            pointerEvents: showPicker ? "auto" : "none",
            transition: "opacity 0.25s ease",
          }}
          onClick={() => setShowPicker(false)}
        />
        {/* 弹框主体：从底部升起 */}
        <div
          className="absolute left-0 right-0 bottom-0 z-50"
          style={{
            transform: showPicker ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.32s cubic-bezier(0.32,0.72,0,1)",
          }}
        >
          {/* 操作选项组 */}
          <div style={{ background: "#F2F2F7", padding: "0 8px" }}>
            {/* 拍摄 */}
            <button
              onClick={() => { setShowPicker(false); toast("正在启动相机…", { duration: 1500 }); }}
              className="w-full flex items-center justify-center active:bg-gray-100 transition-colors"
              style={{
                height: "57px",
                borderBottom: "0.5px solid #C8C8CC",
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: "18px",
                color: "#1A1A1A",
                background: "#FFFFFF",
                borderRadius: "14px 14px 0 0",
              }}
            >
              拍摄
            </button>
            {/* 从相册选择 */}
            <button
              onClick={handlePickerConfirm}
              className="w-full flex items-center justify-center active:bg-gray-100 transition-colors"
              style={{
                height: "57px",
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: "18px",
                color: "#1A1A1A",
                background: "#FFFFFF",
                borderRadius: "0 0 14px 14px",
              }}
            >
              从相册选择
            </button>
          </div>

          {/* 取消按鈕（独立卡片） */}
          <div style={{ background: "#F2F2F7", padding: "8px 8px 0 8px" }}>
            <button
              onClick={() => setShowPicker(false)}
              className="w-full flex items-center justify-center active:bg-gray-100 transition-colors"
              style={{
                height: "57px",
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: "18px",
                fontWeight: 600,
                color: "#1A1A1A",
                background: "#FFFFFF",
                borderRadius: "14px",
              }}
            >
              取消
            </button>
          </div>

          {/* 底部安全区 */}
          <div style={{ height: "34px", background: "#F2F2F7" }} />
        </div>
      </div>
    </div>
  );
}
