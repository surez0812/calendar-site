import { describe, expect, test } from "vitest";
import { copy } from "@/lib/copy";
import { LOCALES } from "@/lib/i18n";

describe("文案红线", () => {
  test.each(LOCALES)("%s：无夸大/无未验证设备宣称", (l) => {
    const text = JSON.stringify(copy(l));
    expect(text).not.toMatch(/最准|第一|唯一|最好|官方|官网|专为 iPad 优化|已支持折叠屏|专为折叠屏|已适配 Duo|Duo 专属/);
    expect(text).not.toMatch(/zhaoyao\.com/);
  });
  test.each(LOCALES)("%s：倒计日术语 + Duo 审慎口径", (l) => {
    const c = copy(l);
    const text = JSON.stringify(c);
    expect(text).not.toContain("纪念日");
    expect(text).not.toMatch(/已支持折叠屏|专为折叠屏|Duo 专属/);
    expect(text).toMatch(/倒计日|Countdowns/i);
    expect(text).toMatch(/iPhone Duo/);
    expect(`${c.duo.title}`).toMatch(/iPhone Duo/);
    expect(c.duo.note).toMatch(/以 App Store 上架页面为准|App Store listing/);
  });
  test.each(LOCALES)("%s：prelaunch 措辞与离线限定", (l) => {
    const c = copy(l);
    expect(`${c.hero.ctaPrimary} ${c.download.cta}`).toMatch(/即将上架|Coming soon/);
    expect(c.unlock.offlineNote).toMatch(/核心历法|[Cc]ore calendar/);
    expect(c.hero.fine).toMatch(/尚未|not yet/);
  });
});
