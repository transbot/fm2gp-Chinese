# 自行部署 / Self-hosting

本项目是 React + Vite 静态网站。部署输入为仓库中的源码、`public/`、依赖锁文件及工程配置；验收截图、历史构建包、交互草稿和本机缓存均不需要。章节内的 GitHub 资料链接仍使用本仓库提供的配套代码、习题答案、参考文献与课件。

## 获取与构建

安装 Node.js 22（至少 22.12，`.nvmrc` 指定主版本），然后执行：

```bash
git clone --depth 1 https://github.com/transbot/fm2gp-Chinese.git
cd fm2gp-Chinese
npm ci
npm run build
npm run preview -- --host 127.0.0.1
```

打开终端显示的预览地址，检查主页、`/book/8` 和 `/fermat`。构建会生成 JS/CSS、公共图片、各公开路由的 HTML、`sitemap.xml` 及 `robots.txt`。发布整个 `dist/`，无需提交它。`npm ci` 使用 `package-lock.json` 固定依赖；无需 `.local/`、全局安装的 Vite、数据库、账号或 API 密钥。

浅克隆只获取当前版本，可避免下载旧验收附件。普通完整克隆仍包含旧提交中的大文件；本次清理不改写历史。GitHub 当前分支的源码 ZIP 同样不包含历史附件。

## Netlify

导入仓库或自己的 fork，选择待部署分支。根目录的 `netlify.toml` 已配置：

- Node.js：22。
- 构建命令：`npm run build`。
- 发布目录：`dist`。
- 直接访问和刷新客户端路由的 SPA 回退规则。

保持依赖安装开启，让托管平台根据锁文件安装依赖。也可在本地构建后上传整个 `dist/`；手动上传时应额外配置下述路由规则，因为 `netlify.toml` 位于源码根目录，不在 `dist/` 中。

## 其他静态托管服务

部署在域名根路径 `/`。服务器需要先服务实际存在的文件，并支持 `/fermat` → `/fermat.html` 这类无扩展名路由，最后将未命中的应用路由回退到 `/index.html`。例如 Nginx：

```nginx
location / {
    try_files $uri $uri.html $uri/ /index.html;
}
```

仅启动一个不支持这些规则的文件服务器，不能保证所有深链接刷新和路由 HTML 元数据与官方站一致。子目录部署（如 `/fm2gp/`）还需要调整 Vite base、路由 basename 和绝对资源地址，不属于开箱即用的默认配置。

## 官方站配置与自己的域名

默认构建沿用官方站的内容与配置：

- `src/seo/pages.ts` 中 `SITE_ORIGIN` 用于 canonical、站点地图和 robots 声明。
- `src/config/book.ts` 中 `WEB_APP_URL` 以及 `public/images/mobile-web-qr.png` 指向官方站。
- 章节资源链接指向 `transbot/fm2gp-Chinese`，详见 `src/data/bookCatalog.ts`。
- 中文购书链接默认为空，封面仅显示图片。

因此可以直接部署具有相同内容与交互的网站。若要将副本作为独立站点收录，请把 `SITE_ORIGIN` 改成自己的 HTTPS origin（末尾不带 `/`），同步 `WEB_APP_URL` 和二维码，并相应调整 `src/seo/build.test.ts`、`src/seo/navigation.test.tsx` 中的官方域名期望，然后重新构建。保留官方 canonical 的副本会继续把官方网址声明为规范版本。

## 验证

```bash
npx eslint . --max-warnings=0
npx tsc -p tsconfig.app.json --noEmit
npx tsc -p tsconfig.node.json --noEmit
npm run test:run
npm run build
```

额外的历史浏览器验收脚本位于 `scripts/`，不参与默认构建；运行它们需要另行安装 Playwright 及浏览器，并按各脚本配置路径。验收附件的固定版本入口见 [verification/README.md](verification/README.md)。

## English

This is a static React/Vite app. Use Node.js 22.12+ within the 22.x line, shallow-clone the repository, run `npm ci` and `npm run build`, then publish the entire `dist/` directory. No database, API keys, local caches or historical evidence files are needed. Netlify repository imports use the included `netlify.toml`; other hosts must serve real files first, resolve extensionless routes to their generated `.html` files, and fall back to `/index.html` for remaining app routes. Deploy at the domain root.

The default build retains the official site's canonical origin, QR code and companion-resource links. For an independently indexed custom domain, update `SITE_ORIGIN` in `src/seo/pages.ts`, `WEB_APP_URL` in `src/config/book.ts`, the QR image, and the matching SEO test expectations before rebuilding. Shallow clones and current source ZIPs omit historical attachments; a full Git clone still includes them because history has not been rewritten.
