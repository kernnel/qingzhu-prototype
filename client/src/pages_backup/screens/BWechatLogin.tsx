// B端 3.2 微信授权登录页
import { Camera, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Props { onLoginSuccess: () => void; onBack: () => void; }

export default function BWechatLogin({ onLoginSuccess, onBack }: Props) {
  const [agreed, setAgreed] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    if (!agreed) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    onLoginSuccess();
  };

  return (
    <div style={{ minHeight: 700, display: "flex", flexDirection: "column", background: "#fff", padding: "60px 32px 40px" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, boxShadow: "0 8px 24px rgba(34,197,94,0.3)" }}>
          <Camera size={36} color="white" />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 8, fontFamily: "'Noto Sans SC', sans-serif" }}>欢迎使用青竹快传</h2>
        <p style={{ fontSize: 14, color: "#6b7280", textAlign: "center", lineHeight: 1.6 }}>专为摄影师打造的照片交付工具<br />登录后即可创建相册、上传照片</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <button onClick={handleLogin} style={{ height: 52, borderRadius: 26, background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", fontSize: 17, fontWeight: 700, border: "none", boxShadow: "0 8px 20px rgba(34,197,94,0.35)", fontFamily: "'Noto Sans SC', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M8.5 14.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm7 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zM12 2C6.5 2 2 6 2 11c0 2.8 1.3 5.3 3.4 7l-.9 3.3 3.6-1.8c1.2.4 2.5.5 3.9.5 5.5 0 10-4 10-9S17.5 2 12 2z"/></svg>
          微信快捷登录
        </button>

        <div
          style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 4px", borderRadius: 8, transition: "all 0.1s", animation: shake ? "shake 0.5s" : "none" }}
          className={shake ? "shake-anim" : ""}
        >
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, accentColor: "#22c55e", width: 16, height: 16, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>
            我已阅读并同意
            <span style={{ color: "#22c55e" }}>《用户服务协议》</span>
            与
            <span style={{ color: "#22c55e" }}>《隐私政策》</span>
          </span>
        </div>
        {shake && (
          <p style={{ fontSize: 12, color: "#ef4444", textAlign: "center", margin: "-8px 0 0" }}>请先阅读并同意《用户服务协议》与《隐私政策》</p>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-6px)}
          40%{transform:translateX(6px)}
          60%{transform:translateX(-4px)}
          80%{transform:translateX(4px)}
        }
        .shake-anim { animation: shake 0.5s; }
      `}</style>
    </div>
  );
}
