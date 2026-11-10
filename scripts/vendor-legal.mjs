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
  { from: "support-prelaunch.md", to: "support.md", expected: "d7c0a64ccfad8d458bbe8d09f83c6fa3187964f55b70484d4248fb40e1d80d68" },
];

const sha = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
fs.mkdirSync(DST, { recursive: true });
const lines = ["# 源：handover/calendar-20261111/legal/（PM 单一源；版本 prelaunch-0.1，2026-11-11 Lead 裁定）"];
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
