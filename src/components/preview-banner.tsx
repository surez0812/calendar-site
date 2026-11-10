import { SITE, type Locale } from "@/config/site";
import { copy } from "@/lib/copy";

/** 视觉方向未定时的临时占位提示（D1 已定稿 → config 默认关闭；仅供回滚）。 */
export function PreviewBanner({ l }: { l: Locale }) {
  if (!SITE.visualDirectionPending) return null;
  const c = copy(l);
  return (
    <div className="preview-banner" role="status" data-testid="visual-pending">
      <span className="preview-banner-dot" aria-hidden="true" />
      {c.preview.visualPending}
    </div>
  );
}
