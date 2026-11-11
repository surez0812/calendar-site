#!/usr/bin/env node
/**
 * P1-7 民俗 web 演示页（B′ 静态度静态页）构建脚本 —— 仅用于 B3 内测，不发布生产。
 * 输入：handover/calendar-20261111/content/drafts/{xiezao,qingming,chuxi}.json（PM 单一源，只读）
 * 输出：ceremony-demo/out/ceremony/{<slug>/index.html, manifest.json}
 * 说明：正文不打包进 App；未到 unlockDate 服务端只发布 teaser（演示页用 state 参数模拟三态）。
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const SRC = process.env.DRAFTS_DIR ?? path.resolve(ROOT, "../../handover/calendar-20261111/content/drafts");
const OUT = process.env.DEMO_OUT ?? path.resolve(ROOT, "../../handover/calendar-20261111/web/ceremony-demo/out");
const DEMO = true; // 演示页强制显示「测试演示」横幅

/** 2027 解锁日（来自 content/drafts/README.md；UTC+8 日期语义） */
const UNLOCK = {
  xiezao: { unlockDate: "2027-01-30", regionalDates: [
    { region: "北方", date: "2027-01-30", note: "腊月廿三" },
    { region: "南方部分地区", date: "2027-01-31", note: "腊月廿四" },
  ]},
  qingming: { unlockDate: "2027-04-05" },
  chuxi: { unlockDate: "2027-02-05" },
};
const SLUGS = ["xiezao", "qingming", "chuxi"];

const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const mdInline = (s = "") => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

