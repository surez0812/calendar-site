import { describe, expect, test } from "vitest";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { legalHtml } from "@/lib/legal";

const sha256 = (buf: Buffer) => crypto.createHash("sha256").update(buf).digest("hex");

describe("法务单一源", () => {
  test("站点 vendor 的源 SHA 与记录一致", () => {
    const dir = path.join(process.cwd(), "content", "legal");
    const record = fs.readFileSync(path.join(dir, "LEGAL_SOURCE.sha256"), "utf8");
    for (const [file, from] of [["privacy.md", "privacy-prelaunch.md"], ["support.md", "support-prelaunch.md"]]) {
      const actual = sha256(fs.readFileSync(path.join(dir, file)));
      expect(record, `${file} 的源 SHA 未记录`).toContain(actual);
      expect(record).toContain(from);
    }
  });
  test("zh/en 正文可渲染且含关键声明", () => {
    const zh = legalHtml("privacy", "zh");
    const en = legalHtml("privacy", "en");
    expect(zh).toContain("隐私政策");
    expect(zh).toContain("不收集");
    expect(en).toContain("Privacy Policy");
    expect(en.toLowerCase()).toContain("we do not collect");
  });
  test("support 页含未上架 banner 与 .xin 邮箱；无 .com", () => {
    for (const l of ["zh", "en"] as const) {
      const html = legalHtml("support", l);
      expect(html).toContain("support@zhaoyao.xin");
      expect(html).not.toContain("zhaoyao.com");
    }
    expect(legalHtml("support", "zh")).toMatch(/尚未在 App Store 发布|not yet available on the App Store/);
  });
});
