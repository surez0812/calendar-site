import { describe, expect, test } from "vitest";
import { SITE } from "@/config/site";
import { shot } from "@/lib/shots";

describe("publicShots 渲染白名单", () => {
  test("视觉方向待定：旧方向 design-mock 一律不渲染（Sure 2026-11-11 否决旧纸墨稿）", () => {
    expect(SITE.visualDirectionPending).toBe(true);
    for (const id of ["month", "day", "day-b", "anniversary", "settings"]) {
      expect(shot(id, "light"), id).toBeNull();
      expect(shot(id, "dark"), id).toBeNull();
    }
  });
  test("festival* 永不渲染（防剧透）", () => {
    for (const id of ["festivals", "festival", "festival-locked"]) expect(shot(id, "light")).toBeNull();
  });
});
