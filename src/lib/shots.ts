/** 设计示意/真机素材（PLAN §8.2）。**预接线**：key 固定，文件未交付时返回 null → 页面渲染中性占位。 */
import { SITE, shotOf } from "@/config/site";

export type ShotTheme = "light" | "dark";
export type Shot = { src: string; srcSet: string; w: number; h: number };

export function shot(key: string, theme: ShotTheme): Shot | null {
  const asset = shotOf(key);
  if (!asset) return null;
  // 只渲染登记为 design-mock / real 的素材；hidden（节日防剧透）、reference（1440 设计参考）、pending（未交付）一律 null
  if (asset.type !== "design-mock" && asset.type !== "real") return null;
  // 视觉方向待定：旧方向 mockup 一律不上页（Sure 2026-11-11 否决旧纸墨稿）
  if (SITE.visualDirectionPending) return null;
  const file = asset.src[theme];
  if (!file) return null; // 预接线：文件未交付
  const [w1, w2] = asset.widths.length >= 2 ? asset.widths : [asset.w, asset.w * 2];
  return {
    src: `/mockups/${key}-${theme}-${w1}.webp`,
    srcSet: `/mockups/${key}-${theme}-${w1}.webp ${w1}w, /mockups/${key}-${theme}-${w2}.webp ${w2}w`,
    w: w1,
    h: asset.h,
  };
}
