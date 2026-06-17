const fs = require("fs");
const path = require("path");

const README_PATH = "/tmp/xingjiabijichang/README.md";
const REVIEWS_DIR = "/tmp/xingjiabijichang/测评";

const PINYIN_IDS = {
  "飞兔云": "feitu-yun",
  "青云梯": "qingyun-ti",
  "紅葉": "hongye",
  "龙猫云": "longmao-yun",
  "EF Network": "ef-network",
  "KTM Cloud": "ktm-cloud",
  "极速云": "jisu-yun",
  "WY Cloud": "wy-cloud",
  "TNTCloud": "tntcloud",
};

function slugify(name) {
  if (PINYIN_IDS[name]) return PINYIN_IDS[name];
  const base = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-");
  if (base) return base;
  // Fallback for unknown CJK names
  return "airport-" + Buffer.from(name).toString("hex").slice(0, 8);
}

function findReviewUrl(name) {
  if (!fs.existsSync(REVIEWS_DIR)) return undefined;
  const files = fs.readdirSync(REVIEWS_DIR);
  const normalized = name.toLowerCase().replace(/\s+/g, "");
  const match = files.find((f) => {
    const base = f.replace(/\.md$/, "").toLowerCase().replace(/\s+/g, "");
    return base === normalized || normalized.includes(base) || base.includes(normalized);
  });
  if (match) {
    return `https://github.com/KaWaIDeSuNe/xingjiabijichang/blob/main/测评/${encodeURIComponent(match)}`;
  }
  return undefined;
}

function parseHeader(line) {
  // ## 一、飞兔云(9.9/月118G)
  const m = line.match(/^##\s*[一二三四五六七八九十]+、\s*(.+?)\s*\(\s*([^/]+)\/月\s*([^)]+)\s*\)/);
  if (!m) return null;
  return {
    name: m[1].trim(),
    price: parseFloat(m[2]),
    traffic: `${m[3].trim()}/月`,
  };
}

function extractUrls(text) {
  const urls = [];
  const re = /\[点击进入\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    urls.push(m[1]);
  }
  return urls;
}

function extractDescription(section) {
  const lines = section.split(/\n/);
  const parts = [];
  for (const line of lines) {
    if (line.startsWith("主观评价:")) {
      parts.push(line.replace(/^主观评价:\s*/, "").trim());
    } else if (line.startsWith("特色：")) {
      parts.push(line.replace(/^特色：\s*/, "").trim());
    } else if (line.startsWith("机场特色：")) {
      parts.push(line.replace(/^机场特色：\s*/, "").trim());
    }
  }
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

function extractBandwidth(section) {
  const m = section.match(/\*最大带宽\*[\s\S]*?-\s*热门节点\s+([^\n]+)/);
  if (m) return m[1].trim();
  return undefined;
}

function extractTags(section) {
  const tags = [];
  if (/中转/.test(section) && !/直连/.test(section)) tags.push("中转");
  if (/专线/.test(section) || /IPLC/.test(section) || /IEPL/.test(section)) tags.push("专线");
  if (/BGP/.test(section)) tags.push("BGP");
  if (/签到送流量/.test(section)) tags.push("签到送流量");
  if (/免费/.test(section) && /试用|流量|公益/.test(section)) tags.push("免费试用");
  if (/大流量|2048G|5000G|1000G/.test(section)) tags.push("大流量");
  if (/冷门节点/.test(section)) tags.push("冷门节点");
  if (/原生IP/.test(section)) tags.push("原生IP");
  if (/家宽/.test(section)) tags.push("家宽节点");
  if (/三网推荐/.test(section)) tags.push("三网推荐");
  if (/解锁.*流|Netflix|Disney|HBO|Hulu|BBC/.test(section)) tags.push("解锁流媒体");
  if (/解锁.*GPT|ChatGPT/.test(section)) tags.push("ChatGPT");
  if (/晚高峰/.test(section) && /不限速|优秀|不卡/.test(section)) tags.push("晚高峰优秀");
  return tags;
}

function extractSupport(section) {
  const support = [];
  if (/ChatGPT|GPT/.test(section)) support.push("ChatGPT");
  if (/YouTube/.test(section)) support.push("YouTube");
  if (/Netflix|奈飞/.test(section)) support.push("Netflix");
  if (/TikTok|抖音/.test(section)) support.push("TikTok");
  if (/Disney/.test(section)) support.push("Disney+");
  if (/HBO/.test(section)) support.push("HBO");
  if (/Hulu/.test(section)) support.push("Hulu");
  if (/BBC/.test(section)) support.push("BBC");
  return support.length ? support : ["YouTube"];
}

function inferScore(section) {
  const text = section;
  if (/数一数二|口碑一直挺好|非常不錯|非常优秀|质量数一数二|强烈推荐/.test(text)) return 4.7;
  if (/质量非常不错|整体非常不错|性价比很高|表现优秀|稳定优质|运营五年/.test(text)) return 4.5;
  if (/总体很不错|还是挺不错|质量还不错/.test(text)) return 4.3;
  return 4.2;
}

function parseSection(section) {
  const header = section.split(/\n/)[0];
  const parsed = parseHeader(header);
  if (!parsed) return null;

  const urls = extractUrls(section);
  if (!urls.length) return null;

  const description = extractDescription(section);
  const bandwidth = extractBandwidth(section);
  const tags = extractTags(section);
  const support = extractSupport(section);
  const score = inferScore(section);
  const reviewUrl = findReviewUrl(parsed.name);

  // Speed field: prefer bandwidth, fallback to "未标注"
  const speed = bandwidth || "未标注";

  return {
    id: slugify(parsed.name),
    name: parsed.name,
    category: "性价比",
    tags,
    price: parsed.price,
    traffic: parsed.traffic,
    speed,
    score,
    support,
    description: description || `${parsed.name}，${parsed.traffic}，性价比机场。`,
    affiliateUrl: urls[0],
    officialUrl: urls[0],
    officialUrls: urls.length > 1 ? urls : undefined,
    reviewUrl,
    bandwidth,
    recommend: score >= 4.5,
  };
}

function main() {
  if (!fs.existsSync(README_PATH)) {
    console.error(`README not found at ${README_PATH}`);
    process.exit(1);
  }

  const content = fs.readFileSync(README_PATH, "utf-8");
  // Split by numbered markdown headers
  const sections = content
    .split(/\n(?=##\s*[一二三四五六七八九十]+、)/g)
    .filter((s) => /^##\s*[一二三四五六七八九十]+、/.test(s.trim()));

  const results = sections.map(parseSection).filter(Boolean);

  console.log(JSON.stringify(results, null, 2));
}

main();
