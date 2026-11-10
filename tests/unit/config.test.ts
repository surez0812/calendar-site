import { describe, expect, test } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { SITE, PUBLIC_SHOTS, EXCLUDED_ASSETS, isShotRendered } from "@/config/site";
import { legalHtml } from "@/lib/legal";

describe("config 单点", () => {
  test("命名/域名/邮箱按定稿", () => {
    expect(SITE.productName.zh).toBe("历象");
    expect(SITE.productName.en).toBe("Lixiang Almanac");
    expect(SITE.siteBaseUrl).toBe("https://lixiang.zhaoyao.xin");
    expect(SITE.supportEmail).toBe("support@zhaoyao.xin");
  });
  test("视觉方向已定（D1 奶油暖橘）→ 待定态关闭", () => {
    expect(SITE.visualDirectionPending).toBe(false);
  });
  test("prelaunch 口径与开关", () => {
    expect(SITE.releaseState).toBe("prelaunch");
    expect(SITE.appStoreAppId).toBeNull();
    expect(SITE.showDuo).toBe(false);
    expect(SITE.jsonLd.softwareApplication).toBe(false);
    expect(SITE.jsonLd.organization).toBe(true);
    expect(SITE.jsonLd.website).toBe(true);
  });
  test("素材登记表 = D1 白名单（手机 5 + ipad + 1440 reference + 节日 hidden）", () => {
    const keys = PUBLIC_SHOTS.map((s) => s.key);
    const visible = PUBLIC_SHOTS.filter((s) => s.type === "design-mock").map((s) => s.key);
    expect(visible).toEqual(["phone-month", "phone-day", "phone-day-b", "phone-anniversary", "phone-settings", "ipad"]);
    for (const k of ["phone-festivals", "phone-locked", "phone-unlocked"]) {
      expect(PUBLIC_SHOTS.find((s) => s.key === k)?.type, k).toBe("hidden");
      expect(isShotRendered(k), k).toBe(false);
    }
    expect(PUBLIC_SHOTS.find((s) => s.key === "web-home-1440")?.type).toBe("reference");
    for (const k of visible) expect(PUBLIC_SHOTS.find((s) => s.key === k)?.available.light, k).toBe(true);
    // Duo 不登记（A13 前不进官网）
    expect(keys.some((k) => /duo/i.test(k))).toBe(false);
    expect(EXCLUDED_ASSETS.duo).toMatch(/A13/);
  });
  test("禁止 .com 邮箱出现在源码/页面渲染结果", () => {
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
  test("CSS 使用 D1 token（旧方向色值不得回流）", () => {
    const css = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    for (const banned of ["#F4F0E6", "#B8321F", "#FBF8F0", "#1B1915", "#14120F"]) expect(css, banned).not.toContain(banned);
    for (const d1 of ["#FBF5EC", "#DE9B78", "#241C16", "#E8A886"]) expect(css, d1).toContain(d1);
  });
});
