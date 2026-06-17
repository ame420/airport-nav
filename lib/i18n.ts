export type Lang = "zh" | "en";
export type TranslationKey = keyof typeof translations.zh;

const translations = {
  zh: {
    "site.title": "机场导航站",
    "site.description":
      "精选低价与高性价比机场服务，按价格、流量、速度、线路类型分类整理，帮你快速找到合适的选择。",

    "hero.riskTitle": "风险提示",
    "hero.riskText":
      "任何机场都存在跑路风险，建议优先选择月付套餐。本站仅作信息整理，不对服务质量做任何担保。",

    "bookmark.button": "收藏",
    "bookmark.title": "收藏本页",
    "bookmark.tip": "请使用浏览器快捷键收藏本页：",
    "bookmark.windows": "Windows",
    "bookmark.mac": "Mac",

    "github.button": "GitHub",

    "theme.light": "切换到浅色模式",
    "theme.dark": "切换到深色模式",

    "language.zh": "中文",
    "language.en": "English",
    "language.switch": "切换语言",

    "filter.all": "全部",
    "filter.lowPrice": "低价",
    "filter.value": "性价比",
    "filter.monthly": "月付",
    "filter.relay": "中转",
    "filter.dedicated": "专线",
    "filter.bigTraffic": "大流量",
    "filter.streaming": "解锁流媒体",

    "search.placeholder": "搜索机场名称、标签或描述...",

    "sort.default": "默认排序",
    "sort.priceAsc": "价格从低到高",
    "sort.priceDesc": "价格从高到低",
    "sort.scoreDesc": "评分从高到低",
    "sort.trafficDesc": "流量从大到小",

    "stats.total": "收录机场",
    "stats.dedicated": "专线机场",
    "stats.relay": "中转机场",

    "card.monthlyFee": "月费",
    "card.traffic": "流量",
    "card.speed": "速度",
    "card.score": "评分",
    "card.unlock": "解锁支持",
    "card.bandwidth": "带宽",
    "card.register": "前往注册",
    "card.copy": "复制注册链接",
    "card.copied": "已复制",
    "card.backup": "备用地址",
    "card.review": "查看详细测评",

    "result.found": "找到 {count} 家机场",
    "result.total": "共收录 {count} 家机场",
    "result.empty": "没有找到匹配的机场",
    "result.clear": "清除筛选",
  },
  en: {
    "site.title": "Airport Nav",
    "site.description":
      "A curated list of low-cost and high-value VPN/proxy airport services, sorted by price, traffic, speed, and route type.",

    "hero.riskTitle": "Risk Notice",
    "hero.riskText":
      "All airport services carry a risk of shutdown. Prefer monthly plans. This site only aggregates information and does not guarantee service quality.",

    "bookmark.button": "Bookmark",
    "bookmark.title": "Bookmark this page",
    "bookmark.tip": "Use your browser shortcut to bookmark this page:",
    "bookmark.windows": "Windows",
    "bookmark.mac": "Mac",

    "github.button": "GitHub",

    "theme.light": "Switch to light mode",
    "theme.dark": "Switch to dark mode",

    "language.zh": "中文",
    "language.en": "English",
    "language.switch": "Switch language",

    "filter.all": "All",
    "filter.lowPrice": "Low Price",
    "filter.value": "Best Value",
    "filter.monthly": "Monthly",
    "filter.relay": "Relay",
    "filter.dedicated": "Dedicated",
    "filter.bigTraffic": "Big Traffic",
    "filter.streaming": "Streaming",

    "search.placeholder": "Search by name, tag, or description...",

    "sort.default": "Default",
    "sort.priceAsc": "Price: Low to High",
    "sort.priceDesc": "Price: High to Low",
    "sort.scoreDesc": "Score: High to Low",
    "sort.trafficDesc": "Traffic: High to Low",

    "stats.total": "Airports",
    "stats.dedicated": "Dedicated",
    "stats.relay": "Relay",

    "card.monthlyFee": "Monthly",
    "card.traffic": "Traffic",
    "card.speed": "Speed",
    "card.score": "Score",
    "card.unlock": "Unlocks",
    "card.bandwidth": "Bandwidth",
    "card.register": "Register",
    "card.copy": "Copy link",
    "card.copied": "Copied",
    "card.backup": "Mirror",
    "card.review": "Read review",

    "result.found": "Found {count} airports",
    "result.total": "{count} airports in total",
    "result.empty": "No matching airports",
    "result.clear": "Clear filters",
  },
};

export function t(lang: Lang, key: TranslationKey, params?: Record<string, string | number>) {
  const text = translations[lang][key] ?? translations.zh[key] ?? key;
  if (!params) return text;
  return Object.entries(params).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
    text
  );
}

export function translateCategory(lang: Lang, category: "低价" | "性价比") {
  if (lang === "en") {
    return category === "低价" ? "Low Price" : "Best Value";
  }
  return category;
}