function page({ c, unlockDate, regionalDates }) {
  const t = c.title.zh;
  const dateText = regionalDates
    ? regionalDates.map((r) => `${r.region} ${r.date}（${r.note}）`).join(" · ")
    : unlockDate;
  const sections = (c.sections || []).filter((s) => s.type !== "sources");
  const sources = c.sources || [];
  const content = sections.map((s) => `<section><h2>${esc(s.title?.zh ?? "")}</h2>` +
      (s.paragraphs || []).map((p) => `<p>${mdInline(p)}</p>`).join("") +
      ((s.items || []).length && s.ordered ? `<ol>${s.items.map((it) => `<li>${mdInline(it)}</li>`).join("")}</ol>` : "") +
      ((s.items || []).length && !s.ordered ? `<ul>${s.items.map((it) => `<li>${mdInline(it)}</li>`).join("")}</ul>` : "") +
      `</section>`).join("\n");
  const sourcesHtml = `<section class="sources"><h2>来源与许可</h2><ul>${sources.map((s) => `<li><b>${esc(s.title)}</b>${s.edition ? ` · ${esc(s.edition)}` : ""}${s.note ? ` — ${esc(s.note)}` : ""}</li>`).join("")}</ul><p class="license">许可：${esc(c.license)} · 版本 v${esc(c.version)} · 更新于 ${esc(c.updatedAt)}</p></section>`;
  return `<!doctype html>
<html lang="zh-Hans"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex,nofollow"><meta http-equiv="cache-control" content="no-store">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23DE9B78'/%3E%3Ctext x='32' y='45' font-size='34' text-anchor='middle' fill='%23fff' font-family='serif'%3E历%3C/text%3E%3C/svg%3E">
<title>${esc(t)} · 历象（测试演示）</title>
<style>
:root{--bg:#FBF5EC;--card:#FFFDF9;--soft:#F6E7D6;--ink:#3A3028;--ink2:#7A6A5C;--ink3:#8A7462;--line:#EDDFCD;--acc:#DE9B78;--acc2:#C97B5A;--jade:#93A98E;--serif:"Songti SC","STSong","Noto Serif SC",serif;--sans:-apple-system,"PingFang SC","Helvetica Neue",sans-serif}
@media(prefers-color-scheme:dark){:root{--bg:#241C16;--card:#2E241C;--soft:#3A2E24;--ink:#F3E8DA;--ink2:#C7B5A2;--ink3:#9A8774;--line:#43352A;--acc:#E8A886;--acc2:#D98E6C;--jade:#A9BCA3}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink2);font:15px/1.85 var(--sans)}
.demo-banner{position:sticky;top:0;z-index:9;background:var(--acc2);color:#fff;font-size:12px;padding:6px 16px;text-align:center;letter-spacing:.02em}
.wrap{max-width:600px;margin:0 auto;padding:20px 16px 56px}
.crumb{font-size:12px;color:var(--ink3);display:flex;gap:8px;align-items:center}
h1{font-family:var(--serif);font-size:24px;line-height:1.35;color:var(--ink);margin:12px 0 4px;letter-spacing:.02em}
.meta{font-size:12px;color:var(--ink3);display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0}
.chip{display:inline-flex;align-items:center;border-radius:999px;padding:2px 9px;font-size:11px;border:1px solid var(--line);color:var(--ink2)}
.chip.ok{background:rgba(147,169,142,.18);border-color:transparent;color:#4d6448}
.chip.lock{background:rgba(201,123,90,.12);border-color:transparent;color:var(--acc2)}
.headcard{background:linear-gradient(150deg,var(--soft),var(--card));border-radius:22px;padding:18px;margin:16px 0 22px;border:1px solid var(--line)}
.teaser{font-size:16px;color:var(--ink);margin:0 0 10px}
.lock-card{margin-top:12px;border:1px dashed var(--line);border-radius:14px;padding:12px 14px;color:var(--ink2)}
.lock-card b{color:var(--ink)}
section{margin:22px 0}
h2{font-family:var(--serif);font-size:17px;color:var(--ink);margin:0 0 8px}
p{margin:8px 0}
ul,ol{margin:8px 0;padding-left:20px}li{margin:5px 0}
.sources{border-top:1px solid var(--line);padding-top:16px;font-size:13px}
.license{color:var(--ink3);font-size:12px}
.past-note{background:rgba(201,123,90,.1);border-radius:10px;padding:8px 12px;color:var(--acc2);font-size:13px}
.tools{margin:18px 0 0;display:flex;gap:10px;flex-wrap:wrap;font-size:12px}
.tools a{color:var(--acc2);text-decoration:none;border:1px solid var(--line);border-radius:999px;padding:6px 12px}
.tools a[aria-current="true"]{background:var(--acc);border-color:var(--acc);color:#fff}
.demo-note{margin-top:26px;font-size:11.5px;color:var(--ink3);border-top:1px dashed var(--line);padding-top:12px}
[hidden]{display:none !important}
</style></head><body>
${DEMO ? `<div class="demo-banner">测试演示 · 未发布 · 临时内容（仅 B3 内测）</div>` : ""}
<main class="wrap">
<div class="crumb"><span>历象 · 民俗</span><span>›</span><span>${esc(t)}</span></div>
<h1>${esc(t)}</h1>
<div class="headcard">
  <p class="meta"><span id="state-chip" class="chip ok">检查中</span><span class="chip">网页内容</span><span>${esc(dateText)}</span><span>北京时间 · UTC+8</span></p>
  <div id="teaser-wrap" style="margin-top:12px"><p class="teaser">${mdInline(c.teaser.zh)}</p></div>
  <div id="lock-card" class="lock-card" hidden><b>未到解锁日</b><p>该篇在 ${esc(unlockDate)}（北京时间）解锁；届时可查看完整图文。</p></div>
</div>
<div id="content" hidden>
${content}
${sourcesHtml}
</div>
<p id="past-note" class="past-note" hidden>已过解锁日：内容仍可随时回看。</p>
<div class="tools" id="tools">
  <a data-state="locked" href="?state=locked">演示：未到锁定</a>
  <a data-state="unlocked" href="?state=unlocked">演示：已解锁</a>
  <a data-state="past" href="?state=past">演示：已过</a>
</div>
<p class="demo-note">本页仅用于 B3 内测演示：内容为临时测试稿，未上线；生产环境由 ops 在解锁日发布真实内容（未解锁返回 404），manifest 走 no-store。正文仅网页承载，不打包进 App。</p>
</main>
<script>
(function(){
  var q=new URLSearchParams(location.search).get('state');
  var unlockMs=Date.parse("${unlockDate}T00:00:00+08:00");
  var state = (q==='locked'||q==='unlocked'||q==='past') ? q : (Date.now()>=unlockMs?'unlocked':'locked');
  var chip=document.getElementById('state-chip');
  var content=document.getElementById('content'), lock=document.getElementById('lock-card'), past=document.getElementById('past-note');
  if(state==='locked'){chip.textContent='未到解锁';chip.className='chip lock';lock.hidden=false;content.hidden=true;past.hidden=true;}
  else {chip.textContent = state==='past' ? '已过 · 可回看' : '已解锁'; chip.className='chip ok'; lock.hidden=true; content.hidden=false; past.hidden = state!=='past';}
  var links=document.querySelectorAll('.tools a'); for(var i=0;i<links.length;i++){ if(links[i].getAttribute('data-state')===state) links[i].setAttribute('aria-current','true'); }
})();
</script></body></html>`;
}

