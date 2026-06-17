# airport-nav

@AGENTS.md

## 项目概述

`airport-nav` 是一个基于 Next.js 16 的静态导航站，用于整理和展示低价 / 高性价比的机场（VPN/代理服务）信息。

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
data/
  airports.json       # 机场数据源（构建时静态导入）
scripts/
  extract-xingjiabijichang.js  # 从 xingjiabijichang README 提取草稿数据
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
  recommend: boolean;                 // 是否显示 "推荐" 徽章
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

## 注意事项

- 机场类服务存在跑路风险，页面头部已包含风险提示文案。
- 仅作信息整理，不担保服务质量。
- 推荐优先选择月付套餐。
