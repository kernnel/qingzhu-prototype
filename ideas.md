# 青竹快传交互原型 · 设计思路

## 设计目标
这是一份 PRD 交互稿，核心受众是产品经理、设计师和开发工程师。
设计风格需要：清晰传达页面结构与业务逻辑、模拟微信小程序的手机端比例、便于在浏览器中浏览和演示。

---

<response>
<probability>0.07</probability>
<text>
**方案 A：文档型原型（Documentation-first Prototype）**

- **Design Movement**：Material You + 产品文档美学
- **Core Principles**：信息密度高、层级清晰、颜色仅用于状态区分
- **Color Philosophy**：近白底色 #F8F9FA，主色用青绿 #00897B，状态色用语义色（绿/橙/灰）
- **Layout Paradigm**：左侧固定导航树，右侧手机模拟器居中，顶部面包屑
- **Signature Elements**：手机壳边框、页面名称标注、状态切换 Tab
- **Interaction Philosophy**：点击导航树直接切换页面，状态切换用顶部 Tab
- **Animation**：页面切换 fade 200ms，无多余动效
- **Typography**：导航用 DM Sans，内容用 Noto Sans SC
</text>
</response>

<response>
<probability>0.06</probability>
<text>
**方案 B：沉浸式手机模拟器（Immersive Phone Simulator）**

- **Design Movement**：iOS Human Interface Guidelines 风格
- **Core Principles**：严格模拟 375px 手机宽度、顶部状态栏、底部安全区
- **Color Philosophy**：深色外壳 #1C1C1E，内容区白底，品牌色竹绿 #4CAF50
- **Layout Paradigm**：页面居中一个手机壳，左右两侧为页面索引卡片
- **Signature Elements**：手机壳高光反射、页面跳转箭头连线、状态栏时间
- **Interaction Philosophy**：点击手机内按钮直接跳转，完全模拟小程序操作路径
- **Animation**：页面切换 slide-in 300ms，模拟微信页面推入动效
- **Typography**：系统字体 -apple-system，内容用 PingFang SC 风格
</text>
</response>

<response>
<probability>0.08</probability>
<text>
**方案 C：工程师友好型原型（Engineering-oriented Prototype）**

- **Design Movement**：Figma Prototype + 工程标注风格
- **Core Principles**：左侧页面地图、右侧手机预览、底部逻辑说明面板
- **Color Philosophy**：浅灰底 #F0F2F5，手机内容区白色，标注色用橙色 #FF6B35
- **Layout Paradigm**：三栏布局：页面树 | 手机模拟器 | 逻辑说明
- **Signature Elements**：流转箭头标注、字段说明 tooltip、状态枚举表格
- **Interaction Philosophy**：点击按钮跳转同时右侧面板更新逻辑说明
- **Animation**：无动效，强调信息密度
- **Typography**：JetBrains Mono 用于标注，Noto Sans SC 用于内容
</text>
</response>

---

## 选定方案：方案 B（沉浸式手机模拟器）

选择理由：
1. 最直观地还原微信小程序的真实操作体验，适合产品评审演示。
2. 手机壳约束了内容宽度（375px），与小程序实际尺寸一致，避免 UI 变形。
3. 左侧页面索引 + 右侧手机模拟器的布局，兼顾导航效率与沉浸感。

## 最终设计规范

- **背景**：深色 #111827（近黑），手机壳 #1F2937
- **手机内容区**：白底 #FFFFFF，宽 375px，高 812px（iPhone X 比例）
- **品牌主色**：竹绿 #22C55E（green-500）
- **状态色**：进行中绿 #22C55E，已过期灰 #9CA3AF，警告橙 #F97316
- **字体**：Noto Sans SC（内容），DM Sans（导航/标注）
- **页面切换**：slide-in-right 250ms ease-out
