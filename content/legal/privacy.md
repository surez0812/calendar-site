# 隐私政策 · 万年历 App（prelaunch 最小版 / 单一源）

- 作者：calendar-pm｜日期：2026-11-11｜状态：**草案，待 Sure/法务确认**
- **单一源规则**：本文件是唯一正文来源。官网 `/privacy` 与 App 内「关于 → 隐私政策」**必须由本文件构建**（Markdown → HTML），禁止两处各写一份（古琴 AC-1…AC-5 的教训 = 两处漂移）。
- 版本：`prelaunch-0.3`。App Store 提审前必须复核为与**该 build 实际行为**一致，并升级版本号。
- 本版覆盖：**App 本体**（v1.0 行为假设）+ **本官网**。若 App 行为变化（如接入统计），必须同步改本文件。

---

## 中文（zh-Hans）

# 隐私政策

**生效日期：2026 年 11 月 11 日｜版本：prelaunch-0.3**

「万年历」（以下称「本应用」，暂定名）由昭杳（以下称「我们」）提供。本政策说明本应用与官方网站如何处理你的信息。我们遵循最小必要原则：**不收集你的个人身份信息。**

## 一、我们不收集什么

- 本应用**没有账号系统**，不需要注册、登录，不收集姓名、手机号、邮箱、身份证件信息。
- 本应用**不接入广告 SDK**，不进行广告投放或广告定向，**不请求广告标识符（IDFA）**，不进行跨 App 或跨网站追踪（不使用 ATT 追踪授权）。
- 本应用**不接入第三方统计/分析 SDK**（本版本无使用统计）。
- 本应用**不申请**通讯录、相册、麦克风、摄像头、精确定位等权限。仅在「倒计日提醒」功能中申请**本地通知**权限，且由你主动开启。

## 二、你的数据存在哪里

- 你创建的**倒计日、生日**等记录，以及所有设置，**只保存在你的设备本地**，不上传、不同步到服务器（本版本无云同步）。
- 你可以随时在 App 内**导出**这些数据为 JSON 文件，也可以删除；卸载 App 会一并删除本地数据，我们无法为你找回。
- 通知（倒计日、节日提醒）由系统在本机发出，不经过我们的服务器。

## 三、本应用会联网做什么

本应用在以下情形会访问我们或我们的服务提供方的服务器：

1. **获取节日/节俗内容更新**：从我们的服务器（`zhaoyao.xin` 域名）拉取内容目录与网页内容。
2. **官网访问**：你访问本应用官网时，服务器会像普通网站一样记录访问日志。

为此，服务器**可能记录**：IP 地址、请求时间、请求路径、User-Agent 等标准 Web 日志信息。这些日志**仅用于安全防护、故障排查与服务稳定性**，不用于用户画像、广告或与你的身份关联。我们不会出售或出租这些信息。

## 四、内容与第三方

- 本应用使用的农历/节气/黄历数据由开源库 **6tail/lunar-swift**（MIT 许可证）在本地计算，其版权与许可声明见 App「关于」页。该库不联网、不上传数据。
- 本应用**不包含**第三方广告、社交、分析类 SDK。
- 官网可能链接到我们的其他站点（`zhaoyao.xin` 母站、`guqin.zhaoyao.xin` 等），它们各自有独立的隐私说明。

## 五、儿童

本应用不面向 13 周岁以下儿童单独收集任何信息（本应用不收集个人信息）。

## 六、你的权利

由于我们不收集可识别你身份的个人信息，通常没有可供查询、更正或删除的账户数据。你仍可以：
- 在 App 内删除或导出本地数据；
- 通过下方联系方式提出任何隐私问题或投诉。

## 七、政策变更

本政策更新时，我们会在本页面与 App 内同步更新，并修改顶部「版本」与「生效日期」。若变更涉及新的数据收集，会以显著方式提示。

## 八、联系我们

- 邮箱：**support@zhaoyao.xin**（主站既有支持邮箱）
- 主站：https://www.zhaoyao.xin

---

## English (en)

# Privacy Policy

