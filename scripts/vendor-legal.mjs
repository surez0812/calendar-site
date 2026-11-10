#!/usr/bin/env node
/** 法务单一源 vendor：handover/calendar-20261111/legal/*.md → content/legal/*.md + LEGAL_SOURCE.sha256。
 *  源是唯一正文（站点与 App 内 WebView 共用）；源 SHA 变更必须重新 vendor 并提交。 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const SRC = path.resolve(process.env.LEGAL_SRC ?? path.join(process.cwd(), "../../handover/calendar-20261111/legal"));
const DST = path.join(process.cwd(), "content", "legal");
const MAP = [
  { from: "privacy-prelaunch.md", to: "privacy.md", expected: "f9f642ebef046863b9ec9a0c9b136717e0825157541d9694b7c860fb623543fb" },
  { from: "support-prelaunch.md", to: "support.md", expected: "cc109fe03aa5ab3188d9a59be354d5df8dc530cf2233e2ba30a02fca4afe207d" },
];

const sha = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
fs.mkdirSync(DST, { recursive: true });
// 版本号只从唯一参照 legal/README.md 读取（避免手抄漂移）
let version = "unknown";
try {
  const readme = fs.readFileSync(path.join(SRC, "README.md"), "utf8");
  version = /版本：`([^`]+)`/.exec(readme)?.[1] ?? "unknown";
} catch { /* README 缺失时仍 vendor，但版本标 unknown */ }
const lines = [`# 源：handover/calendar-20261111/legal/（PM 单一源；版本 ${version}；以 legal/README.md 为唯一参照）`];
for (const m of MAP) {
  const srcPath = path.join(SRC, m.from);
  const buf = fs.readFileSync(srcPath);
  const h = sha(buf);
  fs.writeFileSync(path.join(DST, m.to), buf);
  lines.push(`${h}  ${m.from}  ->  content/legal/${m.to}`);
  if (m.expected && h !== m.expected) {
    console.warn(`WARN: ${m.from} SHA 与 PM 提供值不一致\n  expected ${m.expected}\n  actual   ${h}`);
  }
  console.log(`${m.from} -> content/legal/${m.to}  sha256=${h}`);
}
fs.writeFileSync(path.join(DST, "LEGAL_SOURCE.sha256"), lines.join("\n") + "\n");
console.log("wrote content/legal/LEGAL_SOURCE.sha256");
