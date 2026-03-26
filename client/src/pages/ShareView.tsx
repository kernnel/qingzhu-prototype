import WechatStatusBar from "@/components/WechatStatusBar";
/**
 * 青竹快传 · 图片分享页（客户端）
 * 布局参考：相册管理详情页（AlbumDetail）
 * 功能：仅查看 + 下载，无编辑/删除/上传
 *
 * 结构：
 * 1. 顶部封面区（含标题、摄影师信息、有效期）
 * 2. 白色圆角卡片向上覆盖，内含日期分组 + 4列直角网格
 * 3. 底部工具栏：「全选」文字按钮 + 「下载所选」胶囊
 * 4. 全屏预览：点击图片进入，支持左右滑动，底部「下载」按钮
 */

import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const GREEN = "#07C160";
const COVER_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80";

// 计算距离过期的天数（mock：距今 2 天后过期）
const EXPIRE_DATE = new Date();
EXPIRE_DATE.setDate(EXPIRE_DATE.getDate() + 2);
const EXPIRE_DAYS = Math.ceil((EXPIRE_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
const IS_URGENT = EXPIRE_DAYS <= 3; // ≤3天显示橙色警告

// ── Mock 照片数据 ──
const PHOTOS = [
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
  { id: 13, bg: "#D8EDD4", date: "3月21日 星期五" },
  { id: 14, bg: "#C3DFBE", date: "3月21日 星期五" },
  { id: 15, bg: "#E2F0DE", date: "3月21日 星期五" },
  { id: 16, bg: "#BBDAB5", date: "3月21日 星期五" },
];

function groupByDate(photos: typeof PHOTOS) {
  const groups: { date: string; items: typeof PHOTOS }[] = [];
  photos.forEach((p) => {
    const last = groups[groups.length - 1];
    if (last && last.date === p.date) last.items.push(p);
    else groups.push({ date: p.date, items: [p] });
  });
  return groups;
}

// ── 状态栏 ──
function StatusBar({ light = false, leftSlot }: { light?: boolean; leftSlot?: React.ReactNode }) {
  return <WechatStatusBar light={light} leftSlot={leftSlot} />;
}

// ── EXIF 数据（share 页面展示用）──
const SHARE_EXIF_DATA = [
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

// ── 全屏预览（仅查看 + 下载）──
function PhotoPreview({
  photos,
  initialIndex,
  onClose,
}: {
  photos: typeof PHOTOS;
  initialIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);
  const [showInfo, setShowInfo] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isHorizontalDrag = useRef<boolean | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sheetTouchStartY = useRef<number | null>(null);

  const resetHideTimer = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setUiVisible(true);
    hideTimerRef.current = setTimeout(() => setUiVisible(false), 3000);
  };

  useEffect(() => {
    resetHideTimer();
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); };
  }, []);

  useEffect(() => { resetHideTimer(); }, [current]);

  const goPrev = () => { if (current > 0) { setCurrent(i => i - 1); setDragX(0); } };
  const goNext = () => { if (current < photos.length - 1) { setCurrent(i => i + 1); setDragX(0); } };

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
    if (isHorizontalDrag.current === null) {
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        isHorizontalDrag.current = Math.abs(dx) > Math.abs(dy);
      }
    }
    if (isHorizontalDrag.current) {
      e.preventDefault();
      setIsDragging(true);
      const isAtEdge = (dx > 0 && current === 0) || (dx < 0 && current === photos.length - 1);
      setDragX(isAtEdge ? dx * 0.25 : dx);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (showInfo || touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (isHorizontalDrag.current) {
      const threshold = 60;
      if (dx < -threshold && current < photos.length - 1) goNext();
      else if (dx > threshold && current > 0) goPrev();
      else setDragX(0);
    } else if (!isDragging) {
      resetHideTimer();
    }
    setIsDragging(false);
    touchStartX.current = null;
    touchStartY.current = null;
    isHorizontalDrag.current = null;
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      toast("已保存到手机相册", { duration: 2000 });
    }, 1200);
  };

  const uiTransition = "opacity 0.35s ease";

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col"
      style={{ background: "#000000", touchAction: "pan-y" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 顶部导航：左返回 + 右侧按鈕组 */}
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

        {/* 右侧按鈕组 */}
        <div className="flex items-center gap-2" style={{ position: "relative" }}>
          {/* ℹ 按鈕 */}
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

          {/* … 更多按鈕 */}
          <div style={{ position: "relative" }}>
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
              onClick={(e) => { e.stopPropagation(); setShowMore(v => !v); resetHideTimer(); }}
            >
              <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                <circle cx="2" cy="2" r="1.5" fill="white"/>
                <circle cx="8" cy="2" r="1.5" fill="white"/>
                <circle cx="14" cy="2" r="1.5" fill="white"/>
              </svg>
            </button>

            {/* 下拉菜单 */}
            {showMore && (
              <>
                {/* 透明蒙层关闭菜单 */}
                <div
                  className="fixed inset-0"
                  style={{ zIndex: 58 }}
                  onClick={() => setShowMore(false)}
                />
                <div
                  style={{
                    position: "absolute", top: "44px", right: 0,
                    background: "rgba(30,30,30,0.96)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    minWidth: "140px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    zIndex: 59,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="w-full flex items-center gap-3 px-4 active:bg-white/10 transition-colors"
                    style={{ height: "48px" }}
                    onClick={() => { setShowMore(false); setShowReport(true); resetHideTimer(); }}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M10 3v7" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                      <circle cx="10" cy="14.5" r="1.2" fill="white"/>
                      <path d="M3 17l1.5-10h11L17 17H3Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontSize: "15px", color: "white", fontFamily: "'Noto Sans SC', sans-serif" }}>投诉举报</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 投诉举报弹窗 — 白色居中卡片风格 */}
      {showReport && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.65)", zIndex: 60, padding: "24px" }}
          onClick={() => { setShowReport(false); setReportText(""); setReportSent(false); }}
        >
          <div
            style={{
              width: "100%",
              background: "#F5F5F7",
              borderRadius: "20px",
              padding: "24px 20px 20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {reportSent ? (
              /* 提交成功状态 */
              <div className="flex flex-col items-center py-8 gap-3">
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(7,193,96,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L19 7" stroke="#07C160" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p style={{ fontSize: "16px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 600 }}>投诉已提交</p>
                <p style={{ fontSize: "13px", color: "#8E8E93", fontFamily: "'Noto Sans SC', sans-serif", textAlign: "center" }}>感谢您的反馈，我们将尽快处理</p>
                <button
                  onClick={() => { setShowReport(false); setReportText(""); setReportSent(false); }}
                  style={{ marginTop: "8px", padding: "10px 32px", borderRadius: "10px", background: "#07C160", color: "#FFFFFF", fontSize: "15px", fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "'Noto Sans SC', sans-serif" }}
                >
                  关闭
                </button>
              </div>
            ) : (
              <>
                {/* 标题行 */}
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", lineHeight: 1.3 }}>相册名称</h2>
                    <p style={{ fontSize: "13px", color: "#8E8E93", fontFamily: "'Noto Sans SC', sans-serif", marginTop: "2px" }}>ID: 8829103</p>
                  </div>
                  <button
                    onClick={() => { setShowReport(false); setReportText(""); setReportSent(false); }}
                    style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(0,0,0,0.08)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2 2l8 8M10 2l-8 8" stroke="#3C3C43" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                {/* 摄影师信息行 + 缩略图 */}
                <div className="flex items-center justify-between" style={{ marginBottom: "16px", marginTop: "12px" }}>
                  <span style={{ fontSize: "14px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif" }}>摄影师: Alex Chen</span>
                  <div style={{
                    width: "52px", height: "52px", borderRadius: "8px", overflow: "hidden",
                    background: photos[current]?.bg ?? "#2C2C2E", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="5" width="18" height="14" rx="3" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5"/>
                      <circle cx="8.5" cy="10.5" r="2" stroke="rgba(0,0,0,0.3)" strokeWidth="1.3"/>
                      <path d="M3 17l4-4 3 3 3-4 5 5" stroke="rgba(0,0,0,0.3)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {/* 投诉详情标签 */}
                <p style={{ fontSize: "13px", color: "#07C160", fontWeight: 500, fontFamily: "'Noto Sans SC', sans-serif", marginBottom: "8px" }}>投诉详情描述</p>

                {/* 文本框 */}
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="请详细说明您投诉的原因..."
                  maxLength={200}
                  rows={4}
                  style={{
                    width: "100%",
                    background: "#FFFFFF",
                    border: "1px solid rgba(0,0,0,0.10)",
                    borderRadius: "10px",
                    padding: "12px",
                    fontSize: "14px",
                    color: "#1A1A1A",
                    fontFamily: "'Noto Sans SC', sans-serif",
                    resize: "none",
                    outline: "none",
                    boxSizing: "border-box",
                    lineHeight: 1.6,
                    marginBottom: "16px",
                  }}
                />

                {/* 提交按鈕 */}
                <button
                  onClick={() => { if (reportText.trim()) setReportSent(true); }}
                  style={{
                    width: "100%",
                    height: "52px",
                    borderRadius: "14px",
                    background: reportText.trim() ? "#07C160" : "rgba(0,0,0,0.10)",
                    color: reportText.trim() ? "#FFFFFF" : "#AEAEB2",
                    fontSize: "16px",
                    fontWeight: 600,
                    fontFamily: "'Noto Sans SC', sans-serif",
                    border: "none",
                    cursor: reportText.trim() ? "pointer" : "default",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {reportText.trim() && (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" stroke="white" strokeWidth="1.5"/>
                      <path d="M6 10l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  提交投诉
                </button>
              </>
            )}
          </div>
        </div>
      )}

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
          {photos.map((p) => (
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
              width: "32px", height: "32px",
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
              width: "32px", height: "32px",
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
        {/* 进度文字 + 进度条 + 查看原图按钮 */}
        <div className="px-5 pt-3 pb-4">
          {/* 第一行：计数 + 查看原图按钮 */}
          <div className="flex items-center justify-between mb-2">
            <div
              className="text-white font-bold"
              style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "16px", letterSpacing: "0.02em" }}
            >
              {current + 1} / {photos.length}
            </div>
            <button
              className="flex items-center gap-1.5 active:opacity-60 transition-opacity"
              style={{
                border: "1px solid rgba(255,255,255,0.55)",
                borderRadius: "6px",
                padding: "4px 10px",
                background: "transparent",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.6"/>
                <path d="M2 12C4.5 6 8 3 12 3s7.5 3 10 9c-2.5 6-6 9-10 9S4.5 18 2 12Z" stroke="white" strokeWidth="1.6"/>
              </svg>
              <span style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.9)", fontFamily: "'Noto Sans SC', sans-serif", letterSpacing: "0.02em" }}>
                查看原图
              </span>
            </button>
          </div>
          {/* 第二行：线性进度条 */}
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
      </div>

      {/* ══ EXIF 信息面板（Bottom Sheet）══ */}
      {showInfo && (
        <>
          <div
            className="absolute inset-0 z-[70]"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setShowInfo(false)}
          />
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
            <div className="flex justify-center pt-3 pb-4">
              <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.25)" }} />
            </div>
            <div className="flex items-center justify-between px-5 mb-4">
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF", fontFamily: "'Noto Sans SC', sans-serif", letterSpacing: "-0.2px" }}>
                照片信息
              </span>
              <button
                onClick={() => setShowInfo(false)}
                className="active:opacity-50 transition-opacity"
                style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div style={{ height: "0.5px", background: "rgba(255,255,255,0.1)", marginBottom: "4px" }} />
            <div className="px-5">
              {SHARE_EXIF_DATA.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between"
                  style={{
                    paddingTop: "11px",
                    paddingBottom: "11px",
                    borderBottom: idx < SHARE_EXIF_DATA.length - 1 ? "0.5px solid rgba(255,255,255,0.07)" : "none",
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
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
    </div>
  );
}

// ── 主页面 ──
export default function ShareView() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<number[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  // 沉浸式下载弹窗状态
  const [showDarkroom, setShowDarkroom] = useState(false);
  const [darkroomDone, setDarkroomDone] = useState(false);
  const [darkroomCurrent, setDarkroomCurrent] = useState(0);
  const [darkroomTotal, setDarkroomTotal] = useState(0);
  const darkroomTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  // 订阅消息授权弹窗：进入页面时自动弹出
  const [showAuthModal, setShowAuthModal] = useState(true);
  // 相册权限授权弹窗：点击下载时弹出
  const [showDownloadAuth, setShowDownloadAuth] = useState(false);
  // 待执行的下载类型
  const [pendingDownloadType, setPendingDownloadType] = useState<"normal" | "original">("normal");

  const groups = groupByDate(PHOTOS);
  const allIds = PHOTOS.map(p => p.id);

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => {
    setSelected(selected.length === allIds.length ? [] : allIds);
  };

  // 实际执行下载（授权后调用）
  const executeDownload = (_type: "normal" | "original") => {
    const targets = selected.length > 0 ? selected : allIds;
    const total = targets.length;
    setDarkroomTotal(total);
    setDarkroomCurrent(0);
    setDarkroomDone(false);
    setShowDarkroom(true);
    setDownloading(true);
    let cur = 0;
    if (darkroomTimerRef.current) clearInterval(darkroomTimerRef.current);
    darkroomTimerRef.current = setInterval(() => {
      cur += 1;
      setDarkroomCurrent(cur);
      if (cur >= total) {
        clearInterval(darkroomTimerRef.current!);
        darkroomTimerRef.current = null;
        setDarkroomDone(true);
        setDownloading(false);
      }
    }, 320);
  };

  const closeDarkroom = () => {
    if (darkroomTimerRef.current) clearInterval(darkroomTimerRef.current);
    setShowDarkroom(false);
    setDarkroomDone(false);
    setDarkroomCurrent(0);
    setDarkroomTotal(0);
    setDownloading(false);
    setSelected([]);
    setSelectMode(false);
  };

  // 点击下载：先弹授权弹窗
  const handleDownload = (type: "normal" | "original") => {
    setPendingDownloadType(type);
    setShowDownloadAuth(true);
  };

  const handleDownloadSelected = () => {
    handleDownload("normal");
  };

  const handleGridScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 280);
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

        {/* ══ 封面区 ══ */}
        <div className="relative shrink-0" style={{ height: "290px" }}>
          {/* 封面图 */}
          <img
            src={COVER_IMAGE}
            alt="相册封面"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* 底部暗角 */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)" }} />
          {/* 顶部防眩光 */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.12) 35%, transparent 60%)" }} />

          {/* 状态栏（含主页图标，与胶囊齐平） */}
          <div className="relative z-10">
            <StatusBar
              light
              leftSlot={
                <button
                  onClick={() => navigate("/client-albums")}
                  className="flex items-center justify-center active:opacity-50 transition-opacity"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.18)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                    <path d="M9 21V12h6v9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              }
            />
          </div>

          {/* 左下角：相册信息 */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-8">
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF", fontFamily: "'Noto Sans SC', sans-serif", marginBottom: "8px", letterSpacing: "-0.3px", textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}>
              20260323 婚礼纪实
            </h1>
            <div className="flex items-center gap-3">
              {/* 张数 */}
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", fontFamily: "'Noto Sans SC', sans-serif" }}>
                {PHOTOS.length} 张
              </span>

            </div>
          </div>
        </div>

        {/* ══ 白色内容卡片（向上覆盖封面底部） ══ */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            background: "#FFFFFF",
            borderRadius: "20px 20px 0 0",
            marginTop: "-20px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* 顶部拖拽把手 + 选择栏 */}
          <div style={{ paddingTop: "10px", paddingBottom: "8px", borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
            <div className="flex justify-center mb-2">
              <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "#E0E0E0" }} />
            </div>
            <div className="flex items-center justify-between px-4">
              {selectMode ? (
                <>
                  <button
                    onClick={() => { setSelectMode(false); setSelected([]); }}
                    style={{ fontSize: "15px", color: "#8A8A8A", fontFamily: "'Noto Sans SC', sans-serif" }}
                    className="active:opacity-60"
                  >
                    取消
                  </button>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif" }}>
                    已选 {selected.length} 张
                  </span>
                  <button
                    onClick={selectAll}
                    style={{ fontSize: "15px", color: GREEN, fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 500 }}
                    className="active:opacity-60"
                  >
                    {selected.length === allIds.length ? "取消全选" : "全选"}
                  </button>
                </>
              ) : (
                <>
                  <span style={{ fontSize: "14px", color: "#9A9A9F", fontFamily: "'Noto Sans SC', sans-serif" }}>
                    共 {PHOTOS.length} 张照片
                  </span>
                  <button
                    onClick={() => setSelectMode(true)}
                    style={{ fontSize: "14px", color: GREEN, fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 500 }}
                    className="active:opacity-60"
                  >
                    选择
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 照片网格（4列，无日期分组） */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto"
            onScroll={handleGridScroll}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1.5px",
              }}
            >
              {PHOTOS.map((photo) => {
                    const isSelected = selected.includes(photo.id);
                    return (
                      <div
                        key={photo.id}
                        style={{ position: "relative", aspectRatio: "1", cursor: "pointer" }}
                        onClick={() => {
                          if (selectMode) {
                            toggleSelect(photo.id);
                          } else {
                            setPreviewIndex(PHOTOS.findIndex(p => p.id === photo.id));
                          }
                        }}
                      >
                        {/* 图片占位 */}
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background: photo.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" opacity="0.35">
                            <rect x="2" y="4" width="20" height="16" rx="2.5" stroke="#555" strokeWidth="1.5" />
                            <circle cx="8.5" cy="10" r="2" stroke="#555" strokeWidth="1.3" />
                            <path d="M2 17l5-5 4 4 3-3 8 7" stroke="#555" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>

                        {/* 选中遮罩 */}
                        {selectMode && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: isSelected ? "rgba(7,193,96,0.22)" : "transparent",
                              transition: "background 0.15s ease",
                            }}
                          />
                        )}

                        {/* 勾选圆圈 */}
                        {selectMode && (
                          <div
                            style={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              background: isSelected ? GREEN : "rgba(255,255,255,0.85)",
                              border: isSelected ? `2px solid ${GREEN}` : "1.5px solid rgba(0,0,0,0.25)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.15s ease",
                              boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                            }}
                          >
                            {isSelected && (
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                    );
              })}
            </div>
            {/* ── 摄影师信息卡片 ── */}
            <div style={{ padding: "20px 16px 8px" }}>
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "16px",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  boxShadow: "0 1px 8px rgba(0,0,0,0.07)",
                }}
              >
                {/* 头像 */}
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #2C3E50 0%, #4A6741 100%)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="12" r="6" fill="rgba(255,255,255,0.85)" />
                    <path d="M4 28c0-6.627 5.373-10 12-10s12 3.373 12 10" fill="rgba(255,255,255,0.85)" />
                  </svg>
                </div>
                {/* 文字信息 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "11px", color: "#9A9A9F", fontFamily: "'Noto Sans SC', sans-serif", marginBottom: "2px" }}>服务提供方</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", lineHeight: 1.2 }}>陈墨熙</div>
                  <div style={{ fontSize: "12px", color: "#6B6B6B", fontFamily: "'Noto Sans SC', sans-serif", marginTop: "2px" }}>高端人像摄影师</div>
                </div>
                {/* 查看更多按钮 */}
                <button
                  onClick={() => { window.location.href = "/photographer"; }}
                  className="active:opacity-75 transition-opacity"
                  style={{
                    flexShrink: 0,
                    height: "38px",
                    padding: "0 18px",
                    background: "#1A1A1A",
                    borderRadius: "999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF", fontFamily: "'Noto Sans SC', sans-serif", whiteSpace: "nowrap" }}>查看更多</span>
                </button>
              </div>
            </div>

            {/* 底部安全距离：足够高度避免工具栏遗挡 */}
            <div style={{ height: "130px" }} />
          </div>
        </div>

        {/* ══ 底部工具栏 ══ */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "0.5px solid rgba(0,0,0,0.07)",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
            paddingBottom: "28px",
          }}
        >
          {/* 倒计时警告提示（仅紧急时显示） */}
          {/* 过期提醒条（始终展示） */}
          {!IS_URGENT ? (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "6px",
                padding: "8px 14px",
                background: "rgba(255,149,0,0.08)",
                borderBottom: "0.5px solid rgba(255,149,0,0.2)",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
                <circle cx="12" cy="12" r="10" stroke="#FF9500" strokeWidth="1.8"/>
                <path d="M12 7v5l3 3" stroke="#FF9500" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: "11px", color: "#B36A00", fontFamily: "'Noto Sans SC', sans-serif", lineHeight: "1.6" }}>
                相册将于 {String(EXPIRE_DATE.getMonth()+1).padStart(2,"0")}-{String(EXPIRE_DATE.getDate()).padStart(2,"0")} {String(EXPIRE_DATE.getHours()).padStart(2,"0")}:00 到期，请及时保存。
              </span>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "6px",
                padding: "8px 14px",
                background: "rgba(255,59,48,0.08)",
                borderBottom: "0.5px solid rgba(255,59,48,0.2)",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
                <circle cx="12" cy="12" r="10" stroke="#FF3B30" strokeWidth="1.8"/>
                <path d="M12 8v4M12 16h.01" stroke="#FF3B30" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: "11px", color: "#CC2200", fontFamily: "'Noto Sans SC', sans-serif", lineHeight: "1.6", fontWeight: 500 }}>
                相册将于今天 {String(EXPIRE_DATE.getHours()).padStart(2,"0")}:00 到期，请尽快保存！
              </span>
            </div>
          )}

          {/* 按钮区：1+2 黄金比例 */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px 0" }}>

            {/* 左侧：分享按钮 */}
            <button
              onClick={() => {
                if (selectMode && selected.length > 0) {
                  // 选择模式且有选中照片：将选中照片写入 sessionStorage 并跳转二次分享页
                  const selectedPhotos = PHOTOS.filter(p => selected.includes(p.id));
                  sessionStorage.setItem("clientSharePhotos", JSON.stringify(selectedPhotos));
                  navigate("/client-share");
                } else {
                  // 非选择模式：复制链接
                  toast("分享链接已复制", { duration: 1800 });
                }
              }}
              className="active:opacity-60 transition-opacity"
              style={{
                width: "64px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                height: "52px",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="18" cy="5" r="2.5"
                  stroke={selectMode && selected.length > 0 ? GREEN : "#333333"}
                  strokeWidth="1.5" />
                <circle cx="6" cy="12" r="2.5"
                  stroke={selectMode && selected.length > 0 ? GREEN : "#333333"}
                  strokeWidth="1.5" />
                <circle cx="18" cy="19" r="2.5"
                  stroke={selectMode && selected.length > 0 ? GREEN : "#333333"}
                  strokeWidth="1.5" />
                <path d="M8.3 13.3l7.4 4.3M15.7 6.4l-7.4 4.3"
                  stroke={selectMode && selected.length > 0 ? GREEN : "#333333"}
                  strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span style={{
                fontSize: "11px",
                color: selectMode && selected.length > 0 ? GREEN : "#555555",
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                fontWeight: selectMode && selected.length > 0 ? 600 : 400,
                transition: "color 0.2s ease",
              }}>分享</span>
            </button>

            {/* 右侧：双拼主按钮（70% 宽），选择模式时合并为单一下载按钮 */}
            {selectMode ? (
              <button
                onClick={handleDownloadSelected}
                className="flex-1 flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
                style={{
                  height: "52px",
                  background: selected.length > 0 ? GREEN : "#E0E0E0",
                  borderRadius: "14px",
                  transition: "background 0.2s ease",
                  boxShadow: selected.length > 0 ? `0 4px 16px rgba(7,193,96,0.38)` : "none",
                }}
              >
                {downloading ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="animate-spin">
                    <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <path d="M12 3a9 9 0 0 1 9 9" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3v13M7 12l5 5 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 19h16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                <span style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF", fontFamily: "'Noto Sans SC', sans-serif" }}>
                  {downloading ? "下载中..." : selected.length > 0 ? `下载 ${selected.length} 张` : "下载所选"}
                </span>
              </button>
            ) : (
              /* 默认模式：极速下载 + 获取原图 双拼胶囊 */
              <div style={{ flex: 1, display: "flex", gap: "8px" }}>
                {/* 极速下载 */}
                <button
                  onClick={() => handleDownload("normal")}
                  className="active:opacity-75 transition-opacity"
                  style={{
                    flex: 1,
                    height: "52px",
                    background: "#F5F5F5",
                    borderRadius: "14px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2px",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3v13M7 12l5 5 5-5" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 19h16" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#1A1A1A", fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif" }}>极速下载</span>
                </button>

                {/* 获取原图 */}
                <button
                  onClick={() => handleDownload("original")}
                  className="active:opacity-80 transition-opacity"
                  style={{
                    flex: 1.2,
                    height: "52px",
                    background: "linear-gradient(160deg, #09D06A 0%, #07C160 100%)",
                    borderRadius: "14px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2px",
                    boxShadow: `0 4px 16px rgba(7,193,96,0.32)`,
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3v13M7 12l5 5 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 19h16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#FFFFFF", fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif" }}>获取原图</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ══ 回到顶部 ══ */}
        {showScrollTop && (
          <button
            onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
            className="absolute right-4 z-30 active:opacity-60 transition-opacity"
            style={{
              bottom: "90px",
              width: "36px", height: "36px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.92)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.14)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 10l5-5 5 5" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* ══ 全屏预览 ══ */}
        {previewIndex !== null && (
          <PhotoPreview
            photos={PHOTOS}
            initialIndex={previewIndex}
            onClose={() => setPreviewIndex(null)}
          />
        )}

        {/* ══ 小程序订阅消息授权弹窗（微信官方样式） ══ */}
        {showAuthModal && (
          <div
            className="absolute inset-0 z-[90] flex items-end"
            style={{
              background: "rgba(0,0,0,0.5)",
              animation: "fadeIn 0.2s ease",
            }}
          >
            {/* 底部弹出卡片 */}
            <div
              className="w-full"
              style={{
                background: "#FFFFFF",
                borderRadius: "16px 16px 0 0",
                paddingBottom: "34px",
                animation: "slideUp 0.32s cubic-bezier(0.32,0.72,0,1)",
              }}
            >
              {/* 头部：小程序图标 + 名称 + 申请文字 */}
              <div
                className="flex items-center gap-3 px-5"
                style={{ paddingTop: "20px", paddingBottom: "16px" }}
              >
                {/* 小程序圆形图标 */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "linear-gradient(145deg, #07C160 0%, #05A050 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 36 36" fill="none">
                    <rect x="6" y="10" width="24" height="18" rx="3" stroke="white" strokeWidth="2.2"/>
                    <circle cx="13" cy="18" r="3" stroke="white" strokeWidth="1.8"/>
                    <path d="M6 24L12 18.5L16 22L20 17.5L30 24" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                    <path d="M18 6V10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif" }}>
                    青竹快传
                  </span>
                  <span style={{ fontSize: "15px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif" }}>
                    {" "}申请
                  </span>
                </div>
              </div>

              {/* 分割线 */}
              <div style={{ height: "0.5px", background: "#E8E8E8", marginBottom: "0" }} />

              {/* 标题 */}
              <div className="px-5" style={{ paddingTop: "16px", paddingBottom: "14px" }}>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif" }}>
                  发送一次以下消息通知
                </p>
              </div>

              {/* 消息列表 */}
              <div className="px-5">
                {[
                  { label: "相册到期提醒", bell: true },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between"
                    style={{
                      paddingTop: 0,
                      paddingBottom: "16px",
                      borderBottom: "none",
                    }}
                  >
                    {/* 左侧：绿色勾 + 消息名 */}
                    <div className="flex items-center gap-3">
                      {/* 微信官方绿色圆形勾 */}
                      <div
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          background: "#07C160",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                          <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span style={{ fontSize: "15px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif" }}>
                        {item.label}
                      </span>
                    </div>

                    {/* 右侧：铃铛状态 */}
                    <div className="flex items-center gap-1.5">
                      {item.bell ? (
                        <>
                          {/* 黄色实心铃 */}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C8.13 2 5 5.13 5 9v5l-2 2v1h18v-1l-2-2V9c0-3.87-3.13-7-7-7z" fill="#FAAD14"/>
                            <path d="M10 19c0 1.1.9 2 2 2s2-.9 2-2" fill="#FAAD14"/>
                          </svg>
                          <span style={{ fontSize: "13px", color: "#FAAD14", fontFamily: "'Noto Sans SC', sans-serif" }}>已设提醒</span>
                        </>
                      ) : (
                        <>
                          {/* 空心铃 */}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C8.13 2 5 5.13 5 9v5l-2 2v1h18v-1l-2-2V9c0-3.87-3.13-7-7-7z" stroke="#AAAAAA" strokeWidth="1.5" fill="none"/>
                            <path d="M10 19c0 1.1.9 2 2 2s2-.9 2-2" stroke="#AAAAAA" strokeWidth="1.5" fill="none"/>
                          </svg>
                          <span style={{ fontSize: "13px", color: "#AAAAAA", fontFamily: "'Noto Sans SC', sans-serif" }}>添加提醒</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 分割线 */}
              <div style={{ height: "0.5px", background: "#E8E8E8" }} />

              {/* 取消 / 允许 按鈕行 */}
              <div
                className="flex gap-3 px-5"
                style={{ paddingTop: "14px", paddingBottom: "6px" }}
              >
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 flex items-center justify-center active:opacity-70 transition-opacity"
                  style={{
                    height: "46px",
                    borderRadius: "8px",
                    background: "#F2F2F2",
                  }}
                >
                  <span style={{ fontSize: "16px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif" }}>取消</span>
                </button>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 flex items-center justify-center active:opacity-80 transition-opacity"
                  style={{
                    height: "46px",
                    borderRadius: "8px",
                    background: "#07C160",
                  }}
                >
                  <span style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", fontFamily: "'Noto Sans SC', sans-serif" }}>允许</span>
                </button>
              </div>

              {/* 底部：“总是保持以上选择，不再询问” */}
              <div
                className="flex items-center justify-center gap-2 px-5"
                style={{ paddingTop: "10px" }}
              >
                {/* 空心圆圈 */}
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    border: "1.5px solid #CCCCCC",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "12px", color: "#9A9A9A", fontFamily: "'Noto Sans SC', sans-serif" }}>
                  总是保持以上选择，不再询问
                </span>
              </div>
            </div>

            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to   { opacity: 1; }
              }
              @keyframes slideUp {
                from { transform: translateY(100%); }
                to   { transform: translateY(0); }
              }
            `}</style>
          </div>
        )}

        {/* ══ 相册权限授权弹窗（小程序居中 Modal 样式） ══ */}
        {showDownloadAuth && (
          <div
            className="absolute inset-0 z-[95] flex items-end"
            style={{
              background: "rgba(0,0,0,0.5)",
              animation: "fadeIn 0.2s ease",
            }}
          >
            <div
              className="w-full"
              style={{
                background: "#FFFFFF",
                borderRadius: "16px 16px 0 0",
                paddingBottom: "34px",
                animation: "slideUp 0.32s cubic-bezier(0.32,0.72,0,1)",
              }}
            >
              <div className="flex items-center gap-3 px-5" style={{ paddingTop: "20px", paddingBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(145deg, #07C160 0%, #05A050 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 36 36" fill="none">
                    <rect x="8" y="4" width="20" height="28" rx="4" stroke="white" strokeWidth="2"/>
                    <circle cx="18" cy="15" r="4" stroke="white" strokeWidth="1.5"/>
                    <circle cx="18" cy="15" r="1.5" fill="white"/>
                  </svg>
                </div>
                <div style={{ fontSize: "16px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif" }}>
                  <span style={{ fontWeight: 700 }}>青竹快传</span><span style={{ fontWeight: 400, color: "#555555" }}> 申请</span>
                </div>
              </div>
              <div style={{ height: "0.5px", background: "#E8E8E8" }} />
              <div className="px-5" style={{ paddingTop: "18px", paddingBottom: "24px" }}>
                <p style={{ fontSize: "15px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", lineHeight: 1.6 }}>申请获得保存图片到相册的权限</p>
              </div>
              <div style={{ height: "0.5px", background: "#E8E8E8" }} />
              <div className="flex gap-3 px-5" style={{ paddingTop: "14px", paddingBottom: "6px" }}>
                <button onClick={() => setShowDownloadAuth(false)} className="flex-1 flex items-center justify-center active:opacity-70" style={{ height: "46px", borderRadius: "8px", background: "#F2F2F2" }}>
                  <span style={{ fontSize: "16px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif" }}>拒绝</span>
                </button>
                <button onClick={() => { setShowDownloadAuth(false); executeDownload(pendingDownloadType); }} className="flex-1 flex items-center justify-center active:opacity-80" style={{ height: "46px", borderRadius: "8px", background: "#07C160" }}>
                  <span style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", fontFamily: "'Noto Sans SC', sans-serif" }}>允许</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ 沉浸式暗房下载弹窗 ══ */}
        {showDarkroom && (
          <div
            className="absolute inset-0 z-[100] flex items-center justify-center"
            style={{
              background: "rgba(8,8,10,0.78)",
              backdropFilter: "blur(22px)",
              WebkitBackdropFilter: "blur(22px)",
              animation: "fadeIn 0.28s ease",
            }}
          >
            {/* 面板 */}
            <div
              style={{
                width: "300px",
                borderRadius: "24px",
                background: "#F7F8FA",
                boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.08)",
                padding: "36px 28px 28px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0",
                animation: "darkroomIn 0.36s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              {/* 动态堆叠相片流 */}
              <div style={{ position: "relative", width: "160px", height: "160px", marginBottom: "28px" }}>
                {/* 底层第三张：最小偏移 */}
                <div style={{
                  position: "absolute",
                  width: "120px", height: "90px",
                  borderRadius: "8px",
                  background: "#D8EDD4",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                  top: "50%", left: "50%",
                  transform: "translate(-50%,-50%) rotate(-8deg) translateY(14px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }} />
                {/* 中层第二张 */}
                <div style={{
                  position: "absolute",
                  width: "128px", height: "96px",
                  borderRadius: "8px",
                  background: "#C3DFBE",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                  top: "50%", left: "50%",
                  transform: "translate(-50%,-50%) rotate(-3deg) translateY(6px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }} />
                {/* 主角：当前正在下载的照片 */}
                <div style={{
                  position: "absolute",
                  width: "140px", height: "105px",
                  borderRadius: "10px",
                  background: darkroomDone
                    ? "linear-gradient(135deg, #07C160 0%, #05A050 100%)"
                    : "linear-gradient(135deg, #2C3E50 0%, #4A6741 60%, #3D5A35 100%)",
                  boxShadow: darkroomDone
                    ? "0 12px 40px rgba(7,193,96,0.45), 0 4px 16px rgba(0,0,0,0.3)"
                    : "0 12px 40px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.3)",
                  top: "50%", left: "50%",
                  transform: "translate(-50%,-50%) rotate(1deg)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.5s ease, box-shadow 0.5s ease",
                  overflow: "hidden",
                }}>
                  {/* 照片占位图标 */}
                  {!darkroomDone && (
                    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" opacity="0.5">
                      <rect x="4" y="8" width="40" height="32" rx="4" stroke="white" strokeWidth="2"/>
                      <circle cx="16" cy="22" r="5" stroke="white" strokeWidth="1.8"/>
                      <path d="M4 34l12-11 9 9 6-6 13 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {darkroomDone && (
                    <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                      <path d="M12 24l9 9 15-15" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>

                {/* 品牌绿细圈进度环 */}
                {!darkroomDone && (
                  <svg
                    width="160" height="160"
                    viewBox="0 0 160 160"
                    style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
                  >
                    {/* 底圈 */}
                    <circle cx="80" cy="80" r="72" stroke="rgba(7,193,96,0.12)" strokeWidth="2" fill="none" />
                    {/* 进度圈 */}
                    <circle
                      cx="80" cy="80" r="72"
                      stroke="#07C160"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 72}`}
                      strokeDashoffset={`${2 * Math.PI * 72 * (1 - (darkroomTotal > 0 ? darkroomCurrent / darkroomTotal : 0))}`}
                      style={{
                        transform: "rotate(-90deg)",
                        transformOrigin: "80px 80px",
                        transition: "stroke-dashoffset 0.3s ease",
                      }}
                    />
                  </svg>
                )}
                {/* 完成态实心绿圈 */}
                {darkroomDone && (
                  <svg
                    width="160" height="160"
                    viewBox="0 0 160 160"
                    style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
                  >
                    <circle cx="80" cy="80" r="72" stroke="#07C160" strokeWidth="2" fill="none" opacity="0.35" />
                  </svg>
                )}
              </div>

              {/* 数字计数 / 完成标题 */}
              {!darkroomDone ? (
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <div style={{ fontSize: "36px", fontWeight: 800, color: "#1A1A1A", fontFamily: "'DIN Alternate', 'Noto Sans SC', sans-serif", lineHeight: 1, letterSpacing: "-1px" }}>
                    <span>{darkroomCurrent}</span>
                    <span style={{ fontSize: "18px", fontWeight: 400, color: "#9A9A9F", margin: "0 4px" }}>/</span>
                    <span style={{ fontSize: "22px", color: "#9A9A9F" }}>{darkroomTotal}</span>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", lineHeight: 1.3 }}>已全部保存</div>
                </div>
              )}

              {/* 精致警告提示 */}
              {!darkroomDone && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "24px" }}>
                  {/* 精致线性警告图标（琥珀灰） */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 20h20L12 2z" stroke="#A08A6A" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                    <path d="M12 9v5" stroke="#A08A6A" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="12" cy="17" r="0.8" fill="#A08A6A"/>
                  </svg>
                  <span style={{ fontSize: "12px", color: "#6B6B6B", fontFamily: "'Noto Sans SC', sans-serif" }}>正在保存光影至相册，请保持页面常亮</span>
                </div>
              )}

              {/* 下方按鈕区 */}
              {!darkroomDone ? (
                /* 下载中：仅显示极微深灰取消文字按鈕 */
                <button
                  onClick={closeDarkroom}
                  className="active:opacity-50 transition-opacity"
                  style={{ fontSize: "13px", color: "#AAAAAA", fontFamily: "'Noto Sans SC', sans-serif", background: "none", border: "none", padding: "4px 8px" }}
                >
                  取消下载
                </button>
              ) : (
                /* 完成态：绿色大按鈕上浮 */
                <button
                  onClick={closeDarkroom}
                  className="w-full flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
                  style={{
                    height: "50px",
                    borderRadius: "14px",
                    background: "linear-gradient(160deg, #09D06A 0%, #07C160 100%)",
                    boxShadow: "0 6px 24px rgba(7,193,96,0.45)",
                    animation: "darkroomIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.8"/>
                  </svg>
                  <span style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", fontFamily: "'Noto Sans SC', sans-serif" }}>欣赏美好瞬间</span>
                </button>
              )}
            </div>

            <style>{`
              @keyframes darkroomIn {
                from { opacity: 0; transform: scale(0.88); }
                to   { opacity: 1; transform: scale(1); }
              }
            `}</style>
          </div>
        )}

      </div>
    </div>
  );
}