function landing(entries) {
  const items = entries.map((e) => `<li><a href="./${e.slug}/">${esc(e.title.zh)}</a> <span class="meta">${esc(e.unlockDate)} · ${esc(e.contentVersion)} · ${esc(e.review)}</span></li>`).join("");
  return `<!doctype html><html lang="zh-Hans"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23DE9B78'/%3E%3Ctext x='32' y='45' font-size='34' text-anchor='middle' fill='%23fff' font-family='serif'%3E历%3C/text%3E%3C/svg%3E"><title>民俗演示 · 历象（测试演示）</title>
<style>body{font:15px/1.8 -apple-system,"PingFang SC",sans-serif;background:#FBF5EC;color:#3A3028;max-width:640px;margin:0 auto;padding:24px 16px}.b{background:#C97B5A;color:#fff;font-size:12px;text-align:center;padding:6px;border-radius:6px}a{color:#C97B5A}li{margin:10px 0}.meta{color:#8A7462;font-size:12px}</style></head>
<body><div class="b">测试演示 · 未发布 · 临时内容（仅 B3 内测）</div><h1>民俗 · 按日期解锁（演示）</h1><p>点击进入：可用页面内按钮切换「未到锁定 / 已解锁 / 已过」三态。</p><ul>${items}</ul><p class="meta">manifest：<a href="./manifest.json">/ceremony/manifest.json</a>（no-store）</p></body></html>`;
}

function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, "ceremony"), { recursive: true });
  const manifest = { schemaVersion: 1, generatedAt: new Date().toISOString(), entries: [] };
  for (const slug of SLUGS) {
    const file = path.join(SRC, slug + ".json");
    const raw = fs.readFileSync(file);
    const c = JSON.parse(raw.toString("utf8"));
    const meta = UNLOCK[slug];
    const dir = path.join(OUT, "ceremony", slug);
    fs.mkdirSync(dir, { recursive: true });
    const html = page({ c, ...meta });
    fs.writeFileSync(path.join(dir, "index.html"), html);
    const sha = crypto.createHash("sha256").update(raw).digest("hex");
    manifest.entries.push({
      slug, title: c.title, unlockDate: meta.unlockDate, regionalDates: meta.regionalDates ?? null,
      contentVersion: `v${c.version}`, sha256: sha, updatedAt: c.updatedAt, license: c.license, review: c.review?.status,
    });
  }
  fs.writeFileSync(path.join(OUT, "ceremony", "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(path.join(OUT, "ceremony", "index.html"), landing(manifest.entries));
  console.log("ceremony demo built:", manifest.entries.map((e) => `${e.slug}(${e.unlockDate})`).join(", "), "->", OUT);
}
main();
