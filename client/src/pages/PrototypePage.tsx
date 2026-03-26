// PrototypePage: 青竹快传交互原型主页面
// Design: 深色背景 + 左侧导航 + 居中手机模拟器
// 品牌主色: 竹绿 #22C55E | 字体: Noto Sans SC + DM Sans

import { useState } from "react";
import PhoneFrame from "@/components/PhoneFrame";
import { HERO_BG } from "@/lib/mockData";

// B端页面
import BHome from "./screens/BHome";
import BWechatLogin from "./screens/BWechatLogin";
import BUserCenter from "./screens/BUserCenter";
import BMembership from "./screens/BMembership";
import BAlbumDetail from "./screens/BAlbumDetail";

// C端页面
import CShareView from "./screens/CShareView";
import CClientShare from "./screens/CClientShare";
import CClientAlbumList from "./screens/CClientAlbumList";
import CPhotographerHome from "./screens/CPhotographerHome";

// ---- Page Registry ----
type PageId =
  | "b-home" | "b-login" | "b-user" | "b-membership" | "b-album"
  | "c-share" | "c-client-share" | "c-album-list" | "c-photographer";

interface NavItem {
  id: PageId;
  label: string;
  section: "B端（摄影师）" | "C端（顾客）";
  sub?: string;
}

const navItems: NavItem[] = [
  { id: "b-home", label: "3.1 产品首页", section: "B端（摄影师）", sub: "首次进入 / 未登录" },
  { id: "b-login", label: "3.2 微信授权登录", section: "B端（摄影师）", sub: "手机号授权" },
  { id: "b-user", label: "3.3 个人中心", section: "B端（摄影师）", sub: "相册瀑布流 / 额度" },
  { id: "b-membership", label: "3.4 会员购买", section: "B端（摄影师）", sub: "套餐选择 / 支付" },
  { id: "b-album", label: "3.5 相册详情", section: "B端（摄影师）", sub: "上传 / 编辑 / 分享" },
  { id: "c-share", label: "4.1 相册分享落地", section: "C端（顾客）", sub: "浏览 / 下载 / 分享" },
  { id: "c-client-share", label: "4.2 二次分享", section: "C端（顾客）", sub: "选图分享" },
  { id: "c-album-list", label: "4.3 顾客相册列表", section: "C端（顾客）", sub: "历史浏览记录" },
  { id: "c-photographer", label: "4.4 摄影师主页", section: "C端（顾客）", sub: "联系 / 作品集" },
];

// ---- Page titles & nav config ----
const pageConfig: Record<PageId, { title: string; showBack: boolean; showHome: boolean; bgColor?: string; noNav?: boolean }> = {
  "b-home": { title: "", showBack: false, showHome: false, bgColor: "#ffffff", noNav: true },
  "b-login": { title: "登录", showBack: true, showHome: false, bgColor: "#ffffff" },
  "b-user": { title: "我的", showBack: false, showHome: false, bgColor: "#f9fafb" },
  "b-membership": { title: "升级会员", showBack: true, showHome: false, bgColor: "#f9fafb" },
  "b-album": { title: "相册详情", showBack: true, showHome: false, bgColor: "#f9fafb" },
  "c-share": { title: "查看相册", showBack: false, showHome: true, bgColor: "#f9fafb" },
  "c-client-share": { title: "分享照片", showBack: true, showHome: false, bgColor: "#ffffff" },
  "c-album-list": { title: "我的相册", showBack: false, showHome: false, bgColor: "#f9fafb" },
  "c-photographer": { title: "摄影师主页", showBack: true, showHome: false, bgColor: "#f9fafb" },
};

