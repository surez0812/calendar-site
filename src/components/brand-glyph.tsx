/**
 * 品牌印（占位）：Sure 未批 mark 方向前，用 CSS 朱砂方印 + 「历」字（不用位图、不挪用琴调/灵异 mark）。
 * TODO(designer): 替换为定稿 SVG（`design/` 交付后），保持同尺寸 24/19。
 */
export function BrandGlyph({ size = 24 }: { size?: number }) {
  return (
    <span className="brand-glyph" aria-hidden="true" style={{ width: size, height: size, fontSize: Math.round(size * 0.62) }}>
      历
    </span>
  );
}
