#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const DATA_PATH = path.resolve(__dirname, "../data/airports.json");
const CACHE_DIR = path.resolve(__dirname, ".cache/repos");

const SOURCES = [
  {
    owner: "KaWaIDeSuNe",
    repo: "dijiajichang",
    category: "低价",
  },
  {
    owner: "KaWaIDeSuNe",
    repo: "xingjiabijichang",
    category: "性价比",
  },
];

// Hand-curated ID overrides so existing entries stay stable.
const ID_OVERRIDES = {
  // xingjiabijichang
  "飞兔云": "feitu-yun",
  "青云梯": "qingyun-ti",
  "紅葉": "hongye",
  "龙猫云": "longmao-yun",
  "EF Network": "ef-network",
  "KTM Cloud": "ktm-cloud",
  "极速云": "jisu-yun",
  "WY Cloud": "wy-cloud",
  "TNTCloud": "tntcloud",
  // dijiajichang
  NanoCloud: "nanocloud",
  牛逼机场: "nbairport",
  动力港: "powerport",
  淘气兔: "taotitu",
};

function slugify(name) {
  if (ID_OVERRIDES[name]) return ID_OVERRIDES[name];
  const base = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-");
  if (base) return base;
  return "airport-" + Buffer.from(name).toString("hex").slice(0, 8);
}

function ensureRepo({ owner, repo }) {
  const dir = path.join(CACHE_DIR, repo);
  const url = `https://github.com/${owner}/${repo}.git`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(path.dirname(dir), { recursive: true });
    console.log(`[clone] ${owner}/${repo}`);
    execSync(`git clone --depth=1 "${url}" "${dir}"`, { stdio: "inherit" });
  } else {
    console.log(`[pull] ${owner}/${repo}`);
    try {
      execSync("git pull --depth=1", { cwd: dir, stdio: "inherit" });
    } catch (err) {
      console.warn(`[warn] git pull failed for ${repo}:`, err.message);
    }
  }
  return dir;
}

function findReviewUrl(repoDir, name, owner, repo) {
  const reviewsDir = path.join(repoDir, "测评");
  if (!fs.existsSync(reviewsDir)) return undefined;
  const files = fs.readdirSync(reviewsDir);
  const normalized = name.toLowerCase().replace(/\s+/g, "");
  const match = files.find((f) => {
    const base = f.replace(/\.md$/, "").toLowerCase().replace(/\s+/g, "");
    return base === normalized || normalized.includes(base) || base.includes(normalized);
  });
  if (match) {
    return `https://github.com/${owner}/${repo}/blob/main/测评/${encodeURIComponent(match)}`;
  }
  return undefined;
}

function parseHeader(line) {
  const m = line.match(
    /^##\s*[一二三四五六七八九十]+、\s*(.+?)\s*\(\s*([^/]+)\/月\s*([^)]+)\s*\)/
  );
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
  if (/专线/.test(section) || /IPLC/.test(section) || /IEPL/.test(section))
    tags.push("专线");
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
  if (/直连/.test(section) && !tags.includes("中转") && !tags.includes("专线"))
    tags.push("直连");
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
  if (/数一数二|口碑一直挺好|非常不錯|非常优秀|质量数一数二|强烈推荐/.test(text))
    return 4.7;
  if (/质量非常不错|整体非常不错|性价比很高|表现优秀|稳定优质|运营五年/.test(text))
    return 4.5;
  if (/总体很不错|还是挺不错|质量还不错/.test(text)) return 4.3;
  return 4.2;
}

