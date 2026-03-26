/**
 * 青竹快传 · 摄影师介绍页
 * 入口：图片分享页底部「查看更多」按钮
 * 结构：
 * 1. 顶部导航（返回 + 分享）
 * 2. 大头像（圆角方形）
 * 3. 姓名 + 职业（绿色）
 * 4. 城市/标签胶囊
 * 5. 个人简介引言
 * 6. 三列数据统计（相册数 / 总照片 / 从业年限）
 * 7. 联系方式（微信 + 小红书，带复制按钮）
 * 8. 底部「添加摄影师微信」绿色按钮
 */

import WechatStatusBar from "@/components/WechatStatusBar";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const GREEN = "#07C160";

export default function PhotographerProfile() {
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState<"wechat" | "xiaohongshu" | null>(null);
  const [addingWechat, setAddingWechat] = useState(false);

  const handleCopy = (type: "wechat" | "xiaohongshu", value: string) => {
    setCopied(type);
    toast(`已复制${type === "wechat" ? "微信号" : "小红书号"}`, { duration: 1800 });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleAddWechat = () => {
    setAddingWechat(true);
    setTimeout(() => {
      setAddingWechat(false);
      toast("微信号已复制，请前往微信添加好友", { duration: 2500 });
    }, 1000);
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
        fontFamily: "'Noto Sans SC', sans-serif",
      }}
    >
      <WechatStatusBar
        leftSlot={
          <button
            onClick={() => navigate("/share")}
            className="active:opacity-50 transition-opacity"
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
          >
            <svg width="11" height="18" viewBox="0 0 11 18" fill="none">
              <path d="M9 2L2 9L9 16" stroke="#1A1A1A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        }
      />

      {/* 可滚动内容区 */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>

        {/* 大头像 */}
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 20px" }}>
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "linear-gradient(145deg, #2C4A3E 0%, #3D6B5A 40%, #4A8060 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              overflow: "hidden",
            }}
          >
            {/* 摄影师插画占位 */}
            <svg width="72" height="80" viewBox="0 0 72 80" fill="none">
              {/* 身体 */}
              <rect x="20" y="44" width="32" height="36" rx="8" fill="rgba(255,255,255,0.9)" />
              {/* 头部 */}
              <circle cx="36" cy="28" r="16" fill="rgba(255,255,255,0.9)" />
              {/* 相机 */}
              <rect x="26" y="52" width="20" height="14" rx="3" fill="rgba(7,193,96,0.8)" />
              <circle cx="36" cy="59" r="4" fill="rgba(255,255,255,0.7)" />
              <rect x="30" y="49" width="8" height="4" rx="1.5" fill="rgba(7,193,96,0.8)" />
            </svg>
          </div>
        </div>

        {/* 姓名 + 职业 */}
        <div style={{ textAlign: "center", padding: "0 24px 12px" }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#1A1A1A", letterSpacing: "0.5px" }}>
            沈青墨
          </div>

        </div>

        {/* 城市/标签胶囊 */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              background: "#FFFFFF",
              borderRadius: "999px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
            }}
          >
            {/* 定位图标 */}
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
              <path d="M6 0C3.79 0 2 1.79 2 4c0 3 4 8 4 8s4-5 4-8c0-2.21-1.79-4-4-4Z" fill={GREEN} />
              <circle cx="6" cy="4" r="1.5" fill="white" />
            </svg>
            <span style={{ fontSize: "12px", color: "#4A4A4A", fontWeight: 400 }}>
              上海
            </span>
          </div>
        </div>

        {/* 个人简介 */}
        <div style={{ padding: "0 28px 24px" }}>
          <p
            style={{
              fontSize: "14px",
              color: "#5A5A5A",
              lineHeight: 1.8,
              textAlign: "center",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            "捕捉光影间的静谧美学，记录每一个不可复制的生命瞬间。在极简中寻求情感的张力。"
          </p>
        </div>

        {/* 两列数据统计 */}
        <div style={{ padding: "0 16px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[
            { value: "42", label: "相册数" },
            { value: "2.8k", label: "总照片" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "#FFFFFF",
                borderRadius: "14px",
                padding: "16px 12px",
                textAlign: "center",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#1A1A1A",
                  fontFamily: "'DIN Alternate', 'SF Pro Display', 'Noto Sans SC', sans-serif",
                  lineHeight: 1.1,
                }}
              >
                {item.value}
              </div>
              <div style={{ fontSize: "11px", color: "#9A9A9F", marginTop: "4px" }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* 联系方式 */}
        <div style={{ padding: "0 16px 24px" }}>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", marginBottom: "12px" }}>
            联系方式
          </div>

          {/* 微信 */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "14px",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "10px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            }}
          >
            {/* 微信图标 */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "#07C160",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                <path d="M8 1C4.13 1 1 3.69 1 7c0 1.89 1.02 3.57 2.63 4.72L3 14l2.7-1.35C6.41 12.87 7.18 13 8 13c.34 0 .68-.02 1-.06A5.5 5.5 0 0 0 9 14c0 2.76 2.69 5 6 5 .67 0 1.31-.1 1.9-.27L19 20l-.5-2.1A4.98 4.98 0 0 0 21 14c0-2.76-2.69-5-6-5-.19 0-.37.01-.55.03C14.05 6.72 11.27 4.5 8 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "11px", color: "#9A9A9F", marginBottom: "2px" }}>微信</div>
              <div style={{ fontSize: "15px", fontWeight: 500, color: "#1A1A1A" }}>ShenQingMo_Photo</div>
            </div>
            <button
              onClick={() => handleCopy("wechat", "ShenQingMo_Photo")}
              className="active:opacity-70 transition-opacity"
              style={{
                padding: "6px 16px",
                background: copied === "wechat" ? "#E6F9F0" : "#F2F2F7",
                borderRadius: "8px",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 500, color: copied === "wechat" ? GREEN : "#4A4A4A" }}>
                {copied === "wechat" ? "已复制" : "复制"}
              </span>
            </button>
          </div>

          {/* 小红书 */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "14px",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            }}
          >
            {/* 小红书图标 */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #FF2442 0%, #FF6B81 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.6" />
                <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "11px", color: "#9A9A9F", marginBottom: "2px" }}>小红书</div>
              <div style={{ fontSize: "15px", fontWeight: 500, color: "#1A1A1A" }}>沈青墨在拍照</div>
            </div>
            <button
              onClick={() => handleCopy("xiaohongshu", "沈青墨在拍照")}
              className="active:opacity-70 transition-opacity"
              style={{
                padding: "6px 16px",
                background: copied === "xiaohongshu" ? "#E6F9F0" : "#F2F2F7",
                borderRadius: "8px",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 500, color: copied === "xiaohongshu" ? GREEN : "#4A4A4A" }}>
                {copied === "xiaohongshu" ? "已复制" : "复制"}
              </span>
            </button>
          </div>
        </div>

        {/* 底部安全距离 */}
        <div style={{ height: "100px" }} />
      </div>

      {/* 底部「添加摄影师微信」按钮 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 16px 32px",
          background: "linear-gradient(to top, rgba(247,248,250,1) 70%, rgba(247,248,250,0) 100%)",
        }}
      >
        <button
          onClick={handleAddWechat}
          className="w-full active:opacity-85 transition-opacity"
          style={{
            height: "52px",
            background: addingWechat ? "rgba(7,193,96,0.85)" : GREEN,
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 4px 20px rgba(7,193,96,0.42)",
            transition: "all 0.2s ease",
          }}
        >
          {addingWechat ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="animate-spin">
                <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                <path d="M12 3a9 9 0 0 1 9 9" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF" }}>处理中...</span>
            </>
          ) : (
            <>
              {/* 加号图标 */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", fontFamily: "'Noto Sans SC', sans-serif" }}>
                添加摄影师微信
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
