import type { Locale } from "@/config/site";
import { copy } from "@/lib/copy";

/** 视觉方向未定 / 无正式素材时的中性设备占位（虚线框 + 「视觉方向待定」），不冒充真机图、不用旧方向素材。 */
export function DevicePlaceholder({ l, label, hero = false }: { l: Locale; label?: string; hero?: boolean }) {
  const c = copy(l);
  return (
    <div className={`device-placeholder${hero ? " device-placeholder--hero" : ""}`} role="img" aria-label={`${c.preview.visualPending}${label ? `：${label}` : ""}`} data-testid="device-placeholder">
      <span className="device-placeholder-mark" aria-hidden="true" />
      <span className="device-placeholder-title">{label ?? c.preview.devicePlaceholder}</span>
      <span className="device-placeholder-note">{c.hero.chipDesignMock}</span>
    </div>
  );
}
