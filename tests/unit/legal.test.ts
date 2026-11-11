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
    for (const [file, from] of [["privacy.md", "work/lixiang-ios/App/Resources/Legal/privacy.md"], ["support.md", "work/lixiang-ios/App/Resources/Legal/support.md"], ["terms.md", "user-terms-1.0.md"]]) {
      const actual = sha256(fs.readFileSync(path.join(dir, file)));
      expect(record, `${file} 的源 SHA 未记录`).toContain(actual);
      expect(record).toContain(from);
    }
  });
  test("zh/en 正文可渲染且含关键声明", () => {
    const zh = legalHtml("privacy", "zh");
    const en = legalHtml("privacy", "en");
    expect(zh).toContain("不收集");
    expect(zh).toContain("本政策");
    expect(en.toLowerCase()).toContain("this policy");
    expect(en.toLowerCase()).toContain("do not");
  });
  test("用户条款 1.0：zh/en 可渲染且无内部注记", () => {
    const zh = legalHtml("terms", "zh");
    const en = legalHtml("terms", "en");
    expect(zh).toContain("接受条款");
    expect(zh).toContain("与 Apple 标准许可的关系");
    expect(en).toContain("Acceptance");
    expect(en).toContain("Apple Standard EULA");
    for (const html of [zh, en]) expect(html).not.toMatch(/构建说明|给 webdev|TODO/);
  });
  test("privacy/support 1.0：生效日期与版本行（zh/en），support 含 .xin 邮箱且无 .com", () => {
    expect(legalHtml("privacy", "zh")).toMatch(/2026 年 11 月 12 日/);
    expect(legalHtml("privacy", "zh")).toMatch(/版本：1\.0/);
    expect(legalHtml("privacy", "en")).toMatch(/November 12, 2026/);
    expect(legalHtml("privacy", "en")).toMatch(/Version: 1\.0/);
    for (const l of ["zh", "en"] as const) {
      const html = legalHtml("support", l);
      expect(html).toContain("support@zhaoyao.xin");
      expect(html).not.toContain("zhaoyao.com");
    }
    expect(legalHtml("support", "en")).toMatch(/Version: 1\.0/);
    for (const l of ["zh", "en"] as const) expect(legalHtml("support", l)).not.toMatch(/构建说明|待核实/);
  });
});
