import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/config/site";
import { mdToHtml } from "./markdown";

export type LegalKind = "privacy" | "support" | "terms";

const DIR = path.join(process.cwd(), "content", "legal");

/**
 * 法务正文单一源：content/legal/{kind}.md（vendor 自 handover/calendar-20261111/legal/）。
 * 站点与 App 内 WebView 复用同一份 Markdown；源 SHA 见 content/legal/LEGAL_SOURCE.sha256。
 */
export function legalHtml(kind: LegalKind, l: Locale): string {
  const raw = fs.readFileSync(path.join(DIR, `${kind}.md`), "utf8");
  if (kind === "terms") {
    // 用户条款：文件内 zh（前）/ en（`---` 分隔后半）；去 H1/版本 meta，正文从「## 1.」起
    const parts = raw.split(/\n---\n/);
    const part = (l === "zh" ? parts[0] : parts[1]) ?? "";
    const lines = part.split("\n");
    const startAt = lines.findIndex((line) => line.startsWith("## "));
    return mdToHtml(lines.slice(startAt).join("\n"));
  }
  // privacy / support（legal 1.0）：单文件内两个 H1（zh 在前，en 在后）；去掉正文内 H1 与标题行
  const enHeading = kind === "privacy" ? "\n# Privacy Policy" : "\n# Support & Feedback";
  const at = raw.indexOf(enHeading);
  const zhPart = at >= 0 ? raw.slice(0, at) : raw;
  const enPart = at >= 0 ? raw.slice(at) : "";
  const part = l === "zh" ? zhPart : enPart;
  const lines = part.split("\n");
  const startAt = lines.findIndex((line) => line.startsWith("## "));
  const kept = startAt > 0 ? lines.slice(startAt) : lines.slice(1);
  // 保留正文前的「生效日期/版本」行（H1 与空行之后、首个 ## 之前）
  if (startAt > 1) {
    const pre = lines.slice(1, startAt).filter((line) => line.trim().length > 0 && !line.startsWith("# "));
    return mdToHtml([...pre, ...lines.slice(startAt)].join("\n"));
  }
  return mdToHtml(kept.join("\n"));
}
