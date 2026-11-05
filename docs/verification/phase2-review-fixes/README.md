# 第二轮评审修复验收 — 2026-11-05

基线：`7652dbc9fb402ead4496aec69e10da8535630579`。本报告、截图与 source-manifest.json 对应本次修复提交；旧版证据目录保持不变，继续用于核对原固定提交。

## 修复范围

1. 把 conceptLessons 提取为共用数据源。首页搜索和章节搜索使用包含算法与概念演示的共用索引，覆盖中英文名称、关联节号和别名；按路径合并 `/power`，保留两份目录的可搜索信息。首页显示对应语言标题，数量按去重后的演示目录统计；章节搜索定位真实小节，仍区分小节与习题。
2. 霍纳系数在转换为 Number 之前逐个检查原始十进制整数文本。拒绝小数与科学记数法，保留空序列、长度和范围校验。`[1.00000000000000001,2]`、`[1e-400,2]` 不再被接受为舍入后的其他数值。
3. 逐项求值的 power 仅在乘法成功后与 term 一起更新。对于 `[1,0,0,0]`、x=1000000，失败时保留 term=1000000000000、power=2、乘法计数=2；失败乘法仍由原有提示及精确失败算式说明。

埃及乘法的既有“综合应用与图”分类没有改变。本次未新增算法范围或调整数学约定。

## 本次实际执行的验证

| 检查 | 结果与记录 |
| --- | --- |
| 先补回归测试 | RED：23 失败 / 13 通过，覆盖搜索缺失、原文舍入和提前递增指数；见 red.txt |
| 修复后针对性测试 | GREEN：5 文件 / 58 测试通过，见 green.txt；之后增加双语真实页面搜索回归 |
| ESLint | PASS，见 lint.txt |
| TypeScript | PASS，见 typescript.txt（成功输出为空） |
| 完整 Vitest | PASS，33 文件 / 266 测试；见 tests.txt。包含既有埃及乘法、二分查找与最短路径回归。 |
| 生产构建 | PASS，见 build.txt |
| 生产预览 | PASS，两个搜索入口各 14 组查询 × 中英文 × 1440/390；以及原文拒绝、溢出回看、自动重播、语言切换、来源返回及刷新。见 browser-audit.json |
| 视觉检查 | 章节搜索中文桌面、溢出状态英文手机截图已目视核对；整页无横向溢出，宽代码在本地容器滚动。 |

本次新增 28 项测试。测试中的共用目录检查覆盖所有概念演示名称与节号，验证按路径去重、别名、来源筛选，以及第9.2节／习题9.2的区分。

生产预览环境：http://127.0.0.1:4176，Windows、Node 22.17.1、npm 11.7.0、Vitest 4.1.8、Vite 8.0.16、独立无头 Edge 156.0.4314.58。本轮没有重跑上一轮的168项全站页面检查；本轮浏览器结果限于上述受影响页面和交互。修复期间 TypeScript 曾指出一处提取目录后遗留的未使用导入，移除后全部检查通过。现有 Browserslist 数据库过期提示保留，依赖未变更。

## 截图

| 位置 | 中文桌面 | 中文手机 | English desktop | English mobile |
| --- | --- | --- | --- | --- |
| 首页搜索 | [桌面](home-search-zh-1440.png) | [手机](home-search-zh-390.png) | [Desktop](home-search-en-1440.png) | [Mobile](home-search-en-390.png) |
| 章节搜索 | [桌面](chapter-search-zh-1440.png) | [手机](chapter-search-zh-390.png) | [Desktop](chapter-search-en-1440.png) | [Mobile](chapter-search-en-390.png) |
| 溢出保留状态 | [桌面](overflow-state-zh-1440.png) | [手机](overflow-state-zh-390.png) | [Desktop](overflow-state-en-1440.png) | [Mobile](overflow-state-en-390.png) |

## 用户提供的独立复核

用户报告在原固定提交上额外执行了1,694组霍纳求值与计数检查、4,617条埃及乘法轨迹检查和154个文本文件哈希核对，结果符合约定。这些是用户提供的独立结果，不计入本次工具实际执行的测试数量。原238项Vitest及168项页面检查仍由原提交的验收记录支持。

## 复现与证据

设置 TEMP/TMP 为仓库 `.local` 后运行工程检查。构建后运行 `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4176 --strictPort`，设置 NODE_PATH 到桌面运行时的 Playwright，执行 `node scripts/verify-phase2-review.cjs`。

source-manifest.json 使用 SHA-256，UTF-8 文本统一 LF 后计算，二进制按原始字节计算；不包含自身以避免循环哈希。提交后会逐项与提交内的文件复核。GitHub评审分支的推送不是线上部署验收；本次未验证生产网站。所有上述本次检查均已通过。
