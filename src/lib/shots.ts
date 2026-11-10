/** 设计示意素材（PLAN §8.2 白名单）。源：designer 375@2x PNG → scripts/build-web-assets.mjs 生成 WebP。 */
import { isShotPublic } from "@/config/site";

export type ShotTheme = "light" | "dark";
export type Shot = { src: string; srcSet: string; w: number; h: number };

const W1 = 375;
/** designer 未出暗色变体的素材：暗色下沿用浅色示意（图注仍为「设计示意」）。 */
const NO_DARK = new Set(["day-b"]);
const W2 = 750;
const H = 812; // 375×812 视口

export function shot(id: string, theme: ShotTheme): Shot | null {
  if (!isShotPublic(id)) return null; // hidden 素材永不渲染（festival* 防剧透）
  const t = theme === "dark" && NO_DARK.has(id) ? "light" : theme;
  return {
    src: `/mockups/${id}-${t}-${W1}.webp`,
    srcSet: `/mockups/${id}-${t}-${W1}.webp ${W1}w, /mockups/${id}-${t}-${W2}.webp ${W2}w`,
    w: W1,
    h: H,
  };
}
