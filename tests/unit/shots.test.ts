import { describe, expect, test } from "vitest";
import { shot } from "@/lib/shots";

describe("publicShots 渲染白名单", () => {
  test("白名单素材返回 1x/2x srcSet", () => {
    const s = shot("month", "light")!;
    expect(s.src).toBe("/mockups/month-light-375.webp");
    expect(s.srcSet).toContain("750w");
    expect(s.w).toBe(375);
  });
  test("festival* 永不渲染（防剧透）", () => {
    for (const id of ["festivals", "festival", "festival-locked"]) expect(shot(id, "light")).toBeNull();
  });
  test("无暗色变体的素材暗色回退浅色", () => {
    expect(shot("day-b", "dark")!.src).toBe("/mockups/day-b-light-375.webp");
  });
});
