import { expect, test } from "@playwright/test";

/** prelaunch 冒烟：双语/无 console error/无横溢/prelaunch 口径/防剧透/SEO 三件套。 */
test("zh 首页 prelaunch 冒烟", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    // 静态站预热/中断请求在测试并行时会以 ERR_ABORTED 出现，不是页面错误
    if (/ERR_ABORTED|Failed to load resource: net::ERR_ABORTED/.test(text)) return;
    errors.push(text);
  });
  const res = await page.goto("/zh/");
  expect(res?.status()).toBe(200);
  await expect(page.locator("h1")).toContainText("历象");
  await expect(page.locator('[data-testid="cta-prelaunch"]')).toHaveAttribute("aria-disabled", "true");
  await expect(page.locator('[data-testid="visual-pending"]')).toHaveCount(0); // D1 已定：待定提示条移除
  await expect(page.locator('[data-testid="device-placeholder"]')).toHaveCount(0); // 已有 D1 素材，不再占位
  await expect(page.locator('img[src*="/mockups/phone-month"]')).toHaveCount(1); // D1 hero 素材
  await expect(page.locator('img[src*="/mockups/ipad"]')).toHaveCount(1); // D1 iPad 双栏素材（Lead 已批接线例外）
  // v3.2：Duo 介绍/兼容说明区块（4 姿态）+ 审慎口径
  await expect(page.locator("#duo")).toBeVisible();
  await expect(page.locator('img[src*="/mockups/duo-"]')).toHaveCount(4);
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).toMatch(/倒计日/);
  expect(bodyText).not.toContain("纪念日");
  expect(bodyText).not.toMatch(/已支持折叠屏|专为折叠屏/);
  // 主站互链（header 母品牌行 + footer）
  await expect(page.locator('a[href="https://www.zhaoyao.xin/"]')).toHaveCount(2);
  await expect(page.locator('img[src*="phone-festival"], img[src*="phone-locked"], img[src*="phone-unlocked"]')).toHaveCount(0); // 节日/锁定/解锁 hidden
  await expect(page.locator('img[src*="festival"]')).toHaveCount(0); // festival* hidden 防剧透
  await expect(page.locator('a[href*="apps.apple.com"]')).toHaveCount(0); // 无假商店链接
  const ld = await page.locator('script[type="application/ld+json"]').textContent();
  expect(ld).toContain("Organization");
  expect(ld).not.toContain("SoftwareApplication");
  const html = await page.content();
  expect(html).toContain("support@zhaoyao.xin");
  expect(html).not.toContain("zhaoyao.com");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(overflow).toBe(false);
  const canonical = await page.getAttribute('link[rel="canonical"]', "href");
  expect(canonical).toBe("https://lixiang.zhaoyao.xin/zh/");
  expect(errors).toEqual([]);
});

test("en 首页 + 语言切换 + 法务页", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.locator("h1")).toContainText("Lixiang Almanac");
  const hreflang = await page.getAttribute('link[rel="alternate"][hreflang="zh-CN"]', "href");
  expect(hreflang).toBe("https://lixiang.zhaoyao.xin/zh/");
  await page.locator('.site-footer a[href="/en/privacy/"]').first().click();
  await expect(page.locator(".legal-wrap > h1")).toContainText("Privacy Policy");
  await page.goto("/en/");
  await page.locator(".site-footer .lang-switch").first().click();
  await expect(page).toHaveURL(/\/zh\/$/);
});