**Effective date: November 11, 2026｜Version: prelaunch-0.3**

"ZhaoYao Almanac" (the "App", working title), provided by ZhaoYao ("we", "us"), is a Chinese calendar app. This policy explains how the App and this website handle your information. We follow the principle of data minimisation: **we do not collect your personal identity information.**

### 1. What we do NOT collect

- **No accounts.** No sign-up, no login, no name, phone number, email address or ID documents.
- **No advertising SDKs.** No ad delivery or ad targeting, **no IDFA**, no tracking across apps or websites (no ATT tracking permission).
- **No third-party analytics SDKs** (this version has no usage analytics).
- **No** access to contacts, photos, microphone, camera or precise location. The App requests **local notification** permission only for countdown reminders, and only when you enable it.

### 2. Where your data lives

- Countdowns, birthdays and all settings are stored **only on your device**. Nothing is uploaded or synced (no cloud sync in this version).
- You can **export** your records as JSON at any time, and delete them. Uninstalling the App deletes local data permanently; we cannot recover it for you.
- Notifications are scheduled locally by iOS and do not pass through our servers.

### 3. When the App uses the network

The App contacts our servers (domain `zhaoyao.xin`) to:

1. **Fetch festival/custom content updates** (content index and web pages).
2. Serve this website when you visit it.

As with any website, our servers **may log**: IP address, request time, request path and User-Agent. These logs are used **only for security, troubleshooting and service stability** — never for profiling, advertising or linking to your identity. We do not sell or rent this information.

### 4. Content and third parties

- Lunar calendar, solar terms and almanac data are computed **on device** by the open-source library **6tail/lunar-swift** (MIT licence). Its copyright and licence notice appears in the App's About screen. The library does not connect to the network or upload data.
- The App contains **no** third-party advertising, social or analytics SDKs.
- This website may link to our other sites (zhaoyao.xin, guqin.zhaoyao.xin, etc.), each with its own privacy notice.

### 5. Children

The App does not knowingly collect any information from children under 13 (the App collects no personal information at all).

### 6. Your rights

Because we do not collect personally identifiable information, there is normally no account data to access, correct or delete. You may still:
- delete or export your local data in the App;
- contact us with any privacy question or complaint.

### 7. Changes

When this policy changes, we will update this page and the in-App copy together, and revise the version and effective date at the top. Any change involving new data collection will be highlighted.

### 8. Contact

- Email: **support@zhaoyao.xin**
- Website: https://www.zhaoyao.xin

---

## 给 webdev 的构建说明

1. 只用本文件正文构建 `/{locale}/privacy`（zh-Hans / en 两个 locale 各取对应章节）。
2. **不要**在站点侧改写措辞；发现需要改，改本文件（PM 维护）。
3. 页面需带 `版本/生效日期`（与 App 内一致）、`mailto:support@zhaoyao.xin`、以及「返回主站」链接。
4. **待核实项**（提审前必须确认，否则本政策不能上线）：
   - [ ] v1.0 是否真的不接任何统计 SDK（若接，§一/§四 必须改，并同步 App Privacy 问卷）
   - [ ] 内容拉取接口的服务器日志保留期（由 ops 给数字；未定则不写具体天数）
   - [ ] 主站既有隐私政策里关于「网站访问日志」的口径是否与本文件一致（`work/zhaoyao-main frontend/src/pages/PrivacyPolicyPage.tsx`）
   - [x] **支持邮箱地址已定稿（2026-11-11 Lead 裁定）**：最终 **`support@zhaoyao.xin`**。依据：`zhaoyao.xin` 有 MX（mx1/mx2/mx3.qiye.aliyun.com）且全站在用；`zhaoyao.com` 为第三方 2004 年注册、无 A/MX（非我们域名）。Sure 确认 `.com` 系笔误；**发布门已解除**，无需再核。
- [ ] 运营主体名称/备案号（如需展示，由法务提供）
- `prelaunch-0.3`（2026-11-11）：英文术语 anniversaries→countdowns（功能名“倒计日”统一）；数据行为不变。
