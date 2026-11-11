# 支持页 · 万年历 App（prelaunch 最小版 / 单一源）

- 作者：calendar-pm｜日期：2026-11-11｜状态：**草案，待 Sure 确认**｜版本：**prelaunch-0.6**
- **单一源规则**：本文件是官网 `/{locale}/support` 的唯一正文来源；App 内「关于 → 帮助与反馈」复用同一来源（App 内可用 WebView 或精简其中 FAQ）。
- **不编造**：未定的联系方式/上线时间/功能承诺一律留 TODO，不写占位假值。

---

## 中文（zh-Hans）

# 支持与反馈

**版本：prelaunch-0.6（2026-11-11）**

「万年历」（暂定名）正在准备上架。**本应用尚未在 App Store 发布**；正式上架后，本页会更新下载方式与常见问题。

## 反馈渠道

- 邮箱：**support@zhaoyao.xin**（主站既有支持邮箱）
- 也可以从主站 https://www.zhaoyao.xin 找到我们

反馈时请尽量附上：问题描述、发生日期/节日、页面截图、设备型号与 iOS 版本。我们没有账号系统，因此**不需要也不应发送**任何账号或密码信息。

## 关于数据与隐私

- 本应用**不需要注册登录**，不收集个人身份信息，不接广告与统计 SDK。
- 你的倒计日等记录**只存在本机**；可在 App 内导出 JSON 备份。
- 详细说明见 [隐私政策](/privacy)。

## 常见问题（FAQ）

**Q：需要联网吗？**
A：不需要。农历、节气、黄历与倒计日提醒均在本机计算与运行；联网仅用于获取节俗内容更新，离线时仍可查看已缓存内容。

**Q：为什么有些节日内容看不到？**
A：节俗内容按日期解锁——未到那一天，只会显示节日名称与日期，不展示具体流程。到当日自动解锁，之后可随时回看。

**Q：黄历的宜忌和别的 App 不一样？**
A：传统黄历的宜忌并没有唯一标准，不同通书与流派结果可能不同。本应用采用开源历法库 6tail/lunar-swift（MIT）的数据口径，并在「关于」页注明来源。农历日期、节气时刻等可核对项，我们会以权威公布数据为准。

**Q：支持哪些设备？**
A：计划支持 iPhone 与 iPad（iOS 17 及以上）。**具体支持范围以 App Store 上架页面为准**。

**Q：为什么免费？有没有广告或内购？**
A：本应用计划免费、无广告、无内购，核心功能不设付费墙。

**Q：会收集我的生日/倒计日吗？**
A：不会上传。数据仅保存在你的设备本地。

---

## English (en)

# Support & Feedback

**Version: prelaunch-0.6 (2026-11-11)**

"ZhaoYao Almanac" (working title) is being prepared for release. **It is not yet available on the App Store.** This page will be updated with download details and FAQs once it launches.

## Contact

- Email: **support@zhaoyao.xin**
- Website: https://www.zhaoyao.xin

When reporting an issue, please include: what happened, the date/festival involved, a screenshot, your device model and iOS version. There are no accounts, so **never send** passwords or account credentials.

## Data & privacy

- No sign-up or login; no personal identity data collected; no ad or analytics SDKs.
- Your countdowns are stored **only on your device**; you can export them as JSON.
- See the [Privacy Policy](/privacy).

## FAQ

**Does the app need internet?**
No. Lunar dates, solar terms, the almanac and reminders are computed on device. The network is used only to fetch festival-content updates; cached content is available offline.

**Why is some festival content hidden?**
Custom content unlocks by date. Before the day, only the festival name and date are shown; the detailed procedure unlocks on the day and can be reviewed afterwards.

**Why does the almanac differ from another app?**
Traditional almanac "suitable/avoid" entries have no single authority; different almanacs and schools may differ. This app uses the data of the open-source `6tail/lunar-swift` library (MIT) and states its source in the About screen. Verifiable items — lunar dates and solar-term times — follow authoritative published data.

**Which devices are supported?**
iPhone and iPad (iOS 17 or later) are planned. **Check the App Store listing for the final supported range.**

**Is it free? Any ads or in-app purchases?**
The plan is free, with no ads and no in-app purchases; core features are not paywalled.

**Do you collect my birthdays or countdowns?**
No. They remain on your device.

---

## 给 webdev 的构建说明

1. 只用本文件构建 `/{locale}/support`（zh/en 各取对应章节）；页面顶部必须有 banner：「**尚未上架**」。
2. 支持邮箱用 `mailto:support@zhaoyao.xin`（主站既有地址，已在 `work/zhaoyao-main frontend/src/components/layout/UnifiedFooter.tsx:31` 实查存在）。
3. 链接：`/privacy`、主站 `https://www.zhaoyao.xin`。
4. **待核实（上线前）**：
   - [ ] 「计划支持 iPhone 与 iPad / iOS 17+」的措辞：若 iPad 版式未过验收，改成只写 iPhone
   - [ ] FAQ 里「免费/无广告/无内购」必须与上架版本一致，否则删改
   - [x] **支持邮箱地址已定稿（2026-11-11 Lead 裁定）**：最终 **`support@zhaoyao.xin`**。依据：`zhaoyao.xin` 有 MX（mx1/mx2/mx3.qiye.aliyun.com）且全站在用；`zhaoyao.com` 为第三方 2004 年注册、无 A/MX（非我们域名）。Sure 确认 `.com` 系笔误；**发布门已解除**，无需再核。
- [ ] 是否放 TestFlight/邮件订阅入口：**待 Sure 定**，未定不放

## 版本记录

- `prelaunch-0.2`（2026-11-11）：按 Sure 范围收缩（不做「休班/调休」与「工具入口」）→ FAQ 删除「法定节假日」表述；**站点需重新 vendor 并更新 `LEGAL_SOURCE.sha256`**。
- `prelaunch-0.3`（2026-11-11）：**英文 FAQ 同步删除 “public holidays”**（中英一致：「Verifiable items — lunar dates and solar-term times」）；内容不变、无需重审。**站点 vendor / `LEGAL_SOURCE.sha256` 以 prelaunch-0.3 SHA 为准**。
- `prelaunch-0.6`（2026-11-11）：仅修正支持页正文版本行（zh/en）为 **prelaunch-0.6**，内容不变；**站点需 re-vendor 并更新 `LEGAL_SOURCE.sha256`**。
- `prelaunch-0.6`（2026-11-11）：英文术语 anniversaries→countdowns（功能名“倒计日”统一）；内容不变。