function parseRepo(repoDir, source) {
  const readmePath = path.join(repoDir, "README.md");
  if (!fs.existsSync(readmePath)) {
    throw new Error(`README not found at ${readmePath}`);
  }

  const content = fs.readFileSync(readmePath, "utf-8");
  const sections = content
    .split(/\n(?=##\s*[一二三四五六七八九十]+、)/g)
    .filter((s) => /^##\s*[一二三四五六七八九十]+、/.test(s.trim()));

  const results = [];
  for (const section of sections) {
    const header = section.split(/\n/)[0];
    const parsed = parseHeader(header);
    if (!parsed) continue;

    const urls = extractUrls(section);
    if (!urls.length) continue;

    const description = extractDescription(section);
    const bandwidth = extractBandwidth(section);
    const tags = extractTags(section);
    const support = extractSupport(section);
    const score = inferScore(section);
    const reviewUrl = findReviewUrl(
      repoDir,
      parsed.name,
      source.owner,
      source.repo
    );
    const speed = bandwidth || "未标注";

    results.push({
      id: slugify(parsed.name),
      name: parsed.name,
      category: source.category,
      tags,
      price: parsed.price,
      traffic: parsed.traffic,
      speed,
      score,
      support,
      description: description || `${parsed.name}，${parsed.traffic}。`,
      affiliateUrl: urls[0],
      officialUrl: urls[0],
      officialUrls: urls.length > 1 ? urls : undefined,
      reviewUrl,
      bandwidth,
    });
  }

  return results;
}

function loadExisting() {
  if (!fs.existsSync(DATA_PATH)) return [];
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

function merge(existing, drafts) {
  const byId = new Map(existing.map((a) => [a.id, { ...a }]));
  const byName = new Map(existing.map((a) => [a.name, a.id]));

  function mergeUrls(currentUrls, draftUrls) {
    const set = new Set(currentUrls || []);
    for (const url of draftUrls || []) set.add(url);
    return set.size ? Array.from(set) : undefined;
  }

  const added = [];
  const updated = [];

  for (const draft of drafts) {
    const id = byName.get(draft.name) || draft.id;
    const current = byId.get(id);

    if (!current) {
      byId.set(id, draft);
      added.push(draft.name);
      continue;
    }

    // Always refresh fields that come directly from the source README.
    current.name = draft.name;
    current.category = draft.category;
    current.price = draft.price;
    current.traffic = draft.traffic;
    current.affiliateUrl = draft.affiliateUrl;

    // Preserve manually curated fields unless they are missing in the current
    // entry. URLs are merged so newly published backup addresses are picked up.
    current.officialUrl = current.officialUrl || draft.officialUrl;
    current.officialUrls = mergeUrls(current.officialUrls, draft.officialUrls);
    current.description = current.description?.trim()
      ? current.description
      : draft.description;
    current.speed = current.speed || draft.speed;
    current.bandwidth = current.bandwidth || draft.bandwidth;
    current.reviewUrl = current.reviewUrl || draft.reviewUrl;
    current.tags = current.tags?.length ? current.tags : draft.tags;
    current.support = current.support?.length ? current.support : draft.support;
    current.score = current.score != null ? current.score : draft.score;

    updated.push(draft.name);
  }

  // Remove legacy fields.
  for (const a of byId.values()) {
    delete a.recommend;
  }

  return { merged: Array.from(byId.values()), added, updated };
}

function main() {
  const drafts = [];
  for (const source of SOURCES) {
    const repoDir = ensureRepo(source);
    const parsed = parseRepo(repoDir, source);
    console.log(`[parse] ${source.repo}: ${parsed.length} entries`);
    drafts.push(...parsed);
  }

  const existing = loadExisting();
  const { merged, added, updated } = merge(existing, drafts);

  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(merged, null, 2) + "\n", "utf-8");

  console.log("\n[sync] done");
  console.log(`  existing: ${existing.length}`);
  console.log(`  matched sources: ${drafts.length}`);
  console.log(`  added: ${added.length}${added.length ? " — " + added.join(", ") : ""}`);
  console.log(
    `  updated: ${updated.length}${updated.length ? " — " + updated.join(", ") : ""}`
  );
  console.log(`  total in data/airports.json: ${merged.length}`);
}

main();
