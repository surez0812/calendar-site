import { describe, expect, test } from "vitest";
import { copy } from "@/lib/copy";
import { LOCALES } from "@/lib/i18n";

describe("文案红线", () => {
  test.each(LOCALES)("%s：无夸大/无未验证设备宣称", (l) => {
    const text = JSON.stringify(copy(l));
    expect(text).not.toMatch(/最准|第一|唯一|最好|官方|官网|专为 iPad 优化|已支持/);
    expect(text).not.toMatch(/\bDuo\b|\btent\b/i);
    expect(text).not.toMatch(/zhaoyao\.com/);
  });
  test.each(LOCALES)("%s：prelaunch 措辞与离线限定", (l) => {
    const c = copy(l);
    expect(`${c.hero.ctaPrimary} ${c.download.cta}`).toMatch(/即将上架|Coming soon/);
    expect(c.unlock.offlineNote).toMatch(/核心历法|[Cc]ore calendar/);
    expect(c.hero.fine).toMatch(/尚未|not yet/);
  });
});
