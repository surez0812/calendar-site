import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/config/site";
import { mdToHtml } from "./markdown";

export type LegalKind = "privacy" | "support";

const DIR = path.join(process.cwd(), "content", "legal");

/**
 * 法务正文单一源：content/legal/{kind}.md（vendor 自 handover/calendar-20261111/legal/）。
 * 站点与 App 内 WebView 复用同一份 Markdown；源 SHA 见 content/legal/LEGAL_SOURCE.sha256。
 */
export function legalHtml(kind: LegalKind, l: Locale): string {
  const raw = fs.readFileSync(path.join(DIR, `${kind}.md`), "utf8");
  const zhMark = "## 中文（zh-Hans）";
  const enMark = "## English (en)";
  const notesMark = "## 给 webdev 的构建说明";
  const zhAt = raw.indexOf(zhMark);
  const enAt = raw.indexOf(enMark);
  const notesAt = raw.indexOf(notesMark);
  const body =
    l === "zh"
      ? raw.slice(zhAt + zhMark.length, enAt > 0 ? enAt : undefined)
      : raw.slice(enAt + enMark.length, notesAt > 0 ? notesAt : undefined);
  return mdToHtml(body);
}
