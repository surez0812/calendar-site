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
  test("视觉方向待定（旧纸墨稿已被 Sure 否决）", () => {
    expect(SITE.visualDirectionPending).toBe(true);
  });
  test("prelaunch 口径与开关", () => {
    expect(SITE.releaseState).toBe("prelaunch");
    expect(SITE.appStoreAppId).toBeNull();
    expect(SITE.showDuo).toBe(false);
    expect(SITE.jsonLd.softwareApplication).toBe(false);
    expect(SITE.jsonLd.organization).toBe(true);
    expect(SITE.jsonLd.website).toBe(true);
  });
  test("素材登记表已按 designer 约定预接线（值为空，type=pending）", () => {
    const keys = PUBLIC_SHOTS.map((s) => s.key);
    for (const k of ["phone-month", "phone-day", "phone-day-b", "phone-anniversary", "phone-settings", "ipad", "web-home-1440"]) expect(keys, k).toContain(k);
    for (const s of PUBLIC_SHOTS) {
      if (s.type === "hidden" || s.type === "reference") continue;
      expect(s.type, s.key).toBe("pending");
      expect(s.src.light, s.key).toBeNull();
      expect(s.src.dark, s.key).toBeNull();
    }
    // 节日页永远 hidden；Duo 不进官网（显式排除，不登记为可渲染素材）
    for (const k of ["festivals", "festival", "festival-locked"]) expect(isShotRendered(k)).toBe(false);
    expect(keys.some((k) => /duo/i.test(k))).toBe(false);
    expect(EXCLUDED_ASSETS.duo).toMatch(/A13/);
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

  test("CSS 只用中性占位色（旧方向纸墨/朱砂不得回流）", () => {
    const css = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    for (const banned of ["#F4F0E6", "#B8321F", "#FBF8F0", "#1B1915", "#14120F", "Songti SC"]) {
      expect(css, banned).not.toContain(banned);
    }
  });
});
