import { SITE, type Locale } from "@/config/site";
import { copy } from "@/lib/copy";

/** 视觉方向未定时的临时占位提示（Sure 2026-11-11 否决旧纸墨稿；选定新方向后由 config 关闭）。 */
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
