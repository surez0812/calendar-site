import { describe, expect, test } from "vitest";
import { SITE } from "@/config/site";
import { shot } from "@/lib/shots";

describe("素材渲染白名单（预接线）", () => {
  test("视觉方向待定 + 文件未交付：一律不渲染", () => {
    expect(SITE.visualDirectionPending).toBe(true);
    for (const k of ["phone-month", "phone-day", "phone-day-b", "phone-anniversary", "phone-settings", "ipad"]) {
      expect(shot(k, "light"), k).toBeNull();
      expect(shot(k, "dark"), k).toBeNull();
    }
  });
  test("reference/hidden 永不渲染", () => {
    for (const k of ["web-home-1440", "festivals", "festival", "festival-locked", "duo"]) expect(shot(k, "light")).toBeNull();
  });
});
