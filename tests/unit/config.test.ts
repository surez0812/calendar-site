import { describe, expect, test } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { SITE, PUBLIC_SHOTS, isShotPublic } from "@/config/site";
import { legalHtml } from "@/lib/legal";

describe("config 单点", () => {
  test("命名/域名/邮箱按定稿", () => {
    expect(SITE.productName.zh).toBe("历象");
    expect(SITE.productName.en).toBe("Lixiang Almanac");
    expect(SITE.siteBaseUrl).toBe("https://lixiang.zhaoyao.xin");
    expect(SITE.supportEmail).toBe("support@zhaoyao.xin");
  });
  test("prelaunch 口径与开关", () => {
    expect(SITE.releaseState).toBe("prelaunch");
    expect(SITE.appStoreAppId).toBeNull();
    expect(SITE.showDuo).toBe(false);
    expect(SITE.jsonLd.softwareApplication).toBe(false);
    expect(SITE.jsonLd.organization).toBe(true);
    expect(SITE.jsonLd.website).toBe(true);
  });
  test("publicShots：白名单 4 页 + festival* hidden", () => {
    expect(PUBLIC_SHOTS.filter((s) => s.type === "design-mock").map((s) => s.id)).toEqual(["month", "day", "day-b", "anniversary", "settings"]);
    for (const id of ["festivals", "festival", "festival-locked"]) expect(isShotPublic(id)).toBe(false);
  });
  test("禁止 .com 邮箱出现在源码/页面渲染结果", () => {
    // 注意：法务源 Markdown 的「构建说明」里记录了 .com 不可达的证据（不渲染）；这里只扫源码与最终渲染正文。
    const roots = ["src"].map((d) => path.join(process.cwd(), d));
    const walk = (dir: string): string[] =>
      fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = path.join(dir, e.name);
        return e.isDirectory() ? walk(p) : [p];
      });
    const files = roots.flatMap(walk).filter((f) => /\.(ts|tsx|md|css|sha256)$/.test(f));
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) expect(fs.readFileSync(f, "utf8"), f).not.toContain("zhaoyao.com");
    for (const kind of ["privacy", "support"] as const) for (const l of ["zh", "en"] as const) expect(legalHtml(kind, l)).not.toContain("zhaoyao.com");
  });
});
