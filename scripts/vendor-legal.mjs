#!/usr/bin/env node
/** 法务单一源 vendor：handover/calendar-20261111/legal/*.md → content/legal/*.md + LEGAL_SOURCE.sha256。
 *  源是唯一正文（站点与 App 内 WebView 共用）；源 SHA 变更必须重新 vendor 并提交。 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const SRC = path.resolve(process.env.LEGAL_SRC ?? path.join(process.cwd(), "../../handover/calendar-20261111/legal"));
/** legal 1.0 单一源：App 清理版（Lead/PM 维护，官网与 App 同源） */
const SRC_APP = path.resolve(process.env.LEGAL_SRC_APP ?? path.join(process.cwd(), "../../work/lixiang-ios/App/Resources/Legal"));
const DST = path.join(process.cwd(), "content", "legal");
const MAP = [
  { from: "privacy.md", srcDir: SRC_APP, label: "work/lixiang-ios/App/Resources/Legal/privacy.md", to: "privacy.md", expected: "5fd4e78c6cefda5cc10efb89062535628201774f2ea887eba456d7354b8a0a4b" },
  { from: "support.md", srcDir: SRC_APP, label: "work/lixiang-ios/App/Resources/Legal/support.md", to: "support.md", expected: "2557ed55157679359f294c7f051c04801de8311cb3bf03080eb7269b84f2d529" },
  { from: "user-terms-1.0.md", to: "terms.md", expected: "4fd2e28367c4b86d6fbdc816560fed26c583a0678549c07ec7a85d158ba13365", fixedVersion: "1.0" },
];

const sha = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
fs.mkdirSync(DST, { recursive: true });
// 版本号：优先 env LEGAL_VERSION（legal/README.md 未及时更新时由 PM 指定的权威版本），否则读 README。
let version = process.env.LEGAL_VERSION ?? "unknown";
if (!process.env.LEGAL_VERSION) {
  try {
    const readme = fs.readFileSync(path.join(SRC, "README.md"), "utf8");
    version = /版本：`([^`]+)`/.exec(readme)?.[1] ?? "unknown";
  } catch { /* README 缺失时仍 vendor，但版本标 unknown */ }
}
const lines = [`# 源：handover/calendar-20261111/legal/（PM 单一源；版本 ${version} + terms 1.0；以 legal/README.md 为唯一参照）`];
for (const m of MAP) {
  const srcPath = path.join(m.srcDir ?? SRC, m.from);
  const buf = fs.readFileSync(srcPath);
  const h = sha(buf);
  fs.writeFileSync(path.join(DST, m.to), buf);
  lines.push(`${h}  ${m.label ?? m.from}  ->  content/legal/${m.to}${m.fixedVersion ? `  (v${m.fixedVersion})` : ""}`);
  if (m.expected && h !== m.expected) {
    console.warn(`WARN: ${m.label ?? m.from} SHA 与 PM 提供值不一致\n  expected ${m.expected}\n  actual   ${h}`);
  }
  console.log(`${m.label ?? m.from} -> content/legal/${m.to}  sha256=${h}`);
}
fs.writeFileSync(path.join(DST, "LEGAL_SOURCE.sha256"), lines.join("\n") + "\n");
console.log("wrote content/legal/LEGAL_SOURCE.sha256");
