/**
 * 青竹快传 · 编辑个人资料
 * 字段：头像 / 昵称 / 省市（二联）/ 个人简介 / 身份标签 / 小红书 / 微信
 * 布局：一屏内完整呈现，无需滚动
 */

import WechatStatusBar from "@/components/WechatStatusBar";
import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";

const GREEN = "#07C160";

// ─────────────────────────────────────────────────────────────
// 省市数据（二联）
// ─────────────────────────────────────────────────────────────
const REGION_DATA: Record<string, string[]> = {
  "北京市": ["北京市"],
  "上海市": ["上海市"],
  "广东省": ["广州市", "深圳市", "佛山市", "东莞市", "珠海市", "惠州市"],
  "浙江省": ["杭州市", "宁波市", "温州市", "绍兴市", "嘉兴市", "金华市"],
  "江苏省": ["南京市", "苏州市", "无锡市", "常州市", "南通市", "扬州市"],
  "四川省": ["成都市", "绵阳市", "德阳市", "宜宾市", "泸州市"],
  "湖北省": ["武汉市", "宜昌市", "襄阳市", "荆州市"],
  "陕西省": ["西安市", "咸阳市", "宝鸡市", "延安市"],
  "山东省": ["济南市", "青岛市", "烟台市", "潍坊市", "济宁市"],
  "福建省": ["福州市", "厦门市", "泉州市", "漳州市"],
  "湖南省": ["长沙市", "株洲市", "湘潭市", "衡阳市"],
  "河南省": ["郑州市", "洛阳市", "开封市", "南阳市"],
  "重庆市": ["重庆市"],
  "天津市": ["天津市"],
};
const PROVINCES = Object.keys(REGION_DATA);

// ─────────────────────────────────────────────────────────────
// 身份标签预设
// ─────────────────────────────────────────────────────────────
const IDENTITY_TAGS = ["人像摄影师", "婚礼摄影师", "商业摄影师", "风光摄影师", "纪实摄影师", "儿童摄影师", "旅拍摄影师", "产品摄影师"];

// ─────────────────────────────────────────────────────────────
// 单列滚轮
// ─────────────────────────────────────────────────────────────
const ITEM_H = 44;

