/** 站内文案（zh/en）。PM/设计定稿后替换本文件一处即可；禁止把中文名硬编码到 metadata 字符串（用 config.titleFor）。 */
import { SITE, type Locale } from "@/config/site";

export type Copy = ReturnType<typeof copy>;

export function copy(l: Locale) {
  const zh = l === "zh";
  return {
    meta: {
      home: {
        title: SITE.productName[l],
        description: zh
          ? "历象：一本干净的中国万年历。农历、节气、黄历宜忌与节俗内容，免费、无广告、无内购，计划支持 iPhone 与 iPad。"
          : "Lixiang Almanac: a clean Chinese almanac — lunar calendar, solar terms, the daily almanac and festival customs. Free, no ads, no in-app purchases.",
      },
      privacy: { title: zh ? "隐私政策" : "Privacy Policy", description: zh ? "历象 App 与本站的隐私说明（prelaunch 版本）。" : "Privacy notice for the Lixiang Almanac app and this site (prelaunch)." },
      support: { title: zh ? "支持与反馈" : "Support & Feedback", description: zh ? "历象 App 的支持、反馈渠道与常见问题。" : "Support, feedback and FAQ for Lixiang Almanac." },
    },
    brand: { name: SITE.productName[l], latin: "LIXIANG ALMANAC", parent: zh ? "昭杳 · 传统文化分享" : "昭杳 · Traditional Culture" },
    nav: { features: zh ? "功能" : "Features", devices: zh ? "设备" : "Devices", download: zh ? "下载" : "Download", menu: zh ? "菜单" : "Menu", mainNav: zh ? "主导航" : "Main navigation", skip: zh ? "跳到正文" : "Skip to content" },
    langLabel: zh ? "EN" : "中文",
    hero: {
      kicker: zh ? "中国万年历" : "Chinese Almanac",
      title: SITE.productName[l],
      sub: zh
        ? "一本干净的中国万年历：农历节气、黄历宜忌、节俗怎么做，一历在手。"
        : "A clean Chinese almanac: lunar calendar, solar terms, the daily almanac, and how to keep the festivals.",
      ctaPrimary: zh ? "即将上架" : "Coming soon",
      ctaSecondary: zh ? "了解功能" : "See features",
      fine: zh ? "App 尚未在 App Store 发布；本页信息以正式上架版本为准。" : "The app is not yet on the App Store; this page reflects the upcoming release.",
      chipDesignMock: zh ? "设计示意" : "Design mock",
    },
    features: {
      title: zh ? "功能" : "Features",
      items: zh
        ? [
            { title: "每日宜忌，全但要能读", body: "日详情给全表：宜忌、冲煞、吉神方位、彭祖百忌等；首屏只留关键，长表可折叠。" },
            { title: "长表折叠，一眼先看关键", body: "信息按需展开：先看结论，需要时再翻完整表格；不把十几行黄历塞进首屏。" },
            { title: "生日与倒计日，只存本机", body: "倒计日与生日提醒保存在设备本地，不上传、不需要账号；可由你主动导出备份。" },
          ]
        : [
            { title: "The daily almanac, complete but readable", body: "The day view keeps the full table (advice, clashes, auspicious directions, Pengzu taboos); the first screen shows only what matters, long tables fold." },
            { title: "Fold the long tables, keep the essentials", body: "Density on demand: see the conclusion first and unfold the full table when you need it — no ten-row almanac on the first screen." },
            { title: "Birthdays and countdowns stay on device", body: "Countdowns for birthdays and festivals are stored locally, never uploaded, no account needed; you can export a backup yourself." },
          ],
    },
    unlock: {
      title: zh ? "内容按日期解锁" : "Content unlocks by date",
      body: zh
        ? "节俗内容按日期开放：未到日期只显示名称与日期，当日自动解锁，之后可随时回看。内容以图文网页承载，在 App 内阅读，可随时更新而不必等待发版。"
        : "Festival content opens by date: before the day, only the name and date are shown; on the day the full illustrated page unlocks and stays readable. Content is delivered as web pages inside the app, so it can be updated without waiting for a release.",
      points: zh
        ? ["未到：只显示节日名称与日期，不展示流程", "当日：解锁图文（准备 / 供品 / 步骤 / 资料来源）", "之后：随时回看，内容可持续更新"]
        : ["Before: only the festival name and date are shown", "On the day: the illustrated page unlocks (preparation / offerings / steps / sources)", "After: readable any time; content keeps being updated"],
      offlineNote: zh ? "核心历法全部在本机计算；节俗内容页可选联网更新。" : "Core calendar calculations run entirely on-device; festival pages optionally fetch updates.",
    },
    devices: {
      title: zh ? "为 iPhone 与 iPad 准备" : "Made for iPhone and iPad",
      body: zh
        ? "计划支持 iPhone 与 iPad（iOS 17 及以上），iPad 采用双栏布局。实际支持范围以 App Store 上架页面为准。"
        : "Planned support for iPhone and iPad (iOS 17 and later), with a two-column layout on iPad. Actual support is subject to the App Store listing.",
      iphoneCaption: zh ? "iPhone · 设计示意" : "iPhone · design mock",
      ipadPending: zh ? "iPad 布局示意待补" : "iPad layout mock pending",
      placeholderNote: zh ? "本段为设计示意，不是 App 实拍。" : "This section is a design mock, not a real app screenshot.",
    },
    download: {
      title: zh ? "即将上架" : "Coming soon",
      body: zh
        ? "历象正在准备上架。上架后可从 App Store 下载；在此之前，欢迎通过下面的方式联系我们。"
        : "Lixiang Almanac is being prepared for release. It will be available on the App Store; until then, reach us through the link below.",
      points: zh ? ["免费", "无广告", "无内购"] : ["Free", "No ads", "No in-app purchases"],
      cta: zh ? "即将上架" : "Coming soon",
      support: zh ? "问题与反馈" : "Support & feedback",
      bottomBar: zh ? "即将上架" : "Coming soon",
    },
    footer: {
      brandLine: zh ? "历象 · 昭杳出品" : "Lixiang Almanac · by ZhaoYao",
      cols: {
        product: zh ? "产品" : "Product",
        support: zh ? "支持" : "Support",
        parent: zh ? "昭杳" : "ZhaoYao",
      },
      features: zh ? "功能" : "Features",
      devices: zh ? "设备" : "Devices",
      download: zh ? "下载" : "Download",
      supportLink: zh ? "支持与反馈" : "Support & feedback",
      privacy: zh ? "隐私政策" : "Privacy Policy",
      mainSite: zh ? "主站 zhaoyao.xin" : "Main site zhaoyao.xin",
      source: zh ? "内容按日期解锁 · 核心历法离线计算" : "Content unlocks by date · core calendar works offline",
      operator: zh ? "昭杳（个人开发者）" : "ZhaoYao (independent developer)",
    },
    legal: { back: zh ? "返回首页" : "Back to home", version: zh ? "版本" : "Version" },
    preview: {
      visualPending: zh
        ? "视觉方向待定 · 当前页面为临时占位（非正式视觉）"
        : "Visual direction pending — this page is a temporary placeholder (no final visual yet)",
      devicePlaceholder: zh ? "设备示意 · 待定" : "Device preview · pending",
    },
  };
}
