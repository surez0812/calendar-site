/** 素材（v3 D1）。只有 design-mock/real 且文件可用才渲染；hidden（节日防剧透）/reference（1440 参考）一律 null。 */
import { SITE, shotOf } from "@/config/site";

export type ShotTheme = "light" | "dark";
export type Shot = { src: string; srcSet: string; w: number; h: number };

export function shot(key: string, theme: ShotTheme): Shot | null {
  const a = shotOf(key);
  if (!a) return null;
  if (a.type !== "design-mock" && a.type !== "real") return null;
  if (SITE.visualDirectionPending) return null; // 回滚保护：待定态不渲染
  if (!a.available[theme]) return null;
  const [w1, w2] = a.widths.length >= 2 ? a.widths : [a.w, a.w * 2];
  const base = a.file;
  return {
    src: `/mockups/${base}-${theme}-${w1}.webp`,
    srcSet: `/mockups/${base}-${theme}-${w1}.webp ${w1}w, /mockups/${base}-${theme}-${w2}.webp ${w2}w`,
    w: w1,
    h: a.h,
  };
}
