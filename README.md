# 历象 Lixiang Almanac · 官网（`lixiang.zhaoyao.xin`）

Next.js **静态导出**营销站（无 DB / 无服务端 / 无 pm2），中文 + 英文。prelaunch 阶段：App 未上架，站内无 App Store / TestFlight 链接、无假 badge，页面为「即将上架」。

- **仓库**：`surez0812/calendar-site`（public）｜**部署域名**：`lixiang.zhaoyao.xin`
- **规范来源**：`handover/calendar-20261111/web/PLAN.md`（SHA 见同目录 `SHA256SUMS`）、`scaffold/SCAFFOLD.md`、`OPS-REQUEST.md`
- **产品定稿**：Sure 2026-11-11「历象 / Lixiang Almanac」；母品牌 昭杳（header 副行「昭杳 · 传统文化分享」）

## 单一配置源

**所有站级可变项只改 `src/config/site.ts`**：产品名/副标、`siteBaseUrl`、`releaseState`、`showDuo`、`jsonLd` 开关、`supportEmail`、可公开素材白名单 `PUBLIC_SHOTS`。

| 项 | 当前值 |
|---|---|
| `productName` | `历象` / `Lixiang Almanac` |
| `tagline` | `一本干净的中国万年历` / `A clean Chinese almanac` |
| `siteBaseUrl` | `https://lixiang.zhaoyao.xin`（可用 `SITE_BASE_URL` 覆盖） |
| `releaseState` | `prelaunch`（live 需 PM 提 + Lead 执行） |
| `showDuo` | `false`（A13 通过 + PM 开开关后才 true；tent 不做） |
| `supportEmail` | `support@zhaoyao.xin`（`.com` 禁止出现，验收 grep 断言） |

## 法务单一源

`content/legal/{privacy,support}.md` 由 `pnpm legal` 从 `handover/calendar-20261111/legal/*-prelaunch.md` vendor 而来，源 SHA 记在 `content/legal/LEGAL_SOURCE.sha256`；**站点与 App 内 WebView 共用同一份正文**，源变更需重新 vendor 并提交。

## 视觉状态：**D1「奶油暖橘」已定稿（v3）**

Sure 2026-11-11 定稿 **D1「奶油暖橘」**；站点已接入 D1 素材与 token（唯一参照 `handover/calendar-20261111/design/final/D1-apricot/spec/tokens-web-v1.css` + `WEB-HANDOFF.md`）：

- token：`src/app/globals.css` 顶部 token 段（light/dark，`prefers-color-scheme`）；结构/字号/间距不变。旧方向（纸墨+朱砂）与中性占位色值不得回流（单测守卫）。
- 素材白名单（`PUBLIC_SHOTS`，组件 key 不变 → 组件 diff 最小）：
  | key | D1 文件 | 站内 |
  |---|---|---|
  | `phone-month` / `phone-day` / `phone-anniversary` / `phone-settings` | 同名 D1 PNG | `/mockups/{file}-{theme}-{375,750}.webp` |
  | `phone-day-b` | **D1 `phone-compass`**（D1 无独立第 2 屏；用吉神罗盘画面，避免与 F1 重复） | `/mockups/phone-compass-...` |
  | `ipad` | `ipad{,-dark}.png` | `/mockups/ipad-{theme}-{683,1366}.webp`（设备段已接线） |
  | `phone-festivals` / `phone-locked` / `phone-unlocked` | D1 有文件但 **hidden**（防剧透） | 不生成、不上站 |
  | `web-home-1440` | D1 1440 终稿 | `reference`（不上公开页） |
  | Duo | D1 有文件但 **A13 前不进官网** | `EXCLUDED_ASSETS.duo` |
- 素材管线：`MOCKUP_SRC="$PWD/../handover/calendar-20261111/design/final/D1-apricot" BUILD_MOCKUPS=1 pnpm assets`（PNG 不进仓，只提交 WebP）。
- OG/品牌 mark：仍为占位（待 Sure 批 mark）；商店截图（`design/.../store/`）**不得用于站点**（ASC 上传须真机实拍）。

## 本地开发/检查

```bash
export PATH="$HOME/.nvm/versions/node/v22.23.3/bin:$PATH"   # Node >=22 <23
npx --yes pnpm@10.34.6 install
npx pnpm@10.34.6 typecheck && npx pnpm@10.34.6 lint && npx pnpm@10.34.6 test && npx pnpm@10.34.6 build
npx pnpm@10.34.6 preview        # out/ → http://127.0.0.1:43125/zh/
npx pnpm@10.34.6 exec playwright test   # 用本机 Chrome（channel:"chrome"），无需下载浏览器
npx pnpm@10.34.6 shots          # 375/1440 × zh/en × light/dark 截图 → handover/.../web/shots/
```

## 构建产物

`out/`：`zh/index.html`、`en/index.html`、`{zh,en}/{privacy,support}/index.html`、`sitemap.xml`（6 条）、`robots.txt`、`_next/**`、`og/**`、`mockups/**`、`fonts/**`。

## 部署 / 回滚（ops 窗口，见 `OPS-REQUEST.md`）

1. 上传 `out/` 到 `/www/wwwroot/lixiang-site/releases/<TS>-<sha>/`（用 `COPYFILE_DISABLE=1 tar --no-mac-metadata`，无 `._*`）
2. `ln -sfn .../releases/<TS>-<sha> .../current`（静态站，无需重启）
3. nginx server block + 证书为**一次性窗口**（见 OPS-REQUEST）；之后发布只切 symlink
4. 回滚：`ln -sfn <PREV> current`（秒级）；配置回滚用 vhost 备份 + `nginx -t` + reload（单独授权）
5. **不部署直到 Sure/ops 窗口确认**；同机有主站/古琴/ghostmaps，窗口需跨组通告

## 已知占位（待视觉方向 + designer，不阻塞结构）

- 全部视觉：中性占位（见上）；正式 token 待 `tokens-web-v1.css`
- 品牌印：`BrandGlyph` 为 CSS 占位「历」字（非正式资产），待 mark 方向批后换 SVG
- OG：`public/og/og-{zh,en}.png` 中性占位（白底 + 字），待 designer 定稿
- 显示字体：系统字体；正式字体随 token 确定
- 设备素材：中性占位框；新方向 mockup / 真机截图到位后替换
- `/ceremony/<slug>` 静态正文目录：未来 cron 发布，**不在本站 tar 内**，nginx 预留见 `OPS-REQUEST.md` §3.1
