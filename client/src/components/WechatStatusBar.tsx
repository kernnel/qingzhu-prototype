/**
 * 微信小程序顶部双排导航规范
 *
 * 第一排：系统状态栏
 *   左：时间（11:02）+ 静音铃铛图标
 *   右：信号格 + 4G 标签 + 电池图标
 *   高度：约 44px（iOS 刘海屏安全区）
 *
 * 第二排：微信小程序导航栏
 *   左：可选的返回箭头 / 头像 / 空白
 *   中：页面标题（可选）
 *   右：微信原生胶囊占位（···|○），高度 32px
 *   高度：44px
 *
 * light=true 时所有颜色切换为白色（深色封面页使用）
 */

interface WechatStatusBarProps {
  light?: boolean;
  /** 第二排中间标题，不传则不显示 */
  title?: string;
  /** 第二排左侧自定义内容（如返回按钮），不传则留空 */
  leftSlot?: React.ReactNode;
  /** 第二排胶囊左侧额外操作按钮（如垃圾桶、搜索等） */
  rightExtra?: React.ReactNode;
}

export default function WechatStatusBar({
  light = false,
  title,
  leftSlot,
  rightExtra,
}: WechatStatusBarProps) {
  const textColor = light ? "#FFFFFF" : "#1C1C1E";
  const subColor = light ? "rgba(255,255,255,0.75)" : "#555555";
  const capsuleBorder = light ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.15)";
  const capsuleBg = light ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.05)";
  const dotColor = light ? "rgba(255,255,255,0.80)" : "#555555";
  const dividerColor = light ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.15)";
  const batteryBorder = light ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.35)";
  const batteryFill = light ? "#FFFFFF" : "#1C1C1E";

  return (
    <div style={{ width: "100%" }}>
      {/* ── 第一排：系统状态栏 ── */}
      <div
        style={{
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "20px",
          paddingRight: "16px",
          paddingTop: "10px",
        }}
      >
        {/* 左：时间 + 静音铃铛 */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: textColor,
              fontFamily: "-apple-system, 'SF Pro Display', 'Noto Sans SC', sans-serif",
              letterSpacing: "0.01em",
            }}
          >
            9:41
          </span>
          {/* 静音铃铛 */}
          <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
            <path
              d="M6.5 1C4.01 1 2 3.01 2 5.5V9L1 10v.5h11V10l-1-1V5.5C11 3.01 8.99 1 6.5 1Z"
              stroke={subColor}
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <path
              d="M5 11c0 .83.67 1.5 1.5 1.5S8 11.83 8 11"
              stroke={subColor}
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            {/* 斜线（静音） */}
            <line x1="1.5" y1="1.5" x2="11.5" y2="12.5" stroke={subColor} strokeWidth="1.1" strokeLinecap="round" />
          </svg>
        </div>

        {/* 右：信号格 + 4G + 电池 */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          {/* 信号格（4格） */}
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
            <rect x="0" y="8" width="3" height="4" rx="0.6" fill={subColor} />
            <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.6" fill={subColor} />
            <rect x="9" y="3" width="3" height="9" rx="0.6" fill={subColor} />
            <rect x="13.5" y="0" width="3" height="12" rx="0.6" fill={subColor} />
          </svg>

          {/* 4G 标签 */}
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: subColor,
              fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            4G
          </span>

          {/* 电池图标 */}
          <div style={{ display: "flex", alignItems: "center", gap: "1px" }}>
            <div
              style={{
                width: "24px",
                height: "12px",
                borderRadius: "3px",
                border: `1.5px solid ${batteryBorder}`,
                position: "relative",
                display: "flex",
                alignItems: "center",
                padding: "1.5px",
              }}
            >
              {/* 电量填充（约 76%） */}
              <div
                style={{
                  width: "72%",
                  height: "100%",
                  borderRadius: "1.5px",
                  background: batteryFill,
                }}
              />
            </div>
            {/* 电池正极小头 */}
            <div
              style={{
                width: "2px",
                height: "5px",
                borderRadius: "0 1px 1px 0",
                background: batteryBorder,
              }}
            />
          </div>
        </div>
      </div>

      {/* ── 第二排：微信小程序导航栏 ── */}
      <div
        style={{
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "12px",
          paddingRight: "8px",
        }}
      >
        {/* 左：自定义插槽（返回按钮 / 头像 / 空白） */}
        <div style={{ width: "60px", display: "flex", alignItems: "center" }}>
          {leftSlot ?? null}
        </div>

        {/* 中：页面标题 */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          {title && (
            <span
              style={{
                fontSize: "17px",
                fontWeight: 600,
                color: textColor,
                fontFamily: "'Noto Sans SC', -apple-system, sans-serif",
                letterSpacing: "-0.2px",
              }}
            >
              {title}
            </span>
          )}
        </div>

        {/* 胶囊左侧额外操作按钮 */}
        {rightExtra && (
          <div style={{ marginRight: "8px" }}>{rightExtra}</div>
        )}

        {/* 右：微信原生胶囊占位（···|○） */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            height: "32px",
            padding: "0 12px",
            background: capsuleBg,
            border: `1px solid ${capsuleBorder}`,
            borderRadius: "999px",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          {/* ··· 三点 */}
          <div style={{ display: "flex", alignItems: "center", gap: "3.5px" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: dotColor,
                }}
              />
            ))}
          </div>

          {/* 分割线 */}
          <div
            style={{
              width: "0.5px",
              height: "16px",
              background: dividerColor,
            }}
          />

          {/* ○ 圆圈 */}
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              border: `1.5px solid ${dotColor}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