function WheelColumn({ items, selectedIndex, onChange }: {
  items: string[];
  selectedIndex: number;
  onChange: (i: number) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startScroll = useRef(0);
  const isDragging = useRef(false);
  const velocity = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const rafId = useRef<number>(0);

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const scrollToIndex = useCallback((idx: number, animated = true) => {
    const el = listRef.current;
    if (!el) return;
    el.style.transition = animated ? "transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)" : "none";
    el.style.transform = `translateY(${-idx * ITEM_H}px)`;
  }, []);

  useEffect(() => { scrollToIndex(selectedIndex, false); }, [selectedIndex, scrollToIndex]);
  useEffect(() => { scrollToIndex(0, false); }, [items, scrollToIndex]);

  const snapToNearest = () => {
    const el = listRef.current;
    if (!el) return;
    cancelAnimationFrame(rafId.current);
    const match = el.style.transform.match(/translateY\((-?\d+(?:\.\d+)?)px\)/);
    let offset = match ? parseFloat(match[1]) : 0;
    const decelerate = () => {
      velocity.current *= 0.92;
      offset += velocity.current;
      const maxOffset = -(items.length - 1) * ITEM_H;
      offset = clamp(offset, maxOffset, 0);
      el.style.transition = "none";
      el.style.transform = `translateY(${offset}px)`;
      if (Math.abs(velocity.current) > 0.5) {
        rafId.current = requestAnimationFrame(decelerate);
      } else {
        const idx = clamp(Math.round(-offset / ITEM_H), 0, items.length - 1);
        scrollToIndex(idx);
        onChange(idx);
      }
    };
    rafId.current = requestAnimationFrame(decelerate);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    cancelAnimationFrame(rafId.current);
    isDragging.current = true;
    startY.current = e.clientY;
    lastY.current = e.clientY;
    lastTime.current = Date.now();
    velocity.current = 0;
    const match = listRef.current?.style.transform.match(/translateY\((-?\d+(?:\.\d+)?)px\)/);
    startScroll.current = match ? parseFloat(match[1]) : 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !listRef.current) return;
    const dy = e.clientY - startY.current;
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) velocity.current = (e.clientY - lastY.current) / dt * 16;
    lastY.current = e.clientY;
    lastTime.current = now;
    const maxOffset = -(items.length - 1) * ITEM_H;
    const newOffset = clamp(startScroll.current + dy, maxOffset - 40, 40);
    listRef.current.style.transition = "none";
    listRef.current.style.transform = `translateY(${newOffset}px)`;
  };
  const onPointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    snapToNearest();
  };

  return (
    <div className="relative flex-1 overflow-hidden" style={{ height: `${ITEM_H * 5}px` }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
      <div ref={listRef} style={{ willChange: "transform", paddingTop: `${ITEM_H * 2}px`, paddingBottom: `${ITEM_H * 2}px`, userSelect: "none", touchAction: "none" }}>
        {items.map((item, i) => (
          <div key={item + i} style={{ height: `${ITEM_H}px`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0 4px" }}
            onClick={() => { scrollToIndex(i); onChange(i); }}>
            {item}
          </div>
        ))}
      </div>
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: `${ITEM_H * 2}px`, background: "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: `${ITEM_H * 2}px`, background: "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)" }} />
      <div className="absolute left-0 right-0 pointer-events-none" style={{ top: `${ITEM_H * 2}px`, height: `${ITEM_H}px`, borderTop: "0.5px solid rgba(0,0,0,0.1)", borderBottom: "0.5px solid rgba(0,0,0,0.1)", background: "rgba(0,0,0,0.03)" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 省市二联 Picker 弹窗
// ─────────────────────────────────────────────────────────────
function RegionPicker({ province, city, onConfirm, onClose }: {
  province: string; city: string;
  onConfirm: (p: string, c: string) => void;
  onClose: () => void;
}) {
  const [up, setUp] = useState(false);
  useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setUp(true))); }, []);

  const [pIdx, setPIdx] = useState(() => Math.max(0, PROVINCES.indexOf(province)));
  const [cIdx, setCIdx] = useState(0);

  const cities = REGION_DATA[PROVINCES[pIdx]] || [];

  useEffect(() => {
    const initCities = REGION_DATA[province] || [];
    const ci = Math.max(0, initCities.indexOf(city));
    setCIdx(ci);
  }, []);

  const handleProvinceChange = (i: number) => { setPIdx(i); setCIdx(0); };

  return (
    <>
      <div className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{ background: up ? "rgba(0,0,0,0.38)" : "rgba(0,0,0,0)" }} onClick={onClose} />
      <div className="fixed left-0 right-0 bottom-0 z-50 transition-transform duration-300 ease-out"
        style={{ transform: up ? "translateY(0)" : "translateY(100%)", maxWidth: "390px", margin: "0 auto", background: "#FFFFFF", borderRadius: "20px 20px 0 0", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5" style={{ height: "52px", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
          <button style={{ fontSize: "16px", color: "#8A8A8A", fontFamily: "'Noto Sans SC', sans-serif" }} onClick={onClose}>取消</button>
          <span style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif" }}>选择城市</span>
          <button style={{ fontSize: "16px", color: GREEN, fontWeight: 600, fontFamily: "'Noto Sans SC', sans-serif" }}
            onClick={() => { onConfirm(PROVINCES[pIdx], cities[cIdx] || ""); onClose(); }}>确定</button>
        </div>
        <div className="flex" style={{ padding: "0 16px 32px" }}>
          <WheelColumn items={PROVINCES} selectedIndex={pIdx} onChange={handleProvinceChange} />
          <WheelColumn items={cities} selectedIndex={cIdx} onChange={setCIdx} />
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// 头像选择弹窗
// ─────────────────────────────────────────────────────────────
function AvatarSheet({ onWechat, onCamera, onAlbum, onClose }: {
  onWechat: () => void; onCamera: () => void; onAlbum: () => void; onClose: () => void;
}) {
  const [up, setUp] = useState(false);
  useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setUp(true))); }, []);

  const items = [
    { label: "使用微信头像", sub: "自动同步微信最新头像", color: GREEN, badge: "推荐", action: onWechat },
    { label: "拍摄照片", sub: "使用相机拍摄新头像", color: "#1A1A1A", badge: null, action: onCamera },
    { label: "从相册选择", sub: "从手机相册中选取图片", color: "#1A1A1A", badge: null, action: onAlbum },
  ];
  return (
    <>
      <div className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{ background: up ? "rgba(0,0,0,0.38)" : "rgba(0,0,0,0)" }} onClick={onClose} />
      <div className="fixed left-0 right-0 bottom-0 z-50 transition-transform duration-300 ease-out"
        style={{ transform: up ? "translateY(0)" : "translateY(100%)", maxWidth: "390px", margin: "0 auto" }}>
        <div className="mx-3 mb-3 rounded-2xl overflow-hidden"
          style={{ background: "rgba(249,249,249,0.97)", backdropFilter: "blur(20px)" }}
          onClick={(e) => e.stopPropagation()}>
          <div className="text-center py-3" style={{ borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
            <p style={{ fontSize: "13px", color: "#8A8A8A", fontFamily: "'Noto Sans SC', sans-serif" }}>更换头像</p>
          </div>
          {items.map((item, i) => (
            <button key={i} className="w-full flex items-center px-4 active:bg-gray-50 transition-colors"
              style={{ minHeight: "58px", borderBottom: i < items.length - 1 ? "0.5px solid rgba(0,0,0,0.06)" : "none" }}
              onClick={() => { item.action(); onClose(); }}>
              <div className="flex-1 text-left">
                <p style={{ fontSize: "15px", color: item.color, fontFamily: "'Noto Sans SC', sans-serif", fontWeight: item.color === GREEN ? 500 : 400 }}>{item.label}</p>
                <p style={{ fontSize: "12px", color: "#B0B0B0", marginTop: "1px", fontFamily: "'Noto Sans SC', sans-serif" }}>{item.sub}</p>
              </div>
              {item.badge && <span style={{ fontSize: "10px", color: GREEN, background: "rgba(7,193,96,0.08)", padding: "2px 8px", borderRadius: "20px", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 500 }}>{item.badge}</span>}
            </button>
          ))}
        </div>
        <div className="mx-3 mb-8 rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <button className="w-full py-4 text-center active:opacity-70 transition-opacity"
            style={{ background: "rgba(249,249,249,0.97)", backdropFilter: "blur(20px)", fontSize: "17px", color: "#007AFF", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 600 }}
            onClick={onClose}>取消</button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// 状态栏
// ─────────────────────────────────────────────────────────────
function StatusBar() {
  return <WechatStatusBar />;
}

// ─────────────────────────────────────────────────────────────
// 表单行（紧凑版，高度 50px）
// ─────────────────────────────────────────────────────────────
function FormRow({ label, isFirst, isLast, children }: {
  label: string; isFirst?: boolean; isLast?: boolean; children: React.ReactNode;
}) {
  const r = isFirst && isLast ? "14px" : isFirst ? "14px 14px 0 0" : isLast ? "0 0 14px 14px" : "0";
  return (
    <div className="flex items-center px-4"
      style={{ minHeight: "50px", background: "#FFFFFF", borderRadius: r, borderBottom: isLast ? "none" : "0.5px solid rgba(0,0,0,0.06)" }}>
      <span style={{ fontSize: "14px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 400, width: "60px", flexShrink: 0 }}>
        {label}
      </span>
      <div className="flex-1 flex justify-end items-center">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 主页面
// ─────────────────────────────────────────────────────────────
export default function ProfileEdit() {
  const [, navigate] = useLocation();
  const [showAvatarSheet, setShowAvatarSheet] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [avatarSource, setAvatarSource] = useState<"wechat" | "custom">("wechat");
  const [nickname, setNickname] = useState("陈墨熙");
  const [province, setProvince] = useState("北京市");
  const [city, setCity] = useState("北京市");
  const [bio, setBio] = useState("高端人像摄影师，专注于捕捉真实情感");
  const [identityTag, setIdentityTag] = useState("高端人像摄影师");
  const [xiaohongshu, setXiaohongshu] = useState("");
  const [wechat, setWechat] = useState("");
  const [qrCode, setQrCode] = useState<"none" | "uploaded">("none");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => navigate("/user-center"), 600);
  };

  const inputStyle: React.CSSProperties = {
    fontSize: "14px", color: "#1A1A1A", background: "transparent",
    border: "none", outline: "none", fontFamily: "'Noto Sans SC', sans-serif",
    textAlign: "right", width: "100%",
  };
  const placeholderColor = "#C0C0C0";

  return (
    <div style={{
      background: "#F7F8FA", fontFamily: "'Noto Sans SC', sans-serif",
      maxWidth: "390px", margin: "0 auto", height: "100dvh",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <StatusBar />

      {/* 导航栏 */}
      <div className="flex items-center justify-between px-4 flex-shrink-0 relative" style={{ height: "44px" }}>
        <button className="flex items-center gap-0.5 active:opacity-60 transition-opacity" onClick={() => navigate("/user-center")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: "16px", color: "#1A1A1A" }}>返回</span>
        </button>
        <h1 style={{ fontSize: "17px", fontWeight: 600, color: "#1A1A1A", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          编辑资料
        </h1>
        <div style={{ width: "40px" }} />
      </div>

      {/* 内容区（固定高度，不滚动） */}
      <div className="flex-1 flex flex-col" style={{ padding: "12px 16px 16px", gap: "12px", overflow: "hidden" }}>

        {/* 头像 独立居中 */}
        <div className="flex flex-col items-center" style={{ paddingTop: "4px", paddingBottom: "4px", flexShrink: 0 }}>
          <button className="active:opacity-75 transition-opacity" onClick={() => setShowAvatarSheet(true)}>
            <div style={{ position: "relative", width: "72px", height: "72px" }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: avatarSource === "wechat" ? "linear-gradient(145deg, #3D3D3D 0%, #1C1C1E 100%)" : "linear-gradient(145deg, #07C160 0%, #05A84F 100%)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="15" r="7" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
                  <path d="M5 36c0-8.284 6.716-12 15-12s15 3.716 15 12" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ position: "absolute", bottom: 2, right: 2, width: "22px", height: "22px", borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 1px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                  <path d="M9.5 1.5a1.5 1.5 0 0 1 2.12 2.12L4 11.24l-2.5.5.5-2.5L9.5 1.5Z" stroke="#1A1A1A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </button>
          <p style={{ fontSize: "12px", color: "#9A9A9F", marginTop: "8px", fontFamily: "'Noto Sans SC', sans-serif" }}>点击更换头像</p>
        </div>

        {/* 基本信息：昵称单独一行 */}
        <div style={{ borderRadius: "14px", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", flexShrink: 0 }}>
          <div className="flex items-center px-4" style={{ minHeight: "50px", background: "#FFFFFF" }}>
            <span style={{ fontSize: "14px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", width: "60px", flexShrink: 0 }}>昵称</span>
            <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="请输入昵称" maxLength={20}
              style={{ flex: 1, fontSize: "14px", color: "#1A1A1A", background: "transparent", border: "none", outline: "none", fontFamily: "'Noto Sans SC', sans-serif", textAlign: "right" }} />
          </div>
        </div>

        {/* 个人简介 */}
        <div style={{ background: "#FFFFFF", borderRadius: "14px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", flexShrink: 0 }}>
          <div className="px-4 pt-3 pb-1">
            <span style={{ fontSize: "11px", color: "#9A9A9F", fontFamily: "'Noto Sans SC', sans-serif" }}>个人简介</span>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="介绍一下自己..."
            maxLength={60}
            rows={2}
            style={{
              width: "100%", background: "transparent", border: "none", outline: "none",
              fontSize: "14px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif",
              resize: "none", padding: "4px 16px 12px", lineHeight: "1.6",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* 社交 + 城市 */}
        <div style={{ borderRadius: "14px", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", flexShrink: 0 }}>
          {/* 所在城市 */}
          <button className="w-full flex items-center px-4 active:bg-gray-50 transition-colors"
            style={{ minHeight: "50px", background: "#FFFFFF", borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}
            onClick={() => setShowRegionPicker(true)}>
            <span style={{ fontSize: "14px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", width: "60px", flexShrink: 0, textAlign: "left" }}>城市</span>
            <span className="flex-1 text-right" style={{ fontSize: "14px", color: city ? "#1A1A1A" : placeholderColor, fontFamily: "'Noto Sans SC', sans-serif" }}>
              {city ? `${province === city ? city : `${province} ${city}`}` : "请选择城市"}
            </span>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ marginLeft: "6px", flexShrink: 0 }}>
              <path d="M5.5 3.5L9 7l-3.5 3.5" stroke="#D8D8DD" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* 小红书 */}
          <FormRow label="小红书" isFirst={false}>
            <input value={xiaohongshu} onChange={(e) => setXiaohongshu(e.target.value)} placeholder="小红书账号"
              style={{ ...inputStyle, fontSize: "14px" }} />
          </FormRow>

          {/* 微信 */}
          <FormRow label="微信号" isLast={false}>
            <input value={wechat} onChange={(e) => setWechat(e.target.value)} placeholder="微信号"
              style={{ ...inputStyle, fontSize: "14px" }} />
          </FormRow>

          {/* 微信二维码 */}
          <div
            className="flex items-center px-4"
            style={{ minHeight: "64px", background: "#FFFFFF", borderTop: "0.5px solid rgba(0,0,0,0.06)" }}
          >
            <span style={{ fontSize: "14px", color: "#1A1A1A", fontFamily: "'Noto Sans SC', sans-serif", width: "80px", flexShrink: 0 }}>微信二维码</span>
            <div className="flex-1" />
            {/* 二维码预览区 */}
            {qrCode === "uploaded" ? (
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: "48px", height: "48px", borderRadius: "8px",
                    background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1.5px solid #07C160",
                  }}
                >
                  {/* 二维码占位图标 */}
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <rect x="2" y="2" width="12" height="12" rx="2" stroke="#07C160" strokeWidth="1.8"/>
                    <rect x="5" y="5" width="6" height="6" rx="1" fill="#07C160"/>
                    <rect x="18" y="2" width="12" height="12" rx="2" stroke="#07C160" strokeWidth="1.8"/>
                    <rect x="21" y="5" width="6" height="6" rx="1" fill="#07C160"/>
                    <rect x="2" y="18" width="12" height="12" rx="2" stroke="#07C160" strokeWidth="1.8"/>
                    <rect x="5" y="21" width="6" height="6" rx="1" fill="#07C160"/>
                    <path d="M18 18h4v4h-4zM22 22h4v4h-4zM18 26h4" stroke="#07C160" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
                {/* 删除按鈕 */}
                <button
                  onClick={() => setQrCode("none")}
                  style={{
                    position: "absolute", top: "-6px", right: "-6px",
                    width: "18px", height: "18px", borderRadius: "50%",
                    background: "#FF3B30", border: "1.5px solid #FFFFFF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                    <path d="M2 2l6 6M8 2l-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setQrCode("uploaded")}
                style={{
                  width: "48px", height: "48px", borderRadius: "8px",
                  background: "#F7F7F8", border: "1.5px dashed #D0D0D5",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: "2px", cursor: "pointer",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                  <path d="M11 5v12M5 11h12" stroke="#AEAEB2" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: "9px", color: "#AEAEB2", fontFamily: "'Noto Sans SC', sans-serif" }}>上传</span>
              </button>
            )}
          </div>
        </div>

        {/* 保存按钮 */}
        <button onClick={handleSave} style={{
          width: "100%", height: "48px", flexShrink: 0,
          background: saved ? "#B0B0B0" : GREEN,
          borderRadius: "14px", fontSize: "15px", fontWeight: 600, color: "#FFFFFF",
          fontFamily: "'Noto Sans SC', sans-serif",
          boxShadow: saved ? "none" : "0 4px 14px rgba(7,193,96,0.32)",
          transition: "all 0.2s ease",
        }}>
          {saved ? "已保存 ✓" : "保存资料"}
        </button>
      </div>

      {/* 头像弹窗 */}
      {showAvatarSheet && (
        <AvatarSheet
          onWechat={() => setAvatarSource("wechat")}
          onCamera={() => setAvatarSource("custom")}
          onAlbum={() => setAvatarSource("custom")}
          onClose={() => setShowAvatarSheet(false)}
        />
      )}

      {/* 省市二联 Picker */}
      {showRegionPicker && (
        <RegionPicker
          province={province} city={city}
          onConfirm={(p, c) => { setProvince(p); setCity(c); }}
          onClose={() => setShowRegionPicker(false)}
        />
      )}
    </div>
  );
}