// ---- History stack ----
export default function PrototypePage() {
  const [history, setHistory] = useState<PageId[]>(["b-home"]);
  const [albumId, setAlbumId] = useState("album-001");
  const [shareIndices, setShareIndices] = useState<number[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const current = history[history.length - 1];
  const cfg = pageConfig[current];

  const go = (id: PageId) => setHistory(prev => [...prev, id]);
  const goBack = () => setHistory(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  const goHome = () => setHistory(["c-album-list"]);
  const jumpTo = (id: PageId) => setHistory([id]);

  // ---- Render current screen ----
  const renderScreen = () => {
    switch (current) {
      case "b-home":
        return <BHome onNewAlbum={() => go("b-album")} onUserCenter={() => go("b-user")} />;
      case "b-login":
        return <BWechatLogin onLoginSuccess={() => go("b-user")} onBack={goBack} />;
      case "b-user":
        return <BUserCenter
          onAlbumClick={(id) => { setAlbumId(id); go("b-album"); }}
          onNewAlbum={() => { setAlbumId("album-002"); go("b-album"); }}
          onSettings={() => {}}
          onUpgrade={() => go("b-membership")}
        />;
      case "b-membership":
        return <BMembership onBack={goBack} onSuccess={goBack} />;
      case "b-album":
        return <BAlbumDetail albumId={albumId} onBack={goBack} onUpgrade={() => go("b-membership")} />;
      case "c-share":
        return <CShareView
          albumId={albumId}
          onHome={goHome}
          onPhotographer={() => go("c-photographer")}
          onShare={(indices) => { setShareIndices(indices); go("c-client-share"); }}
        />;
      case "c-client-share":
        return <CClientShare selectedIndices={shareIndices} onHome={goHome} />;
      case "c-album-list":
        return <CClientAlbumList
          onAlbumClick={(id) => { setAlbumId(id); go("c-share"); }}
          onCreateAlbum={() => go("b-home")}
        />;
      case "c-photographer":
        return <CPhotographerHome
          onAlbumClick={(id) => { setAlbumId(id); go("c-share"); }}
          onBack={goBack}
        />;
    }
  };

  const bItems = navItems.filter(n => n.section === "B端（摄影师）");
  const cItems = navItems.filter(n => n.section === "C端（顾客）");

  return (
    <div style={{
      minHeight: "100vh",
      background: `url(${HERO_BG}) center/cover no-repeat fixed`,
      display: "flex",
      fontFamily: "'Noto Sans SC', 'DM Sans', sans-serif",
      position: "relative",
    }}>
      {/* Dark overlay */}
      <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.88)", zIndex: 0 }} />

      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 260 : 0,
        minWidth: sidebarOpen ? 260 : 0,
        overflow: "hidden",
        transition: "width 0.25s ease, min-width 0.25s ease",
        position: "relative",
        zIndex: 10,
        flexShrink: 0,
      }}>
        <div style={{
          width: 260,
          height: "100vh",
          position: "sticky",
          top: 0,
          background: "rgba(17,24,39,0.95)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }} className="sidebar-scroll">
          {/* Logo */}
          <div style={{ padding: "28px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>青竹快传</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>PRD v8.5 交互原型</div>
              </div>
            </div>
          </div>

          {/* Nav sections */}
          {[
            { label: "B端（摄影师）", items: bItems, color: "#22c55e" },
            { label: "C端（顾客）", items: cItems, color: "#60a5fa" },
          ].map(section => (
            <div key={section.label} style={{ padding: "16px 12px 8px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", padding: "0 8px", marginBottom: 6, textTransform: "uppercase" }}>
                {section.label}
              </div>
              {section.items.map(item => {
                const isActive = current === item.id;
                return (
                  <button key={item.id} onClick={() => jumpTo(item.id)} style={{
                    width: "100%",
                    padding: "9px 10px",
                    borderRadius: 10,
                    background: isActive ? `${section.color}18` : "transparent",
                    border: isActive ? `1px solid ${section.color}40` : "1px solid transparent",
                    textAlign: "left",
                    cursor: "pointer",
                    marginBottom: 3,
                    transition: "all 0.15s",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? section.color : "rgba(255,255,255,0.65)" }}>
                      {item.label}
                    </div>
                    {item.sub && (
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{item.sub}</div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Footer */}
          <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>
              基于 PRD v8.5 构建<br />
              仅供产品评审与开发参考
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "40px 24px", position: "relative", zIndex: 10, minHeight: "100vh" }}>
        {/* Top bar */}
        <div style={{ width: "100%", maxWidth: 500, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "6px 10px", color: "rgba(255,255,255,0.7)", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            {sidebarOpen ? "收起" : "展开"}导航
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>当前页面：</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "white", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", padding: "4px 10px", borderRadius: 20 }}>
              {navItems.find(n => n.id === current)?.label || current}
            </div>
          </div>
        </div>

        {/* Phone + page info */}
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", width: "100%", maxWidth: 800, justifyContent: "center" }}>
          {/* Phone */}
          <div className="page-enter" key={current}>
            <PhoneFrame
              title={cfg.title}
              showBack={cfg.showBack}
              showHome={cfg.showHome}
              bgColor={cfg.bgColor}
              onBack={goBack}
              onHome={goHome}
              noNav={cfg.noNav}
            >
              {renderScreen()}
            </PhoneFrame>
          </div>

          {/* Info panel */}
          <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12, paddingTop: 8 }}>
            {/* Page info */}
            <div style={{ background: "rgba(17,24,39,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, fontWeight: 700, letterSpacing: "0.06em" }}>页面说明</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 6 }}>
                {navItems.find(n => n.id === current)?.label}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                {getPageDesc(current)}
              </div>
            </div>

            {/* Flow hints */}
            <div style={{ background: "rgba(17,24,39,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, fontWeight: 700, letterSpacing: "0.06em" }}>可跳转至</div>
              {getFlowTargets(current).map(t => (
                <button key={t.id} onClick={() => jumpTo(t.id as PageId)}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.65)", fontSize: 12, textAlign: "left", marginBottom: 4, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#22c55e", fontSize: 10 }}>→</span>{t.label}
                </button>
              ))}
            </div>

            {/* History */}
            {history.length > 1 && (
              <div style={{ background: "rgba(17,24,39,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, fontWeight: 700, letterSpacing: "0.06em" }}>导航历史</div>
                {history.slice(-5).reverse().map((h, i) => (
                  <div key={i} style={{ fontSize: 11, color: i === 0 ? "#22c55e" : "rgba(255,255,255,0.35)", padding: "3px 0", display: "flex", alignItems: "center", gap: 4 }}>
                    {i === 0 && <span style={{ fontSize: 9 }}>●</span>}
                    {i > 0 && <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>○</span>}
                    {navItems.find(n => n.id === h)?.label || h}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ---- Helper: page descriptions ----
function getPageDesc(id: PageId): string {
  const descs: Record<PageId, string> = {
    "b-home": "产品首页。未登录状态下展示品牌信息与核心功能入口。点击「新建相册」触发登录校验；点击头像区域流转至个人中心。",
    "b-login": "微信授权登录页。须勾选协议方可发起微信手机号授权流程；未勾选时阻断操作并提示。",
    "b-user": "个人中心页。展示今日额度（环形进度）、数据统计、相册瀑布流。无相册时展示空状态引导。触底加载，单页20条。",
    "b-membership": "会员购买页。标准版/满足版套餐对比，发起微信支付流程，成功后流转回个人中心。",
    "b-album": "相册详情与管理页。4列照片网格，触底加载单页50条。支持编辑模式多选、添加照片（含额度校验）、一键分享。空相册展示引导状态。",
    "c-share": "相册分享落地页（C端入口）。顾客通过分享链接进入，可浏览、下载、选图二次分享。即将过期时展示预警提示。",
    "c-client-share": "二次分享页。展示顾客从相册中选中的照片，可转发给他人。",
    "c-album-list": "顾客相册列表页。展示历史浏览记录，无记录时展示空状态引导。",
    "c-photographer": "摄影师主页。展示摄影师资料、统计数据、联系方式（复制微信号）和公开作品集。",
  };
  return descs[id] || "";
}

// ---- Helper: flow targets ----
function getFlowTargets(id: PageId): { id: string; label: string }[] {
  const flows: Record<PageId, { id: string; label: string }[]> = {
    "b-home": [{ id: "b-login", label: "3.2 微信授权登录" }, { id: "b-user", label: "3.3 个人中心" }],
    "b-login": [{ id: "b-user", label: "3.3 个人中心（授权成功）" }],
    "b-user": [{ id: "b-album", label: "3.5 相册详情" }, { id: "b-membership", label: "3.4 会员购买" }],
    "b-membership": [{ id: "b-user", label: "3.3 个人中心（开通成功）" }],
    "b-album": [{ id: "b-membership", label: "3.4 会员购买（额度超限）" }, { id: "c-share", label: "4.1 分享落地页（预览）" }],
    "c-share": [{ id: "c-client-share", label: "4.2 二次分享" }, { id: "c-photographer", label: "4.4 摄影师主页" }],
    "c-client-share": [{ id: "c-share", label: "4.1 相册落地页" }],
    "c-album-list": [{ id: "c-share", label: "4.1 相册落地页" }, { id: "b-home", label: "3.1 产品首页（摄影师入口）" }],
    "c-photographer": [{ id: "c-share", label: "4.1 相册落地页" }],
  };
  return flows[id] || [];
}
