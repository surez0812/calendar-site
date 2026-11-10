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

## 可公开素材白名单（防剧透）

`PUBLIC_SHOTS`：`month` / `day` / `day-b` / `anniversary` / `settings` = `design-mock`（图注「设计示意」）；`festival*` = `hidden`，**永不渲染**（节日内容未解锁，只允许锁定态且需 PM 单独批准）。真机截图到位后只把 `type` 改 `"real"`，不改渲染代码。

素材管线：designer `handover/calendar-20261111/design/mockups/phone-*.png`（375@2x）→ `pnpm assets` → `public/mockups/*-{375,750}.webp`；PNG 原图不进仓库。

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

## 已知占位（待设计/PM 交付，不阻塞骨架）

- 品牌印：`src/components/brand-glyph.tsx` 为 CSS 占位「历」，待 designer 定 mark 后换 SVG
- OG 图：`public/og/og-{zh,en}.png` 为中性占位（纸底 + 字），待 designer 定稿 1200×630
- 显示字体：暂用系统衬线（Songti SC/Noto Serif SC）；如需「历象」专用子集，按 guqin `build-noto-subset` 流程另出
- iPad 设备段：设计示意待补（明确占位，不伪造）
