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

## 视觉状态：**方向待定（中性占位）**

Sure 2026-11-11 **否决**了旧「纸墨 + 朱砂」方向（太素、与琴调太像），新方向 A 天象星历 / B 节气色谱 / C 器物木刻 未定。因此：

- 站点视觉 = **中性灰/白占位**（`src/app/globals.css`），顶部提示条「视觉方向待定 · 临时占位」（`SITE.visualDirectionPending=true`）；**旧方向色值/字体/封面 art 不得回流**（有单测守卫）。
- 旧方向 mockup 已从仓库移除（`public/mockups/` 不再存在）；`lib/shots.ts` 在待定期间对所有 design-mock 返回 `null`，页面渲染**中性设备占位框**。素材管线脚本默认跳过（只有 `BUILD_MOCKUPS=1` 才生成）；新方向签字后：接 `tokens-web-v1.css` + 新素材 → `visualDirectionPending=false` → 重建 tar/SHA。
- `festival*` 永远 `hidden`（防剧透），与视觉方向无关。
- 部署**暂缓**：建议等 Sure 选定方向 + 批 mockup 后一次性上线（部署窗口由 Lead/ops 定）。

## 素材命名约定（预接线，designer `design/directions/README.md`）

`src/config/site.ts` 的 `PUBLIC_SHOTS` 已按固定 key 预接线，值为空（`type:"pending"` → 页面渲染中性占位）：

| key | designer 源文件 | 站内输出 | 说明 |
|---|---|---|---|
| `phone-month` / `phone-day` / `phone-day-b` / `phone-anniversary` / `phone-settings` | `phone-{...}{,-dark}.png`（375×812 @2x） | `/mockups/{key}-{theme}-{375,750}.webp` | 手机设计示意 |
| `ipad` | `ipad{,-dark}.png`（1366×1024） | `/mockups/ipad-{theme}-{683,1366}.webp` | iPad 设计示意 |
| `web-home-1440` | `web-home-1440{,-dark}.png` | —（`reference`，仅设计参考，不上公开页） | 1440 整页稿 |
| `festivals` / `festival` / `festival-locked` | — | —（`hidden`，永不渲染） | 防剧透 |
| —（不登记） | Duo | — | **A13 前不进官网**（`EXCLUDED_ASSETS.duo`） |

方向选定后：补 PNG 到 `handover/.../design/mockups/` → `BUILD_MOCKUPS=1 pnpm assets` → 把对应 key 的 `type` 改 `"design-mock"`/`"real"` 并填 `src` → `visualDirectionPending=false` → 重建 tar/SHA。**不改渲染代码/结构**。

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
