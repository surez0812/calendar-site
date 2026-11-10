import { describe, expect, test } from "vitest";
import { pageMeta } from "@/lib/meta";
import { hreflang, swapLocalePath } from "@/lib/i18n";

describe("语言路径切换", () => {
  test("保留路径且不产生双斜杠", () => {
    expect(swapLocalePath("/en/", "zh")).toBe("/zh/");
    expect(swapLocalePath("/en/privacy/", "zh")).toBe("/zh/privacy/");
    expect(swapLocalePath("/en/", "en")).toBe("/en/");
    expect(swapLocalePath("/zh/support/?x=1", "en")).toBe("/en/support/");
  });
});

describe("SEO 元数据", () => {
  test("canonical/hreflang/x-default", () => {
    const m = pageMeta("zh", "privacy", "隐私政策 - 历象", "d");
    expect(m.alternates?.canonical).toBe("https://lixiang.zhaoyao.xin/zh/privacy/");
    const langs = m.alternates?.languages as Record<string, string>;
    expect(langs[hreflang("zh")]).toBe("https://lixiang.zhaoyao.xin/zh/privacy/");
    expect(langs["en"]).toBe("https://lixiang.zhaoyao.xin/en/privacy/");
    expect(langs["x-default"]).toBe("https://lixiang.zhaoyao.xin/zh/privacy/");
    expect((m.openGraph?.images as { url: string }[])[0].url).toBe("https://lixiang.zhaoyao.xin/og/og-zh.png");
  });
});
