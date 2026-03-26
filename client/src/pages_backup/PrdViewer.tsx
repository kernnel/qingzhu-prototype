// PrdViewer: 青竹快传 PRD 版本阅读器
// 原样展示 ZIP 中的所有 Markdown 文件，不修改任何内容
// 布局：左侧版本列表导航 + 右侧 Markdown 渲染区

import { useEffect, useState, useRef } from "react";
import { Streamdown } from "streamdown";

interface PrdVersion {
  id: string;
  filename: string;
  content: string;
}

declare global {
  interface Window {
    PRD_VERSIONS?: PrdVersion[];
  }
}

function loadVersions(): Promise<PrdVersion[]> {
  return new Promise((resolve) => {
    if (window.PRD_VERSIONS) {
      resolve(window.PRD_VERSIONS);
      return;
    }
    const script = document.createElement("script");
    script.src = "/prd_data.js";
    script.onload = () => resolve(window.PRD_VERSIONS || []);
    document.head.appendChild(script);
  });
}

export default function PrdViewer() {
  const [versions, setVersions] = useState<PrdVersion[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadVersions().then((vs) => {
      setVersions(vs);
      if (vs.length > 0) setActiveId(vs[vs.length - 1].id); // 默认最新版
    });
  }, []);

  const active = versions.find((v) => v.id === activeId);

  // 解析标题生成目录
  useEffect(() => {
    if (!active) return;
    const lines = active.content.split("\n");
    const items: { id: string; text: string; level: number }[] = [];
    lines.forEach((line) => {
      const m = line.match(/^(#{1,4})\s+(.+)/);
      if (m) {
        const text = m[2].trim();
        const id = text.replace(/[^\w\u4e00-\u9fa5]/g, "-").toLowerCase();
        items.push({ id, text, level: m[1].length });
      }
    });
    setToc(items);
  }, [active]);

  const scrollToHeading = (text: string) => {
    if (!contentRef.current) return;
    const headings = contentRef.current.querySelectorAll("h1,h2,h3,h4");
    for (const h of Array.from(headings)) {
      if (h.textContent?.trim() === text.trim()) {
        h.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
    }
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#f8f9fa",
      fontFamily: "'Noto Sans SC', sans-serif",
      overflow: "hidden",
    }}>
      {/* ── 左侧导航栏 ── */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        background: "#1a1f2e",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #2d3548",
        overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #2d3548" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", letterSpacing: "0.04em" }}>青竹快传</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>PRD 版本归档</div>
        </div>

        {/* 版本列表 */}
        <div style={{ padding: "12px 8px" }}>
          <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 700, letterSpacing: "0.08em", padding: "0 8px", marginBottom: 6, textTransform: "uppercase" }}>
            历史版本
          </div>
          {versions.map((v) => {
            const isActive = v.id === activeId;
            return (
              <button
                key={v.id}
                onClick={() => setActiveId(v.id)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: isActive ? "rgba(34,197,94,0.12)" : "transparent",
                  border: isActive ? "1px solid rgba(34,197,94,0.3)" : "1px solid transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  marginBottom: 2,
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "#22c55e" : "#9ca3af" }}>
                  {v.id}
                </div>
                <div style={{ fontSize: 10, color: "#4b5563", marginTop: 1 }}>{v.filename}</div>
              </button>
            );
          })}
        </div>

        {/* 目录 */}
        {toc.length > 0 && (
          <div style={{ padding: "0 8px 16px", borderTop: "1px solid #2d3548", marginTop: 8, paddingTop: 12 }}>
            <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 700, letterSpacing: "0.08em", padding: "0 8px", marginBottom: 6, textTransform: "uppercase" }}>
              目录
            </div>
            {toc.map((item, i) => (
              <button
                key={i}
                onClick={() => scrollToHeading(item.text)}
                style={{
                  width: "100%",
                  padding: `4px ${8 + (item.level - 1) * 10}px`,
                  background: "transparent",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: item.level === 1 ? 12 : 11,
                  fontWeight: item.level <= 2 ? 600 : 400,
                  color: item.level === 1 ? "#d1d5db" : "#6b7280",
                  lineHeight: 1.5,
                  borderLeft: item.level === 2 ? "2px solid #2d3548" : "none",
                  marginLeft: item.level >= 2 ? 8 : 0,
                }}
              >
                {item.text}
              </button>
            ))}
          </div>
        )}
      </aside>

      {/* ── 右侧内容区 ── */}
      <main style={{ flex: 1, overflowY: "auto", background: "#ffffff" }}>
        {/* 顶部版本标签栏 */}
        <div style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          gap: 4,
          height: 44,
        }}>
          {versions.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveId(v.id)}
              style={{
                padding: "4px 14px",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: v.id === activeId ? 700 : 400,
                color: v.id === activeId ? "#16a34a" : "#6b7280",
                background: v.id === activeId ? "#f0fdf4" : "transparent",
                border: v.id === activeId ? "1px solid #bbf7d0" : "1px solid transparent",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {v.id}
            </button>
          ))}
          {active && (
            <span style={{ marginLeft: "auto", fontSize: 11, color: "#9ca3af" }}>
              {active.filename}
            </span>
          )}
        </div>

        {/* Markdown 内容 */}
        <div
          ref={contentRef}
          style={{ maxWidth: 860, margin: "0 auto", padding: "40px 40px 80px" }}
          className="prd-content"
        >
          {active ? (
            <Streamdown>{active.content}</Streamdown>
          ) : (
            <div style={{ color: "#9ca3af", textAlign: "center", paddingTop: 80 }}>加载中...</div>
          )}
        </div>
      </main>

      <style>{`
        .prd-content h1 {
          font-size: 26px; font-weight: 800; color: #111827;
          margin: 0 0 8px; padding-bottom: 12px;
          border-bottom: 2px solid #f3f4f6;
        }
        .prd-content h2 {
          font-size: 19px; font-weight: 700; color: #1f2937;
          margin: 36px 0 12px; padding-left: 12px;
          border-left: 4px solid #22c55e;
        }
        .prd-content h3 {
          font-size: 15px; font-weight: 700; color: #374151;
          margin: 24px 0 8px;
        }
        .prd-content h4 {
          font-size: 14px; font-weight: 600; color: #4b5563;
          margin: 16px 0 6px;
        }
        .prd-content p {
          font-size: 14px; line-height: 1.8; color: #374151;
          margin: 0 0 12px;
        }
        .prd-content ul, .prd-content ol {
          padding-left: 20px; margin: 8px 0 12px;
        }
        .prd-content li {
          font-size: 14px; line-height: 1.8; color: #374151;
          margin-bottom: 4px;
        }
        .prd-content li > ul, .prd-content li > ol {
          margin: 4px 0;
        }
        .prd-content strong { color: #111827; }
        .prd-content code {
          background: #f3f4f6; color: #dc2626;
          padding: 1px 5px; border-radius: 4px;
          font-size: 13px; font-family: 'JetBrains Mono', monospace;
        }
        .prd-content pre {
          background: #1e293b; border-radius: 8px;
          padding: 16px; overflow-x: auto; margin: 12px 0;
        }
        .prd-content pre code {
          background: none; color: #e2e8f0; padding: 0;
        }
        .prd-content table {
          width: 100%; border-collapse: collapse;
          margin: 12px 0 20px; font-size: 13px;
        }
        .prd-content th {
          background: #f9fafb; color: #374151;
          font-weight: 700; padding: 8px 12px;
          border: 1px solid #e5e7eb; text-align: left;
        }
        .prd-content td {
          padding: 8px 12px; border: 1px solid #e5e7eb;
          color: #4b5563; vertical-align: top;
        }
        .prd-content tr:nth-child(even) td { background: #fafafa; }
        .prd-content blockquote {
          border-left: 4px solid #22c55e;
          background: #f0fdf4; padding: 10px 16px;
          margin: 12px 0; border-radius: 0 8px 8px 0;
          color: #166534; font-size: 13px;
        }
        .prd-content hr {
          border: none; border-top: 1px solid #f3f4f6;
          margin: 28px 0;
        }
        .prd-content a { color: #16a34a; text-decoration: underline; }
      `}</style>
    </div>
  );
}
