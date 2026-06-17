# airport-nav

@AGENTS.md

## 项目概述

**一句话描述**：`airport-nav` 是一个基于 Next.js 16 的静态导航站，用于整理和展示低价 / 高性价比的机场（VPN/代理服务）信息。

- 部署平台：Vercel
- 仓库：`https://github.com/ame420/airport-nav`
- 生产地址：https://airport-nav-kappa.vercel.app

## 技术栈

- **框架**：Next.js 16.2.9（App Router，静态导出）
- **语言**：TypeScript 5
- **样式**：Tailwind CSS v4
- **字体**：Geist / Geist Mono
- **图标**：lucide-react
- **包管理器**：npm

## 项目结构

```
app/
  layout.tsx          # 根布局 + 页面元数据
  page.tsx            # 首页，渲染 Hero + AirportList
  globals.css         # 全局样式
components/
  Hero.tsx            # 页面头部标题、简介、风险提示
  FilterBar.tsx       # 筛选按钮栏（客户端组件）
  AirportList.tsx     # 机场列表 + 筛选逻辑（客户端组件）
  AirportCard.tsx     # 单个机场卡片
  ThemeProvider.tsx   # 主题上下文与 localStorage 持久化
  ThemeToggle.tsx     # 浅色/深色切换按钮
  CopyButton.tsx      # 一键复制链接按钮
  BookmarkButton.tsx  # 收藏/分享按钮
  StatsPanel.tsx      # 顶部统计卡片
  Footer.tsx          # 页脚访问计数
data/
  airports.json       # 机场数据源（构建时静态导入）
scripts/
  extract-xingjiabijichang.js  # 从 xingjiabijichang README 提取草稿数据
  sync.js                      # 自动拉取两个上游仓库并合并到 airports.json
public/               # 静态资源
next.config.ts        # 静态导出配置
```

## 数据来源与更新流程

本站数据主要来自两个参考仓库的 Markdown 内容，手工整理为结构化 JSON：

1. **低价机场**：`https://github.com/KaWaIDeSuNe/dijiajichang`
2. **性价比机场**：`https://github.com/KaWaIDeSuNe/xingjiabijichang`

### 更新步骤

1. 参考对应仓库的 README / 测评文件，更新 `data/airports.json`。
2. 每个机场条目字段见 `components/AirportCard.tsx` 中的 `Airport` interface。
3. 运行 `npm run build` 验证构建是否成功。
4. 提交并推送到 `main`，Vercel 会自动部署。

### 辅助脚本

`scripts/extract-xingjiabijichang.js` 可解析 `xingjiabijichang/README.md`，输出匹配当前 schema 的 JSON 草稿，用于减少手工录入工作量。运行前需要先把仓库克隆到 `/tmp/xingjiabijichang`：

```bash
git clone https://github.com/KaWaIDeSuNe/xingjiabijichang.git /tmp/xingjiabijichang
node scripts/extract-xingjiabijichang.js
```

输出需要人工检查、补充标签 / 评分 / 解锁支持等信息后再合并。

## 核心约定

### 数据 schema

```typescript
interface Airport {
  id: string;                         // URL-safe 唯一标识
  name: string;                       // 机场名称
  category: "低价" | "性价比";        // 分类
  tags: string[];                     // 标签，如 "专线"、"中转"、"大流量"
  price: number;                      // 月费（人民币）
  traffic: string;                    // 流量，如 "100G/月"
  speed: string;                      // 速度描述或 "未标注"
  score: number;                      // 1-5 评分
  support: string[];                  // 解锁支持，如 ["ChatGPT", "Netflix"]
  description: string;                // 一句话介绍
  affiliateUrl: string;               // 推广注册链接（CTA 主按钮）
  officialUrl: string;                // 官网地址
  officialUrls?: string[];            // 多个备用官网地址
  reviewUrl?: string;                 // 详细测评链接（通常指向 GitHub）
  bandwidth?: string;                 // 带宽，如 "5Gbps"
}
```

### 组件约定

- `app/page.tsx` 保持为 Server Component，只负责布局。
- 列表筛选逻辑放在 `components/AirportList.tsx`（Client Component）。
- `FilterBar` 通过 `onFilterChange` 回调与 `AirportList` 通信。
- 所有卡片样式使用 Tailwind CSS，保持 rounded-2xl、shadow-sm 等统一风格。

### 静态导出

```typescript
// next.config.ts
output: 'export',
distDir: 'dist',
images: { unoptimized: true },
```

- 不依赖服务端渲染或 API 路由。
- 所有数据必须在构建时可用。
- 构建产物输出到 `dist/`，已加入 `.gitignore`。

## 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 类型检查
npx tsc --noEmit

# 部署（手动）
vercel --prod
```

## 部署说明

- GitHub 仓库已接入 Vercel Git Integration：推送到 `main` 会自动触发部署。
- 如需手动部署，使用 `vercel --prod`。
- 唯一部署 URL 受 Vercel Deployment Protection 保护，生产域名 `airport-nav-kappa.vercel.app` 可公开访问。

## 代码风格规范

### 命名

- **组件**：PascalCase，语义化，如 `AirportCard`、`ThemeToggle`。
- **Hooks / 工具函数**：camelCase，以动词或 `use` 开头，如 `useTheme`、`parseTraffic`。
- **类型 / 接口**：PascalCase，与对应数据/组件同名，如 `Airport`、`StatsPanelProps`。
- **常量**：SCREAMING_SNAKE_CASE 或 camelCase，如 `STORAGE_KEY`、`filters`。
- **CSS 类**：使用 Tailwind 工具类，复杂状态组合使用模板字符串，避免动态 class 名影响编译器扫描。

### 注释

- 组件文件顶部如需说明用途，使用简洁行内注释或短段落。
- 复杂逻辑（如排序、筛选、合并策略）使用行内注释说明“为什么”。
- 避免无意义注释；优先通过命名自解释。

### 结构

- `app/` 下保持 Server Component，状态管理下沉到 `components/` 的 Client Component。
- 同一功能相关的组件、类型、常量就近组织，不创建过早的抽象层。
- 工具脚本统一放在 `scripts/`，Node 脚本使用 CommonJS（`require`）以减少额外构建步骤。
- 提交前运行 `npx tsc --noEmit` 和 `npm run build`，确保类型与静态导出均通过。

## 踩坑记录

### 主题切换不生效：Tailwind CSS v4 的 dark 模式策略

**现象**：点击 Hero 中的主题切换按钮后，`<html>` 已正确添加/移除 `dark` 类，但页面并未切换为深色样式。

**原因**：Tailwind CSS v4 默认将 `dark:` 变体编译为 `@media (prefers-color-scheme: dark)`，而不是跟随 `.dark` 类。因此手动切换 `dark` 类不会触发任何 `dark:` 样式。

**修复**：在 `app/globals.css` 中显式声明 class 策略：

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

**验证**：构建后检查 CSS，应出现 `.dark\:bg-gray-900:where(.dark,.dark *)` 这类基于 `.dark` 类的选择器，而非包裹在 `@media (prefers-color-scheme: dark)` 中。

**参考**：[Tailwind CSS Dark mode 文档](https://tailwindcss.com/docs/dark-mode)

## 注意事项

- 机场类服务存在跑路风险，页面头部已包含风险提示文案。
- 仅作信息整理，不担保服务质量。
- 推荐优先选择月付套餐。
