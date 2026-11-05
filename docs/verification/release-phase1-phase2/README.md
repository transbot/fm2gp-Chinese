# 第一、二轮生产发布验收 — 2026-11-05

## 发布对象与合并

- 评审对象：`eaa987465d8edba002ecaff777d2e3b8a98338d9`。
- 更新远程信息后，main 为 `b8cc389bd84035a363607f0972b06cb6aed22b43`；main 无独有提交，评审分支领先 5 个提交。无保护规则或 ruleset 要求其他合并方式。按快进关系正常推送 main，没有强制推送。
- 首次部署对应 eaa9874。正式环境的 `/book` 直达检查返回 404，原失败见 [routes-run.txt](routes-run.txt)。开发服务器／本地预览会回退到 index.html，不能替代生产托管的路由验收。
- 发布修复：`863cb9527cd0d6a5b093f61d4fa54bc88ae3e23c`，只在 netlify.toml 增加 `/* → /index.html`、状态 200 的非强制回退规则。现有静态文件优先；应用 `src` 与 `public` 相对评审提交没有变化。依据 [Netlify 官方单页应用配置](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps)。
- 正式域名：[fm2gp-chinese.bookzhou.com](https://fm2gp-chinese.bookzhou.com/)。没有更换托管服务、构建命令或发布目录。

## 托管平台与实际版本

| 部署 | 提交 | 实际观察 |
| --- | --- | --- |
| [首次发布](https://app.netlify.com/projects/fm2gp-chinese/deploys/6aec83cde6ffbe659a73346b) | eaa9874 | main / production，构建与发布成功，16 秒；被后续路由修复替代 |
| [最终生产部署](https://app.netlify.com/projects/fm2gp-chinese/deploys/6aec84be20dc3c5971ef7919) | 863cb95 | Published，main 自动发布，11 秒，21:29（UTC+8） |

平台状态由登录后的 Netlify 控制台实际核对，详细记录见 [deployment.json](deployment.json)。GitHub 没有提供对应的 Actions 或 deployment 状态记录。正式域名 `/book` 修复后返回 200，见 [route-after-fix.json](route-after-fix.json)。

正式域名返回的 **70 个 JS/CSS/图片文件**与本地生产构建逐一比较 SHA-256，全部一致；入口为 `/assets/index-eHv1N9PB.js`。记录见 [production-assets.json](production-assets.json)。HTML 可能包含托管／CDN 注入的监测脚本，因此对 HTML 核对实际入口路径，对静态资源核对完整字节哈希。

## 工程检查

ESLint、TypeScript、生产构建通过；Vitest **33 文件 / 281 项测试通过**。见 [lint.txt](lint.txt)、[typescript.txt](typescript.txt)、[tests.txt](tests.txt)、[build.txt](build.txt)。Browserslist 数据过期提示仍存在，没有更新依赖。

环境：Windows，Node 22.17.1，npm 11.7.0，Vite 8.0.16，Vitest 4.1.8，Edge 156.0.4314.58。浏览器验收使用独立无头 Edge、新建上下文、正式 HTTPS 域名，中英文、1440 与 390 像素宽度。未跳过 TLS 校验。

## 线上验收

各组结果如下（覆盖有重叠，不将数量相加）：

- 章节与概念路由：22 条路由 × 2 种语言 × 2 种宽度；直达、刷新、前进后退、章节／习题搜索与锚点通过。检查包括收起内容、提示属性与无障碍标签的页码文字，以及“林宇／林字”说明。资源目标按仓库实际文件核对，未声称逐个下载 GitHub 资源。
- 阅读流程：两种宽度下的设备语言、手动语言持久化、章节目录返回、来源返回、滚动恢复、本书路线、矩阵幂、尾后位置与首页图片通过。
- 补充交互：两种语言和宽度下的结合律反例、字符串非交换性；矩阵幂输入变化复位、语言切换保持变量与代码；布尔链图可达／不可达回看；迭代器 end 错误翻译、回放移动计数；有序数组 [1,3,5] 查找 0、上下边界均为 0；最短距离 7 与 A→D→F 联动；C.7 精确定位、刷新和来源返回通过。

全站扫描：42 条页面路由 × 2 种语言 × 2 种宽度，共 168 项通过；整页横向溢出、pageerror 与扫描发现的英文页面中文残留均为零。页码检查覆盖正文、收起内容、开发者笔记、提示属性和无障碍标签。霍纳与埃及乘法的四组语言／宽度交互已通过：应用新输入暂停并复位全部相关播放器，前进、回看和重播使用新轨迹；中途切换语言保留变量、计数、代码高亮与调用帧，后续说明使用新语言。霍纳验证 41 以及 3/3 对 6/3 计数；埃及乘法验证四组计数和峰值帧基准、辅助函数进出、零与负数包装及容量错误。搜索回归组也已通过：两个入口各 14 个查询；“霍纳”“Horner”“8.1”、既有概念名称、附录 C.7 三种写法、A/B 大小写、数字节号与习题号区分均通过。两组浮点舍入输入被拒绝；溢出状态的指数、term 与计数在回看、重播、语言切换中一致。中文搜索截图的实际输入为“霍纳”，英文为 Horner，截图前均读回断言并写入审计 JSON。

| 证据组 | 记录 |
| --- | --- |
| 章节路由（22 × 4） | [production-audit.json](routes/production-audit.json) |
| 路线与返回状态（两种宽度） | [flow-audit.json](flows/flow-audit.json) |
| 全站页面扫描（42 × 4） | [browser-audit.json](sweep/browser-audit.json) |
| 霍纳（两种语言 × 两种宽度） | [browser-audit.json](horner/browser-audit.json) |
| 埃及乘法（两种语言 × 两种宽度） | [browser-audit.json](egyptian/browser-audit.json) |
| 搜索与评审回归（两种语言 × 两种宽度） | [browser-audit.json](review/browser-audit.json) |
| 补充交互（两种语言 × 两种宽度） | [audit.json](smoke/audit.json) |

原脚本部分成功文案仍称 production preview；每份审计 JSON 的 baseUrl 均为正式域名，上述结果来自本次线上运行。

## 线上截图

每组均保留中英文、桌面和手机原始截图。以下列出中文示例；英文图片在同目录使用 `en` 文件名。

| 页面／状态 | 桌面 | 390 像素手机 |
| --- | --- | --- |
| 首页搜索 | [截图](review/home-search-zh-1440.png) | [截图](review/home-search-zh-390.png) |
| 章节搜索 | [截图](review/chapter-search-zh-1440.png) | [截图](review/chapter-search-zh-390.png) |
| 运算与代数结构 | [截图](smoke/algebra-zh-1440.png) | [截图](smoke/algebra-zh-390.png) |
| 泛型幂 | [截图](smoke/power-zh-1440.png) | [截图](smoke/power-zh-390.png) |
| 矩阵与可达性 | [截图](smoke/matrix-zh-1440.png) | [截图](smoke/matrix-zh-390.png) |
| 迭代器尾后位置 | [截图](smoke/iterator-zh-1440.png) | [截图](smoke/iterator-zh-390.png) |
| 霍纳法则 | [截图](horner/horner-zh-1440.png) | [截图](horner/horner-zh-390.png) |
| 埃及乘法 | [截图](egyptian/egyptian-zh-1440.png) | [截图](egyptian/egyptian-zh-390.png) |
| 二分查找键 0 | [截图](smoke/binary-zero-zh-1440.png) | [截图](smoke/binary-zero-zh-390.png) |
| 最短路径 | [截图](smoke/shortest-path-zh-1440.png) | [截图](smoke/shortest-path-zh-390.png) |
| C.7 来源返回 | [截图](smoke/appendix-c7-zh-1440.png) | [截图](smoke/appendix-c7-zh-390.png) |

已目视抽核中文桌面章节搜索、英文手机章节搜索、中文手机矩阵幂、中文桌面可达性、英文手机代数结构／霍纳，以及英文桌面最短路径；界面保持浅色卡片，手机代码与宽表使用局部滚动。

## 验收脚本调整与历史失败

- verify-egyptian.cjs、verify-phase2-review.cjs 支持 READER_OUTPUT_DIR，使生产证据单独保存；原评审目录不覆盖。
- verify-reader-flows.cjs 的路线点击等待预期目标 href 和 URL，避免慢速懒加载时再次点击上一页面的“下一站”；图片检查等待 decode() 完成。保留 [路线时序失败](flows/timing-failure.txt)及[图片时序失败](flows/image-timing-failure.txt)。这两项是脚本等待条件修正，没有修改应用。
- 新增 verify-release-smoke.cjs，补充第一轮概念交互、C.7 来源返回以及二分查找和最短路径抽查。初次中文按钮选择器误用“自动排序”，改为界面既有“快速排序”，保留 [选择器失败](smoke-selector-failure.txt)。
- 新增 verify-release-assets.cjs，对正式域名资源做 SHA-256 比对。
- 早期终端 urllib/curl 请求分别遇到 403/TLS 连接失败；实际浏览器可正常访问。初次浏览器探针的 script[src] 选择器因 CDN 监测脚本产生多匹配，最终资产检查限定应用入口，不将该探针作为通过证据。

## 复现

设置 READER_BASE_URL=https://fm2gp-chinese.bookzhou.com，READER_OUTPUT_DIR 为各组独立目录，NODE_PATH 指向已有 Playwright 安装后执行 scripts/verify-reader-production.cjs、verify-reader-flows.cjs、verify-reader-ui.cjs、verify-horner.cjs、verify-egyptian.cjs、verify-phase2-review.cjs、verify-release-smoke.cjs、verify-release-assets.cjs。

TEMP/TMP 指向仓库 .local 后运行 npm run lint、npx tsc -b --pretty false、npm run test:run、npm run build。

## 下一轮

线上验收全部通过，已从更新后的 main（863cb95）创建 `codex/phase3-division-doubling-fibonacci`，接续第4.5—4.6节的倍增与斐波那契求余，扩展现有 `/division`。本次只建立下一轮工作起点，第三轮算法功能尚未实施。

## 最终状态与证据完整性

全部本次要求的工程与线上验收已通过，无待解决发布阻塞。桌面／390 像素是浏览器视口模拟，未声称真实手机硬件验收；视觉检查为上述截图抽核，全站布局由脚本检查。

生产 main 保持 `863cb9527cd0d6a5b093f61d4fa54bc88ae3e23c`。报告、截图、清单与验收脚本改进归档到 `codex/release-phase1-phase2-evidence`，不触发生产再次发布；第三轮工作分支 `codex/phase3-division-doubling-fibonacci` 从该生产 main 创建。

source-manifest.json 记录生产提交、应用源码树、验收脚本和全部发布证据的 SHA-256。UTF-8 文本按 LF 归一化，二进制按原始字节，清单不包含自身。历史评审证据目录没有覆盖。
