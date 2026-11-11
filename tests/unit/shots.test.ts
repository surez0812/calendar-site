import { describe, expect, test } from "vitest";
import { SITE } from "@/config/site";
import { shot } from "@/lib/shots";

describe("素材渲染（v3 D1）", () => {
  test("白名单素材返回 1x/2x srcSet", () => {
    expect(SITE.visualDirectionPending).toBe(false);
    const s = shot("phone-month", "light")!;
    expect(s.src).toBe("/mockups/phone-month-light-375.webp");
    // 组件 key 不变，D1 文件映射：phone-day-b → phone-compass
    expect(shot("phone-day-b", "light")!.src).toBe("/mockups/phone-compass-light-375.webp");
    expect(s.srcSet).toContain("750w");
    const dark = shot("phone-month", "dark")!;
    expect(dark.src).toContain("-dark-");
    const ipad = shot("ipad", "light")!;
    expect(ipad.src).toBe("/mockups/ipad-light-683.webp");
    expect(ipad.srcSet).toContain("1366w");
  });
  test("Duo 四姿态渲染（showDuo=true）", () => {
    for (const k of ["duo-outer", "duo-open", "duo-tabletop", "duo-tent"]) {
      expect(shot(k, "light")?.src, k).toContain(`/mockups/${k}-light-`);
      expect(shot(k, "dark")?.src, k).toContain("-dark-");
    }
  });
  test("hidden（节日/锁定/解锁）与 reference（1440）永不渲染", () => {
    for (const k of ["phone-festivals", "phone-locked", "phone-unlocked", "web-home-1440", "duo"]) expect(shot(k, "light"), k).toBeNull();
  });
});
